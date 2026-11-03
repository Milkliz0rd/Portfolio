import { expect, test as base, type ConsoleMessage, type Page } from '@playwright/test';
import { simulerBack, type Reglages, type RequeteRecue, type Scenario } from './back-simule';
import { ORIGINE } from './site';

// Point d'entrée des tests qui ouvrent une page (contrôle commun, back simulé, scénarios des
// écrans) : import { expect, test } from './support/banc'. Chaque page y est surveillée, et le test
// échoue sur toute requête hors de l'origine du serveur local (data: et blob: mis à part, requêtes
// échouées comprises), toute erreur de console, toute erreur de page non rattrapée et toute
// violation de la politique de sécurité, dans les trois moteurs. Les requêtes vers un autre site
// sont en plus bloquées : aucun test ne sort sur le réseau.

// Chromium et WebKit, pas Firefox, écrivent cette erreur de console pour une réponse en erreur,
// document principal compris. Elle n'est excusée que rattachée, ligne et colonne 0, à l'adresse
// exacte d'une réponse que le test attend avec ce code : le document d'une page d'erreur en 404,
// ou l'erreur d'un scénario du back simulé (400, 503). Aucune autre réponse en erreur n'est
// excusée, pas même le 405 que le back simulé rend à une requête hors contrat.
const REPONSE_EN_ERREUR =
  /^Failed to load resource: the server responded with a status of (\d{3}) \([^)]*\)$/;
// Chromium seul écrit cette erreur pour une requête abandonnée (Firefox en fait un avertissement,
// WebKit une information). Elle n'est excusée que rattachée, ligne et colonne 0, à l'adresse
// exacte d'une requête que le test abandonne lui-même, et une seule fois par déclaration.
const REQUETE_ABANDONNEE = 'Failed to load resource: net::ERR_FAILED';
const VIOLATION = 'violation de la politique de sécurité :';

function exterieure(adresse: string): boolean {
  const { protocol, origin } = new URL(adresse);
  return protocol !== 'data:' && protocol !== 'blob:' && origin !== ORIGINE;
}

/** Les problèmes relevés sur une page, du premier écouteur à la fin du test. */
export class Surveillance {
  private readonly requetes = new Map<string, string>();
  private readonly erreurs: string[] = [];
  private readonly erreursAttendues = new Map<string, number>();
  private readonly abandonsAttendus = new Set<string>();
  private readonly erreursDePageAttendues = new Set<string>();

  /** Déclare, avant la requête, qu'une adresse répondra avec ce code d'erreur. */
  attendreReponseEnErreur(adresse: string, statut: number): void {
    this.erreursAttendues.set(new URL(adresse, ORIGINE).href, statut);
  }

  /** Déclare, avant la navigation, une requête que le test abandonne lui-même (route.abort). */
  attendreRequeteAbandonnee(adresse: string): void {
    this.abandonsAttendus.add(new URL(adresse, ORIGINE).href);
  }

  /** Déclare, avant la navigation, l'erreur que le test fait lever à la page : Error et ce message exact. */
  attendreErreurDePage(message: string): void {
    this.erreursDePageAttendues.add(message);
  }

  async ecouter(page: Page): Promise<void> {
    page.on('request', (requete) => {
      const adresse = requete.url();
      if (exterieure(adresse)) {
        this.requetes.set(adresse, `requête hors de l'origine : ${requete.method()} ${adresse}`);
      }
    });
    page.on('console', (message) => this.lireConsole(message));
    page.on('pageerror', ({ name, message }) => {
      if (name === 'Error' && this.erreursDePageAttendues.delete(message)) return;
      this.erreurs.push(`erreur de page non rattrapée : ${name}: ${message}`);
    });
    // Tous les moteurs n'écrivent pas une violation en erreur de console : cet écouteur, posé
    // avant tout script de la page, l'y écrit lui-même.
    await page.addInitScript((prefixe) => {
      document.addEventListener('securitypolicyviolation', (evenement) => {
        console.error(`${prefixe} ${evenement.effectiveDirective} ${evenement.blockedURI}`);
      });
    }, VIOLATION);
    await page.route(
      (adresse) => exterieure(adresse.href),
      (route) => route.abort('blockedbyclient'),
    );
  }

  private lireConsole(message: ConsoleMessage): void {
    if (message.type() !== 'error') return;
    const texte = message.text();
    const { url, lineNumber, columnNumber } = message.location();
    const code = REPONSE_EN_ERREUR.exec(texte)?.[1];
    const attendue =
      code !== undefined &&
      lineNumber === 0 &&
      columnNumber === 0 &&
      this.erreursAttendues.get(url) === Number(code);
    const abandonnee =
      texte === REQUETE_ABANDONNEE &&
      lineNumber === 0 &&
      columnNumber === 0 &&
      this.abandonsAttendus.delete(url);
    if (attendue || abandonnee) return;
    this.erreurs.push(
      texte.startsWith(VIOLATION) ? texte : `erreur de console : ${texte}${url ? ` (${url})` : ''}`,
    );
  }

  /** Inscrit un problème relevé hors de la page, comme une requête hors contrat du back simulé. */
  signaler(probleme: string): void {
    this.erreurs.push(probleme);
  }

  problemes(): string[] {
    return [...this.requetes.values(), ...this.erreurs];
  }

  /** Les violations de la politique de sécurité relevées jusqu'ici. */
  violations(): string[] {
    return this.erreurs.filter((erreur) => erreur.startsWith(VIOLATION));
  }
}

interface Fixtures {
  surveillance: Surveillance;
  /** Pose le back simulé sur la page, avant sa navigation ; rend le journal de ce qu'il reçoit. */
  backSimule: (scenario: Scenario, reglages?: Reglages) => Promise<RequeteRecue[]>;
}

export const test = base.extend<Fixtures>({
  surveillance: [
    async ({ page }, use) => {
      const surveillance = new Surveillance();
      await surveillance.ecouter(page);
      await use(surveillance);
      const problemes = surveillance.problemes();
      expect(problemes, problemes.join('\n')).toEqual([]);
    },
    { auto: true },
  ],
  backSimule: async ({ page, surveillance }, use) => {
    await use((scenario, reglages) => simulerBack(page, scenario, reglages ?? {}, surveillance));
  },
});

export { expect };
