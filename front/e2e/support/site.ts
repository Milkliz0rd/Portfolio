// Ce que le banc lit du build de test, dist/front/browser, relevé à l'exécution : ses pages, ses
// pages d'erreur et les en-têtes de son _headers. Un build absent, sans page ou d'un autre
// environnement que test fait échouer le banc dès le chargement des fichiers de test, au lieu de
// le laisser passer avec zéro test ou sur une autre politique de sécurité.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';

/**
 * L'origine du serveur local de test : ORIGINE_LOCALE_TEST d'outils/ecrire-configuration.mjs, que
 * le chargeur de Playwright ne sait pas importer. exigerBuildDeTest() vérifie que le build la porte.
 */
export const ORIGINE = 'http://localhost:8787';
export const DOSSIER_BUILD = join(__dirname, '..', '..', 'dist', 'front', 'browser');

/** Les pages d'erreur, chacune atteinte par une adresse sans fichier (PF-06). */
export const PAGES_ERREUR = [
  { cas: 'une adresse inconnue', adresse: '/une-adresse-inconnue', fichier: '404.html' },
  {
    cas: 'un projet inconnu',
    adresse: '/projets/identifiant-inconnu',
    fichier: 'projets/404.html',
  },
  // Un nom de fichier qu'aucun build ne contient, même une fois le CV fourni (C-03).
  { cas: 'le fichier du CV absent', adresse: '/cv/cv-absent.pdf', fichier: 'cv/404.html' },
] as const;

/** Le texte d'un fichier du build ; une erreur claire s'il manque. */
export function lireFichier(chemin: string): string {
  const fichier = join(DOSSIER_BUILD, chemin);
  if (!existsSync(fichier)) {
    throw new Error(`${chemin} absent du build : lancez « npm run e2e » (${DOSSIER_BUILD})`);
  }
  return readFileSync(fichier, 'utf8');
}

/** Les en-têtes d'une règle de _headers, noms en minuscules ; les retraits (« ! ») sont ignorés. */
export function enTetesDeLaRegle(regle: string): Record<string, string> {
  const enTetes: Record<string, string> = {};
  let dansLaRegle = false;
  const lignes = lireFichier('_headers').split('\n');
  for (const ligne of lignes.filter((l) => l.trim())) {
    if (!/^\s/.test(ligne)) {
      dansLaRegle = ligne.trim() === regle;
    } else if (dansLaRegle) {
      const [, nom, valeur] = /^\s+([\w-]+):\s*(.*)$/.exec(ligne) ?? [];
      if (nom && valeur !== undefined) enTetes[nom.toLowerCase()] = valeur;
    }
  }
  return enTetes;
}

/** Échoue si le build n'est pas celui de l'environnement test : sa politique serait une autre. */
export function exigerBuildDeTest(): void {
  const politique = enTetesDeLaRegle('/*')['content-security-policy'] ?? '';
  const connexions = /connect-src ([^;]*)/.exec(politique)?.[1].split(' ') ?? [];
  if (!connexions.includes(ORIGINE) || politique.includes('upgrade-insecure-requests')) {
    throw new Error(
      `Le build de ${DOSSIER_BUILD} n'est pas un build de test (connect-src sans ${ORIGINE}) : lancez « npm run e2e »`,
    );
  }
}

/** Une adresse par index.html du build : « / » pour la racine, « /parcours » pour parcours/. */
export function pagesDuBuild(): string[] {
  exigerBuildDeTest();
  const pages = readdirSync(DOSSIER_BUILD, { recursive: true, encoding: 'utf8' })
    .filter((fichier) => fichier === 'index.html' || fichier.endsWith(`${sep}index.html`))
    .map((fichier) => `/${fichier.split(sep).slice(0, -1).join('/')}`)
    .sort();
  if (pages.length === 0) throw new Error(`Aucune page dans ${DOSSIER_BUILD}`);
  return pages;
}
