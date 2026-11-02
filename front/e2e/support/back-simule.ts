import type { Page, Route } from '@playwright/test';
import { ORIGINE } from './site';

// Back simulé (PF-08) : Playwright intercepte dans le navigateur les deux routes du formulaire
// (page.route) et y répond selon le contrat d'API (E-01, E-02), scénario par scénario. Le build de
// test appelle le back sur l'origine du site (PF-07) : aucune requête préalable, et aucune requête
// ne quitte le navigateur. Un écran le pose par la fixture backSimule de banc.ts.

export const ROUTE_JETON = '/api/v1/form-tokens';
export const ROUTE_ENVOI = '/api/v1/contact-messages';

/** Les scénarios de PF-08 ; le jeton est délivré dans chacun, en retard dans le deuxième. */
export type Scenario =
  | 'jeton-a-l-heure'
  | 'jeton-en-retard'
  | 'refus-de-validation'
  | 'indisponible'
  | 'absence-de-reponse';

export interface Reglages {
  /** Retard de la réponse de E-01 dans « jeton-en-retard », en millisecondes (2000 par défaut). */
  retardJetonMs?: number;
  /** validationErrors du refus de validation ; par défaut, l'exemple du contrat. */
  validationErrors?: Record<string, string>;
}

/** Une requête interceptée, dans l'ordre d'arrivée, pour que l'écran vérifie ses appels. */
export interface RequeteRecue {
  route: string;
  methode: string;
  enTetes: Record<string, string>;
  corps: string | null;
}

/** Ce que le back simulé dit à la surveillance de banc.ts. */
export interface Declarations {
  /** Une erreur que rend un scénario, déclarée avant d'être rendue. */
  attendreReponseEnErreur(adresse: string, statut: number): void;
  /** Un problème qui fait échouer le test. */
  signaler(probleme: string): void;
}

/** Un code, un corps éventuel et un délai ; ou « aucune » : la requête reste sans réponse. */
type Reponse = { statut: number; corps?: unknown; delaiMs?: number } | 'aucune';

// Valeurs de départ du contrat (section 5) : 3 secondes de délai minimal, 2 heures de validité.
const JETON = { formToken: 'jeton-simule-opaque', minDelaySeconds: 3, expiresInSeconds: 7200 };
// Toute réponse de E-01 et de E-02 (sections 1 et 2) ; le site est la seule origine autorisée.
const EN_TETES = {
  'access-control-allow-origin': ORIGINE,
  vary: 'Origin',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'content-security-policy': "frame-ancestors 'none'",
};

/** Le format d'erreur (section 4) ; le front ne lit pas l'instant, fixe pour des corps égaux. */
function erreur(
  status: number,
  error: string,
  message: string,
  path: string,
  validationErrors: Record<string, string> | null = null,
): Reponse {
  const timestamp = '2026-10-27T09:30:00Z';
  return { statut: status, corps: { status, error, message, timestamp, path, validationErrors } };
}

function reponses(scenario: Scenario, reglages: Reglages): { jeton: Reponse; envoi: Reponse } {
  const jeton = { statut: 200, corps: JETON };
  const accepte = { statut: 202 };
  switch (scenario) {
    case 'jeton-a-l-heure':
      return { jeton, envoi: accepte };
    case 'jeton-en-retard':
      return { jeton: { ...jeton, delaiMs: reglages.retardJetonMs ?? 2000 }, envoi: accepte };
    case 'refus-de-validation': {
      const champs = reglages.validationErrors ?? { email: 'invalid-email', subject: 'required' };
      const message = 'One or more fields are invalid.';
      return { jeton, envoi: erreur(400, 'Bad Request', message, ROUTE_ENVOI, champs) };
    }
    case 'indisponible': {
      const message = 'The service is temporarily unavailable.';
      return { jeton, envoi: erreur(503, 'Service Unavailable', message, ROUTE_ENVOI) };
    }
    case 'absence-de-reponse':
      return { jeton, envoi: 'aucune' };
  }
}

/**
 * Intercepte E-01 et E-02 sur la page ; chaque erreur qu'un scénario rend est déclarée à la
 * surveillance avant d'être rendue, et toute requête hors contrat lui est signalée. Rend le journal
 * des requêtes reçues.
 */
export async function simulerBack(
  page: Page,
  scenario: Scenario,
  reglages: Reglages,
  surveillance: Declarations,
): Promise<RequeteRecue[]> {
  const recues: RequeteRecue[] = [];
  const { jeton, envoi } = reponses(scenario, reglages);
  for (const [route, reponse] of [
    [ROUTE_JETON, jeton],
    [ROUTE_ENVOI, envoi],
  ] as const) {
    await page.route(`${ORIGINE}${route}`, async (interception) => {
      const requete = interception.request();
      const enTetes = await requete.allHeaders();
      recues.push({ route, methode: requete.method(), enTetes, corps: requete.postData() });
      if (requete.method() === 'POST') {
        await repondre(page, interception, reponse, surveillance);
        return;
      }
      // Le contrat ne connaît que POST sur ces routes : une autre méthode reçoit le 405 du back,
      // non déclaré, et le test échoue dans les trois moteurs, Firefox compris.
      surveillance.signaler(`requête hors contrat : ${requete.method()} ${route}`);
      const refus = 'The request method is not supported.';
      await repondre(page, interception, erreur(405, 'Method Not Allowed', refus, route));
    });
  }
  return recues;
}

/** Rend la réponse ; une erreur n'est déclarée que si la surveillance est passée. */
async function repondre(
  page: Page,
  interception: Route,
  reponse: Reponse,
  surveillance?: Declarations,
): Promise<void> {
  // Sans réponse, la requête reste en attente : c'est le délai que la page se donne qui la borne.
  if (reponse === 'aucune') return;
  if (reponse.delaiMs) await new Promise((fin) => setTimeout(fin, reponse.delaiMs));
  if (page.isClosed()) return;
  if (reponse.statut >= 400) {
    surveillance?.attendreReponseEnErreur(interception.request().url(), reponse.statut);
  }
  const corps = reponse.corps === undefined ? '' : JSON.stringify(reponse.corps);
  const type: Record<string, string> = corps ? { 'content-type': 'application/json' } : {};
  await interception.fulfill({
    status: reponse.statut,
    headers: { ...EN_TETES, ...type },
    body: corps,
  });
}
