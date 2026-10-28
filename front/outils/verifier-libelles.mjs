// Vérifie les libellés extraits par ng extract-i18n au format XLIFF 2 (PF-03) : chaque message,
// d'un modèle comme de $localize, porte un identifiant personnalisé (@@zone.element). Sans lui,
// Angular calcule un identifiant numérique depuis le texte, qui change à chaque retouche.
import { readFileSync } from 'node:fs';

const fichier = process.argv[2];
if (!fichier) {
  throw new Error('Usage : node outils/verifier-libelles.mjs <fichier XLIFF 2>');
}
const xliff = readFileSync(fichier, 'utf8');
if (!/<xliff\b[^>]*\bversion="2\.0"/.test(xliff)) {
  throw new Error(`${fichier} n'est pas un fichier XLIFF 2`);
}

const unites = [...xliff.matchAll(/<unit\b[^>]*\bid="([^"]*)"[^>]*>([\s\S]*?)<\/unit>/g)];
if (unites.length !== (xliff.match(/<unit\b/g) ?? []).length) {
  throw new Error(`${fichier} : une unité n'a pas pu être lue`);
}

const sansIdentifiant = unites.filter(([, id]) => /^\d+$/.test(id));
for (const [, id, corps] of sansIdentifiant) {
  const texte = corps.match(/<source>([\s\S]*?)<\/source>/)?.[1] ?? '';
  const lieux = [...corps.matchAll(/<note category="location">([^<]*)<\/note>/g)].map((m) => m[1]);
  console.error(`Sans identifiant personnalisé (${id}) : « ${texte} », ${lieux.join(', ')}`);
}
if (sansIdentifiant.length > 0) {
  console.error(`${sansIdentifiant.length} libellé(s) sans identifiant personnalisé.`);
  process.exitCode = 1;
} else {
  console.log(`${unites.length} libellé(s), tous avec un identifiant personnalisé.`);
}
