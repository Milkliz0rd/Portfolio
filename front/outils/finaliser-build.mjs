// Finalise le build pré-rendu (PF-06) : place chaque page d'erreur là où l'hébergeur la cherche,
// 404/index.html devenant 404.html (de même pour projets/404 et cv/404), puis retire le document
// du rendu dans le navigateur de la route « ** », que l'hébergeur ne servirait jamais. Écrit enfin
// le fichier d'en-têtes de l'environnement du build (PF-09).
import { existsSync, renameSync, rmdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { lireConfiguration } from './ecrire-configuration.mjs';
import { ecrireEnTetes } from './en-tetes.mjs';

const racine = join(import.meta.dirname, '..');
const sortie = join(racine, 'dist', 'front', 'browser');

for (const page of ['404', 'projets/404', 'cv/404']) {
  const source = join(sortie, page, 'index.html');
  if (!existsSync(source)) {
    throw new Error(`Page d'erreur absente du build : ${page}/index.html`);
  }
  renameSync(source, join(sortie, `${page}.html`));
  rmdirSync(join(sortie, page));
}
rmSync(join(sortie, 'index.csr.html'), { force: true });
console.log("Pages d'erreur placées : 404.html, projets/404.html, cv/404.html");

// La même configuration que celle écrite avant le build, relue sans répéter ses avertissements.
const { environnement, baseApi } = lireConfiguration(racine, process.env);
const { fichier, empreintes } = ecrireEnTetes(racine, sortie, { environnement, baseApi });
console.log(
  `En-têtes écrits : ${fichier} (${environnement}, ${empreintes} empreinte(s) de script)`,
);
