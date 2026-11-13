import { expect, test } from '@playwright/test';
import {
  enTetesDeLaRegle,
  exigerBuildDeTest,
  lireFichier,
  ORIGINE,
  PAGES_ERREUR,
} from './support/site';

// Spécification de conformité du serveur local (PF-08) : chaque règle de l'hébergeur dont le site
// dépend, vérifiée sur le serveur que le banc emploie. Les requêtes partent de Node (fixture
// request), sans suivre les redirections : elles ne dépendent pas du moteur, mais tournent dans
// chaque profil, qui compte ainsi les mêmes tests que les autres.
exigerBuildDeTest();

const sansRedirection = { maxRedirects: 0 };
const regleGlobale = enTetesDeLaRegle('/*');
const autresEnTetes = Object.entries(regleGlobale).filter(
  ([nom]) => nom !== 'content-security-policy',
);

test('conformité : /contact en 200 sans redirection', async ({ request }) => {
  const reponse = await request.get('/contact', sansRedirection);
  expect(reponse.status(), '/contact en 200 sans redirection').toBe(200);
  expect(await reponse.text(), 'contenu de contact/index.html').toBe(
    lireFichier('contact/index.html'),
  );
});

test('conformité : /contact/ en 307 vers /contact', async ({ request }) => {
  const reponse = await request.get('/contact/', sansRedirection);
  expect(reponse.status(), '/contact/ en 307').toBe(307);
  const cible = new URL(reponse.headers()['location'] ?? '', ORIGINE).href;
  expect(cible, 'en-tête Location').toBe(`${ORIGINE}/contact`);
});

for (const { cas, adresse, fichier } of PAGES_ERREUR) {
  test(`conformité : ${cas} (${adresse}) en 404 avec ${fichier}`, async ({ request }) => {
    const attendu = lireFichier(fichier);
    const reponse = await request.get(adresse, sansRedirection);
    expect(reponse.status(), `${adresse} en 404`).toBe(404);
    expect(await reponse.text(), `contenu de ${fichier}`).toBe(attendu);
  });
}

// Les pages de l'ancienne préversion, une par section et celles de la candidature, ne sont plus
// des adresses du site : comme toute adresse sans route, la page introuvable de la racine, sans
// redirection (PF-06, PF-08). /projets seule, dont le document servi est relevé, est parmi les
// pages d'erreur (support/site.ts).
const pagesRetirees = ['parcours', 'competences', 'experience', 'methode', 'cv', 'cv/404'];

for (const page of pagesRetirees) {
  test(`conformité : /${page}, page retirée, en 404 avec 404.html`, async ({ request }) => {
    const reponse = await request.get(`/${page}`, sansRedirection);
    expect(reponse.status(), `/${page} en 404`).toBe(404);
    expect(await reponse.text(), 'contenu de 404.html').toBe(lireFichier('404.html'));
  });
}

// La règle « /* » doit couvrir aussi la page servie par not_found_handling, ce que la
// documentation de l'hébergeur ne dit pas (PF-08, PF-09).
const reponses = [
  { cas: 'une page en 200 (/contact)', adresse: '/contact', statut: 200 },
  { cas: "la 404 d'une adresse inconnue", adresse: PAGES_ERREUR[0].adresse, statut: 404 },
];

for (const { cas, adresse, statut } of reponses) {
  test(`conformité : Content-Security-Policy du _headers sur ${cas}`, async ({ request }) => {
    const reponse = await request.get(adresse, sansRedirection);
    expect(reponse.status(), `${adresse} en ${statut}`).toBe(statut);
    expect(reponse.headers()['content-security-policy'], 'Content-Security-Policy').toBe(
      regleGlobale['content-security-policy'],
    );
  });

  test(`conformité : autres en-têtes de la règle « /* » sur ${cas}`, async ({ request }) => {
    expect(autresEnTetes.length, 'en-têtes de la règle « /* » hors politique').toBeGreaterThan(0);
    const reponse = await request.get(adresse, sansRedirection);
    expect(reponse.status(), `${adresse} en ${statut}`).toBe(statut);
    const recus = reponse.headers();
    const valeurs = autresEnTetes.map(([nom]) => [nom, recus[nom]]);
    expect(valeurs, 'en-têtes de la règle « /* »').toEqual(autresEnTetes);
  });
}
