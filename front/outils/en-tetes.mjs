// Fichier d'en-têtes de l'hébergeur (PF-09), écrit par finaliser-build.mjs dans
// dist/front/browser/_headers depuis hebergement/en-tetes.modele : la politique de sécurité du
// contenu, avec les empreintes des scripts en ligne exécutables de tous les HTML du build et la base
// de l'API de l'environnement, les autres en-têtes et la mise en cache. Le build échoue sur un
// gestionnaire d'événement en ligne, une adresse « javascript: » ou une ligne trop longue.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

// La longueur maximale d'une ligne de _headers chez l'hébergeur.
export const LONGUEUR_MAXIMALE = 2000;
const typesExecutables = [undefined, 'text/javascript', 'module'];

/** Les empreintes des éléments script sans src d'un HTML que le navigateur exécute. */
export function empreintesScripts(html) {
  const empreintes = [];
  for (const [, attributs = '', texte] of html.matchAll(
    /<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi,
  )) {
    const type = /\stype\s*=\s*["']?([^"'\s>]+)/i.exec(attributs)?.[1].toLowerCase();
    if (/\ssrc\s*=/i.test(attributs) || !typesExecutables.includes(type)) continue;
    // Le navigateur hache le texte après la normalisation des fins de ligne de l'analyse HTML.
    const source = texte.replace(/\r\n?/g, '\n');
    empreintes.push(`'sha256-${createHash('sha256').update(source, 'utf8').digest('base64')}'`);
  }
  return empreintes;
}

/** Ce qu'aucune empreinte n'autorise : attributs de gestionnaire d'événement, adresses javascript:. */
export function scriptsInterdits(html) {
  const balises = html
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1')
    .matchAll(/<[a-z][^>]*>/gi);
  return [...balises].flatMap(([balise]) => [
    ...[...balise.matchAll(/\s(on[a-z]+)\s*=/gi)].map(([, nom]) => `attribut ${nom}`),
    ...(/=\s*["']?\s*javascript:/i.test(balise) ? ['adresse « javascript: »'] : []),
  ]);
}

function politique(valeur, { https, empreintes, baseApi }) {
  const jetons = { '{{empreintes}}': empreintes, '{{base-api}}': baseApi ? [baseApi] : [] };
  return valeur
    .split(';')
    .map((directive) =>
      directive
        .trim()
        .split(/\s+/)
        .flatMap((jeton) => jetons[jeton] ?? [jeton])
        .join(' '),
    )
    .filter((directive) => directive && (https || directive !== 'upgrade-insecure-requests'))
    .join('; ');
}

/** Le texte de _headers pour un environnement ; lève une erreur sur une ligne trop longue. */
export function texteEnTetes(modele, { environnement, baseApi, empreintes, fichiersCv }) {
  const https = environnement === 'production' || environnement === 'preproduction';
  const retire = (nom) =>
    (nom === 'Strict-Transport-Security' && !https) ||
    (nom === 'X-Robots-Tag' && environnement === 'production');
  const regles = [];
  for (const ligne of modele.split('\n').filter((l) => l.trim() && !l.startsWith('#'))) {
    const [nom, valeur] = ligne.trim().split(/: (.*)/);
    if (!/^\s/.test(ligne)) regles.push({ chemin: ligne, lignes: [] });
    else if (nom === 'Content-Security-Policy') {
      regles.at(-1).lignes.push(`  ${nom}: ${politique(valeur, { https, empreintes, baseApi })}`);
    } else if (!retire(nom)) regles.at(-1).lignes.push(ligne);
  }
  // La règle du CV devient une règle par fichier de CV présent, ou disparaît.
  const chemins = (chemin) =>
    chemin.includes('{{fichier-cv}}')
      ? fichiersCv.map((fichier) => chemin.replace('{{fichier-cv}}', fichier))
      : [chemin];
  const lignes = regles.flatMap(({ chemin, lignes }) =>
    chemins(chemin).flatMap((c) => [c, ...lignes]),
  );
  const tropLongue = lignes.find((ligne) => ligne.length > LONGUEUR_MAXIMALE);
  if (tropLongue) {
    throw new Error(
      `_headers : ligne de ${tropLongue.length} caractères, ${LONGUEUR_MAXIMALE} au plus`,
    );
  }
  return `${lignes.join('\n')}\n`;
}

/** Les fichiers de CV de chaque langue présents dans le build, servis sous /cv/. */
function fichiersCv(racine, sortie) {
  const contenu = join(racine, 'src', 'contenu');
  const noms = readdirSync(contenu, { withFileTypes: true })
    .filter((entree) => entree.isDirectory())
    .map(
      ({ name }) => JSON.parse(readFileSync(join(contenu, name, 'profil.json'), 'utf8')).cv.fichier,
    );
  return [...new Set(noms)].filter(
    (nom) => /^[\w.-]+$/.test(nom) && existsSync(join(sortie, 'cv', nom)),
  );
}

/** Écrit <sortie>/_headers ; lève une erreur si un HTML contient un script qu'aucune empreinte n'autorise. */
export function ecrireEnTetes(racine, sortie, { environnement, baseApi }) {
  const empreintes = new Set();
  const fautes = [];
  const pages = readdirSync(sortie, { recursive: true }).filter((nom) => nom.endsWith('.html'));
  for (const page of pages.sort()) {
    const html = readFileSync(join(sortie, page), 'utf8');
    empreintesScripts(html).forEach((empreinte) => empreintes.add(empreinte));
    scriptsInterdits(html).forEach((faute) => fautes.push(`${page} : ${faute}`));
  }
  if (fautes.length > 0) {
    throw new Error(`Script en ligne sans empreinte possible (PF-09) :\n${fautes.join('\n')}`);
  }
  const modele = readFileSync(join(racine, 'hebergement', 'en-tetes.modele'), 'utf8');
  const options = {
    environnement,
    baseApi,
    empreintes: [...empreintes].sort(),
    fichiersCv: fichiersCv(racine, sortie),
  };
  const fichier = join(sortie, '_headers');
  writeFileSync(fichier, texteEnTetes(modele, options));
  return { fichier: relative(racine, fichier), empreintes: empreintes.size };
}
