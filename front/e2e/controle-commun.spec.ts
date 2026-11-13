import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './support/banc';
import { PAGES_ERREUR, pagesDuBuild } from './support/site';

// Contrôle commun (TK-21, décision 2 de W12) : chaque page produite par le build, relevée à
// l'exécution, plus les trois adresses d'erreur, sans fichier, que le serveur sert avec 404.html
// ou projets/404.html ; un test par adresse, joué dans chacun des six profils. Le plan du site (TK-44) remplacera ce relevé. La
// surveillance de banc.ts y ajoute requêtes, console et politique de sécurité.

const ETIQUETTES_WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const LARGEURS = [320, 600, 900, 1200, 1600, 2560];

type Violation = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'][number];

/** La règle et ses cibles, pour qu'un auteur d'écran corrige vite. */
function decrire({ id, help, nodes }: Violation): string {
  const cibles = nodes.map(({ target }) => target.map(String).join(' '));
  return `${id} (${help}) sur ${cibles.join(', ')}`;
}

const adresses = [
  ...pagesDuBuild().map((adresse) => ({ adresse, statut: 200 })),
  ...PAGES_ERREUR.map(({ adresse }) => ({ adresse, statut: 404 })),
];

for (const { adresse, statut } of adresses) {
  test(`contrôle commun ${adresse}`, async ({ page, surveillance }) => {
    if (statut === 404) surveillance.attendreReponseEnErreur(adresse, 404);
    const reponse = await page.goto(adresse, { waitUntil: 'networkidle' });
    expect(reponse?.status(), `statut de ${adresse}`).toBe(statut);

    // Une seule violation des règles A et AA suffit à faire échouer le test.
    const { violations } = await new AxeBuilder({ page }).withTags(ETIQUETTES_WCAG).analyze();
    const fautes = violations.map(decrire);
    expect.soft(fautes, `axe-core (A et AA) : ${fautes.join(' ; ')}`).toEqual([]);

    // Le document entier, à chaque largeur, dans le profil courant, téléphones compris.
    const hauteur = page.viewportSize()?.height ?? 720;
    const depassements: string[] = [];
    for (const largeur of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: hauteur });
      const { contenu, visible } = await page.evaluate(() => {
        const racine = document.scrollingElement ?? document.documentElement;
        return { contenu: racine.scrollWidth, visible: racine.clientWidth };
      });
      if (contenu > visible) depassements.push(`${largeur} px (${contenu} px pour ${visible})`);
    }
    expect.soft(depassements, `défilement horizontal à ${depassements.join(', ')}`).toEqual([]);
  });
}
