// Contrôle du contenu (PF-02, TK-28) : lit les fichiers de src/contenu/<langue>/ et
// public/images/, et sort une ligne par faute (fichier, champ, règle) ; une erreur fait échouer la
// commande. Un emplacement étiqueté est un avertissement en mode staging, une erreur en mode main.
// Dans la CI (GITHUB_ACTIONS), chaque ligne prend la forme d'une annotation de GitHub.
// Usage : npm run controle-contenu -- --mode=staging (ou --mode=main)
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { MODELE, MODELE_PROJET } from './modele.mjs';
import * as regles from './regles.mjs';
import { emplacements, faute, parcourir } from './structure.mjs';
import * as textes from './textes.mjs';

/** Les règles, une par fonction : chacune reçoit le contenu lu et rend ses fautes. */
const REGLES = [emplacements, ...Object.values(regles), ...Object.values(textes)];

const parFichier = (a, b) => (a.fichier < b.fichier ? -1 : a.fichier > b.fichier ? 1 : 0);

/**
 * Les fautes de documents lus ({ nom, fichier, forme, donnees }), rangées par fichier : leur
 * structure, puis chaque règle. contexte : { mode, racine }, racine étant le dossier de public/.
 */
export function controlerDocuments(documents, contexte) {
  const sortie = { fautes: [], feuilles: [] };
  for (const { fichier, donnees, forme } of documents) {
    parcourir(fichier, donnees, forme, '', sortie);
  }
  const lu = { ...contexte, documents, feuilles: sortie.feuilles };
  return [...sortie.fautes, ...REGLES.flatMap((regle) => regle(lu))].sort(parFichier);
}

/** Les fichiers d'une langue, lus en documents, et les fautes de lecture (absent, illisible…). */
function lireLangue(racine, langue) {
  const dossier = join(racine, 'src', 'contenu', langue);
  const chemin = (nom) => relative(racine, join(dossier, nom));
  const json = (nom) => nom.endsWith('.json');
  const fautes = readdirSync(dossier)
    .filter((nom) => json(nom) && !Object.hasOwn(MODELE, nom))
    .map((nom) => faute(chemin(nom), '', 'fichier hors du modèle'));
  const lire = ([nom, forme]) => {
    try {
      const donnees = JSON.parse(readFileSync(join(dossier, nom), 'utf8'));
      return [{ nom, fichier: chemin(nom), forme, donnees }];
    } catch ({ code, message }) {
      const [regle, detail] = code === 'ENOENT' ? ['fichier absent'] : ['JSON illisible', message];
      fautes.push(faute(chemin(nom), '', regle, detail));
      return [];
    }
  };
  const projets = existsSync(join(dossier, 'projets')) ? readdirSync(join(dossier, 'projets')) : [];
  const formes = projets
    .filter(json)
    .sort()
    .map((nom) => [`projets/${nom}`, MODELE_PROJET]);
  return { documents: [...Object.entries(MODELE), ...formes].flatMap(lire), fautes };
}

/** Les fautes du contenu de chaque langue de <racine>/src/contenu/, rangées par fichier. */
export function controlerContenu(racine, mode) {
  const langues = readdirSync(join(racine, 'src', 'contenu'), { withFileTypes: true })
    .filter((entree) => entree.isDirectory())
    .map(({ name }) => name);
  return langues
    .sort()
    .flatMap((langue) => {
      const { documents, fautes } = lireLangue(racine, langue);
      return [...fautes, ...controlerDocuments(documents, { mode, racine })];
    })
    .sort(parFichier);
}

/** La ligne lisible d'une faute : gravité, fichier, champ, règle, puis le détail. */
export function ligne({ gravite, fichier, champ, regle, detail }) {
  const ou = champ ? `${fichier}, ${champ}` : fichier;
  return `${gravite} — ${ou} : ${regle}${detail ? ` (${detail})` : ''}`;
}

const echapper = (texte) =>
  texte.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');

/** La même ligne en annotation de GitHub, rattachée au fichier depuis la racine du dépôt. */
export function annotation(fauteVue, racine, depot) {
  const niveau = fauteVue.gravite === 'erreur' ? 'error' : 'warning';
  const fichier = echapper(relative(depot, join(racine, fauteVue.fichier)))
    .replaceAll(':', '%3A')
    .replaceAll(',', '%2C');
  return `::${niveau} file=${fichier},title=Contrôle du contenu::${echapper(ligne(fauteVue))}`;
}

const nombre = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`;

/** La commande : ses lignes et son code de sortie (1 si une erreur, 2 sans mode reconnu). */
export function commande(args, { racine, env }) {
  const mode = args.find((arg) => arg.startsWith('--mode='))?.slice('--mode='.length);
  if (mode !== 'staging' && mode !== 'main') {
    return { code: 2, lignes: ['Usage : npm run controle-contenu -- --mode=staging (ou main)'] };
  }
  const fautes = controlerContenu(racine, mode);
  const depot = env.GITHUB_WORKSPACE ?? join(racine, '..');
  const enCi = env.GITHUB_ACTIONS === 'true';
  const erreurs = fautes.filter(({ gravite }) => gravite === 'erreur').length;
  const bilan = `${nombre(erreurs, 'erreur')}, ${nombre(fautes.length - erreurs, 'avertissement')}`;
  return {
    code: erreurs > 0 ? 1 : 0,
    lignes: [
      ...fautes.map((f) => (enCi ? annotation(f, racine, depot) : ligne(f))),
      `Contrôle du contenu, mode ${mode} : ${bilan}.`,
    ],
  };
}

if (import.meta.main) {
  const racine = join(import.meta.dirname, '..', '..');
  const { code, lignes } = commande(process.argv.slice(2), { racine, env: process.env });
  for (const texte of lignes) (code === 2 ? console.error : console.log)(texte);
  process.exitCode = code;
}
