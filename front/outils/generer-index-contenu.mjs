// Écrit l'index des projets de chaque langue (PF-02), src/contenu/<langue>/projets/index.genere.ts :
// un import par fichier JSON du dossier, vérifié par « satisfies Projet », qui fait échouer la
// compilation si un champ obligatoire manque, et cvPresent, vrai si le fichier que nomme
// cv.fichier dans profil.json est dans public/cv/. Lancé avant chaque build, test, analyse,
// extraction des libellés et serveur de développement ; l'index n'est pas versionné.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const nomImport = (fichier) => `projet_${fichier.replace(/\.json$/, '').replace(/\W+/g, '_')}`;

/** Le texte de l'index, dans l'ordre reçu, déjà dans la forme de Prettier (printWidth 100). */
export function texteIndex(fichiers, cvPresent) {
  const imports = fichiers.map((fichier) => `import ${nomImport(fichier)} from './${fichier}';\n`);
  const elements = fichiers.map((fichier) => `${nomImport(fichier)} satisfies Projet`);
  const debut = 'export const projets: readonly Projet[] = [';
  const enLigne = `${debut}${elements.join(', ')}];`;
  const liste =
    enLigne.length <= 100 ? enLigne : `${debut}\n${elements.map((e) => `  ${e},\n`).join('')}];`;
  return [
    '// Écrit par outils/generer-index-contenu.mjs : ni à modifier, ni à versionner.',
    "import type { Projet } from '../../../app/interfaces/contenu';",
    imports.join(''),
    liste,
    `export const cvPresent = ${cvPresent};`,
    '',
  ].join('\n');
}

/** Écrit l'index de chaque langue de <racine>/src/contenu/, fichiers par nom ; rend ses chemins. */
export function genererIndexContenu(racine) {
  const contenu = join(racine, 'src', 'contenu');
  const langues = readdirSync(contenu, { withFileTypes: true }).filter((e) => e.isDirectory());
  return langues.map(({ name: langue }) => {
    const dossier = join(contenu, langue, 'projets');
    mkdirSync(dossier, { recursive: true });
    const fichiers = readdirSync(dossier).filter((nom) => nom.endsWith('.json'));
    const { cv } = JSON.parse(readFileSync(join(contenu, langue, 'profil.json'), 'utf8'));
    // Un emplacement étiqueté n'est pas un nom de fichier : le CV est alors absent.
    const nomDeFichier = /^[\w.-]+$/.test(cv.fichier);
    const cvPresent = nomDeFichier && existsSync(join(racine, 'public', 'cv', cv.fichier));
    const index = join(dossier, 'index.genere.ts');
    writeFileSync(index, texteIndex(fichiers.sort(), cvPresent));
    return index;
  });
}

if (import.meta.main) {
  const racine = join(import.meta.dirname, '..');
  for (const index of genererIndexContenu(racine)) {
    console.log(`Index des projets écrit : ${relative(racine, index)}`);
  }
}
