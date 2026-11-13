// Règles du contenu qui croisent les champs (PF-02), une par fonction exportée : identifiants des
// projets, rangs, images, liens, renvoi de la méthode, parcours, volets, HTML. Un champ étiqueté
// n'y est jamais soumis (seulement à la règle des emplacements), ni un champ de mauvais type, que
// la structure relève déjà.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CLES_VOLET, TYPES_ETAPE } from './modele.mjs';
import { etiquete, faute } from './structure.mjs';
import { dimensionsWebp } from './webp.mjs';

/** La valeur au bout du chemin, ou undefined dès qu'un maillon n'est pas un objet. */
const lire = (valeur, ...cles) =>
  cles.reduce((v, cle) => (typeof v === 'object' && v !== null ? v[cle] : undefined), valeur);
const liste = (valeur) => (Array.isArray(valeur) ? valeur : []);
const texte = (valeur) => typeof valeur === 'string' && !etiquete(valeur);
const document = (documents, nom) => documents.find((d) => d.nom === nom) ?? { donnees: {} };
const projets = (documents) => documents.filter(({ nom }) => nom.startsWith('projets/'));

/** Identifiants de projet : minuscules, chiffres et tirets, uniques, le nom du fichier, pas 404. */
export function identifiantsDeProjet({ documents }) {
  const pris = new Set();
  return projets(documents).flatMap(({ nom, fichier, donnees }) => {
    const identifiant = lire(donnees, 'identifiant');
    const detail = !texte(identifiant)
      ? null
      : !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(identifiant)
        ? 'minuscules, chiffres et tirets'
        : identifiant === '404'
          ? '« 404 » est réservé à la page introuvable'
          : pris.has(identifiant)
            ? 'déjà pris par un autre projet'
            : nom !== `projets/${identifiant}.json`
              ? 'différent du nom du fichier'
              : null;
    pris.add(identifiant);
    return detail ? [faute(fichier, 'identifiant', 'identifiant de projet', detail)] : [];
  });
}

/** Rangs entiers et uniques : dans chaque liste de competences.json, et entre les projets. */
export function rangs({ feuilles }) {
  const pris = new Set();
  return feuilles
    .filter(({ genre, champ }) => genre === 'nombre' && /(^|\.)rang$/.test(champ))
    .flatMap(({ fichier, champ, valeur }) => {
      const groupe =
        champ === 'rang' ? 'projets' : `${fichier} ${champ.replace(/\[\d+\]\.rang$/, '')}`;
      const detail = !Number.isInteger(valeur)
        ? 'entier attendu'
        : pris.has(`${groupe} ${valeur}`)
          ? `${valeur} déjà pris`
          : null;
      pris.add(`${groupe} ${valeur}`);
      return detail ? [faute(fichier, champ, 'rang', detail)] : [];
    });
}

/** Images : en WebP sous public/images/projets/<identifiant>/, aux dimensions déclarées. */
export function images({ documents, racine }) {
  return projets(documents).flatMap(({ fichier, donnees }) => {
    const identifiant = lire(donnees, 'identifiant');
    const vues = liste(lire(donnees, 'captures')).map((image, i) => [`captures[${i}]`, image]);
    if (lire(donnees, 'vignette')) vues.push(['vignette', donnees.vignette]);
    return vues.flatMap(([champ, image]) => {
      const nom = lire(image, 'fichier');
      if (!texte(nom) || !texte(identifiant)) return [];
      const signaler = (detail) => [faute(fichier, `${champ}.fichier`, 'image', detail)];
      const dossier = `public/images/projets/${identifiant}/`;
      if (!/^[\w.-]+\.webp$/.test(nom)) return signaler('un nom de fichier en .webp attendu');
      if (!existsSync(join(racine, dossier, nom))) return signaler(`absente de ${dossier}`);
      const taille = dimensionsWebp(readFileSync(join(racine, dossier, nom)));
      if (!taille) return signaler('pas un fichier WebP');
      const { largeur, hauteur } = image;
      if (typeof largeur !== 'number' || typeof hauteur !== 'number') return [];
      if (largeur === taille.largeur && hauteur === taille.hauteur) return [];
      const vu = `${taille.largeur} × ${taille.hauteur}`;
      return [faute(fichier, champ, 'image', `${largeur} × ${hauteur} déclarées, ${vu} lues`)];
    });
  });
}

/** Liens : une adresse HTTPS ; un lien de segment peut aussi être une adresse interne (/…). */
export function liensHttps({ feuilles }) {
  const https = (adresse) => /^https:\/\/[^\s/]+\S*$/.test(adresse);
  const interne = (adresse) => /^\/(?!\/)\S*$/.test(adresse);
  return feuilles
    .filter(({ genre }) => genre === 'https' || genre === 'lien')
    .filter(({ genre, valeur }) => !https(valeur) && !(genre === 'lien' && interne(valeur)))
    .map(({ fichier, champ, valeur }) => faute(fichier, champ, 'lien en HTTPS', `« ${valeur} »`));
}

/** Le renvoi de la méthode mène à un projet existant (MF-22). */
export function renvoiDeLaMethode({ documents }) {
  const { fichier, donnees } = document(documents, 'methode.json');
  const projet = lire(donnees, 'renvoi', 'projet');
  const identifiants = projets(documents).map((p) => lire(p.donnees, 'identifiant'));
  if (!texte(projet) || identifiants.includes(projet)) return [];
  return [faute(fichier, 'renvoi.projet', 'renvoi de la méthode', `aucun projet « ${projet} »`)];
}

/** Le parcours : ses étapes dans l'ordre reconversion, bac+3, master (MF-07). */
export function ordreDuParcours({ documents }) {
  const { fichier, donnees } = document(documents, 'parcours.json');
  let plusLoin = 0;
  return liste(lire(donnees, 'etapes')).flatMap((etape, i) => {
    const rang = TYPES_ETAPE.indexOf(lire(etape, 'type'));
    if (rang >= 0 && rang < plusLoin) {
      return [faute(fichier, `etapes[${i}].type`, 'ordre du parcours', TYPES_ETAPE.join(', '))];
    }
    plusLoin = Math.max(plusLoin, rang);
    return [];
  });
}

/** Le bac+3 nomme son établissement (Q-04). */
export function etablissementDuBac3({ documents }) {
  const { fichier, donnees } = document(documents, 'parcours.json');
  return liste(lire(donnees, 'etapes')).flatMap((etape, i) =>
    lire(etape, 'type') === 'bac+3' && !Object.hasOwn(etape, 'etablissement')
      ? [faute(fichier, `etapes[${i}].etablissement`, 'établissement du bac+3', 'absent')]
      : [],
  );
}

const annee = (valeur) => Number.isInteger(valeur) && valeur >= 1000 && valeur <= 9999;
const mois = (valeur) => Number.isInteger(valeur) && valeur >= 1 && valeur <= 12;

/** Dates complètes (année sur quatre chiffres, mois de 1 à 12), la fin jamais avant le début. */
export function dates({ documents }) {
  const parcours = document(documents, 'parcours.json');
  const fautes = [];
  /** Une date complète, { a, m }, ou null ; ses fautes vont à la liste. */
  const valeur = (fichier, champ, date) => {
    const [a, m] = [lire(date, 'annee'), lire(date, 'mois')];
    if (typeof a === 'number' && !annee(a))
      fautes.push(faute(fichier, `${champ}.annee`, 'date', `année « ${a} »`));
    if (typeof m === 'number' && !mois(m))
      fautes.push(faute(fichier, `${champ}.mois`, 'date', `mois « ${m} »`));
    return annee(a) && (m === undefined || mois(m)) ? { a, m } : null;
  };
  const avant = (fin, debut) => fin.a < debut.a || (fin.a === debut.a && fin.m < debut.m);
  liste(lire(parcours.donnees, 'etapes')).forEach((etape, i) => {
    const debut = valeur(parcours.fichier, `etapes[${i}].debut`, lire(etape, 'debut'));
    const fin = valeur(parcours.fichier, `etapes[${i}].fin`, lire(etape, 'fin'));
    if (debut && fin && avant(fin, debut)) {
      fautes.push(faute(parcours.fichier, `etapes[${i}].fin`, 'fin avant le début'));
    }
  });
  const experience = document(documents, 'experience.json');
  const periode = lire(experience.donnees, 'periode');
  const [debut, fin] = [lire(periode, 'debut'), lire(periode, 'fin')];
  for (const [champ, a] of Object.entries({ debut, fin })) {
    if (typeof a === 'number' && !annee(a))
      fautes.push(faute(experience.fichier, `periode.${champ}`, 'date', `année « ${a} »`));
  }
  if (annee(debut) && annee(fin) && fin < debut) {
    fautes.push(faute(experience.fichier, 'periode.fin', 'fin avant le début'));
  }
  return fautes;
}

/** Une seule étape du parcours mise en avant : chacune après la première est une faute. */
export function etapeMiseEnAvant({ documents }) {
  const { fichier, donnees } = document(documents, 'parcours.json');
  const misesEnAvant = liste(lire(donnees, 'etapes'))
    .map((etape, i) => (lire(etape, 'etat') === 'mise-en-avant' ? i : -1))
    .filter((i) => i >= 0);
  return misesEnAvant
    .slice(1)
    .map((i) => faute(fichier, `etapes[${i}].etat`, 'une seule étape mise en avant'));
}

/** Exactement trois volets, aux trois clés (MF-11) : une clé inconnue relève de la structure. */
export function troisVolets({ documents }) {
  const { fichier, donnees } = document(documents, 'experience.json');
  const volets = lire(donnees, 'volets');
  if (!Array.isArray(volets) || volets.length === 0) return [];
  if (volets.length !== 3) {
    const detail = `${volets.length} au lieu de 3 : ${CLES_VOLET.join(', ')}`;
    return [faute(fichier, 'volets', 'trois volets', detail)];
  }
  const cles = volets.map((volet) => lire(volet, 'cle'));
  return cles.flatMap((cle, i) =>
    CLES_VOLET.includes(cle) && cles.indexOf(cle) !== i
      ? [faute(fichier, `volets[${i}].cle`, 'trois volets', `« ${cle} » en double`)]
      : [],
  );
}

/** Pas de HTML : aucun « < » suivi d'une lettre, d'une barre ou d'un point d'exclamation. */
export function pasDeHtml({ feuilles }) {
  const balise = /<[\p{L}/!][^>\s]*/u;
  return feuilles
    .filter(({ genre, valeur }) => typeof valeur === 'string' && genre !== 'emplacement')
    .filter(({ valeur }) => balise.test(valeur))
    .map(({ fichier, champ, valeur }) => {
      return faute(fichier, champ, 'pas de HTML', `« ${valeur.match(balise)[0]} »`);
    });
}
