import type { Page } from '@playwright/test';
import { ROUTE_ENVOI, ROUTE_JETON } from './support/back-simule';
import { expect, test } from './support/banc';

// Preuves du back simulé : aucune page n'appelle encore le back (TK-42, TK-43). Chaque scénario
// s'éprouve par fetch depuis une page du site, de même origine, contre les valeurs du contrat
// écrites ici et non reprises de l'aide : codes, en-têtes et corps exacts de E-01 et de E-02.

const EN_TETES_DU_CONTRAT = {
  'access-control-allow-origin': 'http://localhost:8787',
  vary: 'Origin',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'content-security-policy': "frame-ancestors 'none'",
};
const INSTANT_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
// L'exemple du contrat, adresse écrite sans arobase : le back simulé ne valide pas les champs.
const MESSAGE = {
  lastName: 'Exemple de nom',
  firstName: 'Exemple de prénom',
  email: 'visiteur(at)exemple',
  subject: 'Exemple de sujet',
  message: 'Exemple de message,\nsur deux lignes.',
  website: '',
  formToken: 'jeton-simule-opaque',
};

interface Resultat {
  statut?: number;
  enTetes?: Record<string, string>;
  corps?: string;
  erreur?: string;
  dureeMs: number;
}

/** Un appel depuis la page, comme le fera le client du contrat (PF-07), abandonné après delaiMs. */
function appeler(page: Page, route: string, corps?: object, delaiMs = 10_000): Promise<Resultat> {
  return page.evaluate(
    async ({ route, corps, delaiMs }) => {
      const debut = performance.now();
      const abandon = new AbortController();
      const minuteur = setTimeout(() => abandon.abort(), delaiMs);
      // E-01 part sans corps ni Content-Type, pour rester une requête simple ; E-02 en JSON.
      const json = { Accept: 'application/json', 'Content-Type': 'application/json' };
      try {
        const reponse = await fetch(route, {
          method: 'POST',
          credentials: 'omit',
          signal: abandon.signal,
          headers: corps ? json : { Accept: 'application/json' },
          body: corps ? JSON.stringify(corps) : undefined,
        });
        const enTetes = Object.fromEntries(reponse.headers);
        const texte = await reponse.text();
        return {
          statut: reponse.status,
          enTetes,
          corps: texte,
          dureeMs: performance.now() - debut,
        };
      } catch (e) {
        const erreur = e instanceof Error ? e.name : String(e);
        return { erreur, dureeMs: performance.now() - debut };
      } finally {
        clearTimeout(minuteur);
      }
    },
    { route, corps, delaiMs },
  );
}

/** Les réponses de l'API venues d'un serveur : aucune, si le navigateur n'a rien laissé sortir. */
function servies(page: Page): () => Promise<string[]> {
  const verifications: Promise<string | null>[] = [];
  page.on('response', (reponse) => {
    if (!reponse.url().includes('/api/')) return;
    verifications.push(reponse.serverAddr().then((serveur) => (serveur ? reponse.url() : null)));
  });
  return async () => (await Promise.all(verifications)).filter((url) => url !== null);
}

/** Ouvre une page du site et demande le jeton, comme à la première interaction (E-01). */
async function demanderJeton(page: Page): Promise<Resultat> {
  await page.goto('/contact');
  return appeler(page, ROUTE_JETON);
}

function verifierJeton(jeton: Resultat): void {
  expect(jeton.statut).toBe(200);
  expect(jeton.enTetes).toMatchObject({
    ...EN_TETES_DU_CONTRAT,
    'content-type': 'application/json',
  });
  const corps: unknown = JSON.parse(jeton.corps ?? '');
  expect(corps).toEqual({
    formToken: expect.any(String),
    minDelaySeconds: 3,
    expiresInSeconds: 7200,
  });
}

/** 202 sans corps ; sur WebKit, Playwright impose un type au corps qu'il fournit (text/plain). */
function verifierAccepte(envoi: Resultat, moteur: string): void {
  expect(envoi.statut).toBe(202);
  expect(envoi.corps).toBe('');
  expect(envoi.enTetes).toMatchObject(EN_TETES_DU_CONTRAT);
  expect(envoi.enTetes?.['content-type']).toBe(moteur === 'webkit' ? 'text/plain' : undefined);
}

function verifierErreur(envoi: Resultat, attendu: Record<string, unknown>): void {
  expect(envoi.statut).toBe(attendu['status']);
  expect(envoi.enTetes).toMatchObject({
    ...EN_TETES_DU_CONTRAT,
    'content-type': 'application/json',
  });
  const corps: unknown = JSON.parse(envoi.corps ?? '');
  expect(corps).toEqual({ ...attendu, timestamp: expect.stringMatching(INSTANT_UTC) });
}

test("back simulé : jeton à l'heure", async ({ page, backSimule, browserName }) => {
  const recues = await backSimule('jeton-a-l-heure');
  const serveurs = servies(page);
  verifierJeton(await demanderJeton(page));
  verifierAccepte(await appeler(page, ROUTE_ENVOI, MESSAGE), browserName);
  // E-01 sans corps ni Content-Type ; E-02 en JSON, le corps tel qu'envoyé.
  expect(recues.map(({ route, methode }) => `${methode} ${route}`)).toEqual([
    `POST ${ROUTE_JETON}`,
    `POST ${ROUTE_ENVOI}`,
  ]);
  expect(recues[0]?.corps ?? null).toBeNull();
  expect(recues[0]?.enTetes['content-type']).toBeUndefined();
  expect(recues[1]?.enTetes['content-type']).toBe('application/json');
  expect(JSON.parse(recues[1]?.corps ?? '')).toEqual(MESSAGE);
  expect(await serveurs(), 'réponses venues du serveur').toEqual([]);
});

test('back simulé : jeton en retard', async ({ page, backSimule, browserName }) => {
  const retard = 1500;
  await backSimule('jeton-en-retard', { retardJetonMs: retard });
  const serveurs = servies(page);
  const jeton = await demanderJeton(page);
  verifierJeton(jeton);
  // Les minuteurs de Node et du navigateur ne tombent pas à la milliseconde près.
  expect(jeton.dureeMs).toBeGreaterThanOrEqual(retard - 50);
  verifierAccepte(await appeler(page, ROUTE_ENVOI, MESSAGE), browserName);
  expect(await serveurs(), 'réponses venues du serveur').toEqual([]);
});

test('back simulé : refus de validation', async ({ page, backSimule }) => {
  await backSimule('refus-de-validation');
  const serveurs = servies(page);
  verifierJeton(await demanderJeton(page));
  verifierErreur(await appeler(page, ROUTE_ENVOI, MESSAGE), {
    status: 400,
    error: 'Bad Request',
    message: 'One or more fields are invalid.',
    path: '/api/v1/contact-messages',
    validationErrors: { email: 'invalid-email', subject: 'required' },
  });
  expect(await serveurs(), 'réponses venues du serveur').toEqual([]);
});

test('back simulé : 503', async ({ page, backSimule }) => {
  await backSimule('indisponible');
  const serveurs = servies(page);
  verifierJeton(await demanderJeton(page));
  verifierErreur(await appeler(page, ROUTE_ENVOI, MESSAGE), {
    status: 503,
    error: 'Service Unavailable',
    message: 'The service is temporarily unavailable.',
    path: '/api/v1/contact-messages',
    validationErrors: null,
  });
  expect(await serveurs(), 'réponses venues du serveur').toEqual([]);
});

test('back simulé : absence de réponse', async ({ page, backSimule }) => {
  const recues = await backSimule('absence-de-reponse');
  const serveurs = servies(page);
  verifierJeton(await demanderJeton(page));
  // E-02 ne répond jamais : le délai que la page se donne borne l'attente.
  const envoi = await appeler(page, ROUTE_ENVOI, MESSAGE, 1000);
  expect(envoi.erreur).toBe('AbortError');
  expect(envoi.dureeMs).toBeGreaterThanOrEqual(950);
  // La suite n'est pas bloquée : un nouvel appel reçoit sa réponse.
  verifierJeton(await appeler(page, ROUTE_JETON));
  expect(recues.map(({ route }) => route)).toEqual([ROUTE_JETON, ROUTE_ENVOI, ROUTE_JETON]);
  expect(await serveurs(), 'réponses venues du serveur').toEqual([]);
});
