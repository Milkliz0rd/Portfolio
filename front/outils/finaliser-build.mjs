// Finalise le build pré-rendu (PF-06) : place les deux pages d'erreur où l'hébergeur les cherche,
// 404/index.html devenant 404.html et projets/404/index.html projets/404.html, puis retire le
// document du rendu dans le navigateur de la route « ** », que l'hébergeur ne servirait jamais.
// Écrit enfin le fichier d'en-têtes de l'environnement du build (PF-09). Le build de test seul
// reçoit les images du contenu de test des fiches (TK-37).
import { existsSync, renameSync, rmdirSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { copierImagesDuBanc, lireConfiguration } from './ecrire-configuration.mjs';
import { ecrireEnTetes } from './en-tetes.mjs';

const racine = join(import.meta.dirname, '..');
const sortie = join(racine, 'dist', 'front', 'browser');

for (const page of ['404', 'projets/404']) {
  const source = join(sortie, page, 'index.html');
  if (!existsSync(source)) {
    throw new Error(`Page d'erreur absente du build : ${page}/index.html`);
  }
  renameSync(source, join(sortie, `${page}.html`));
  rmdirSync(join(sortie, page));
}
rmSync(join(sortie, 'index.csr.html'), { force: true });
console.log("Pages d'erreur placées : 404.html, projets/404.html");

// La même configuration que celle écrite avant le build, relue sans répéter ses avertissements.
const { environnement, baseApi } = lireConfiguration(racine, process.env);
const imagesDuBanc = copierImagesDuBanc(racine, sortie, environnement);
if (imagesDuBanc) {
  console.log(`Images du contenu de test copiées : ${relative(racine, imagesDuBanc)}`);
}
const { fichier, empreintes } = ecrireEnTetes(racine, sortie, { environnement, baseApi });
console.log(
  `En-têtes écrits : ${fichier} (${environnement}, ${empreintes} empreinte(s) de script)`,
);
