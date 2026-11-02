import { expect, test as base, type ConsoleMessage, type Page } from '@playwright/test';
import { ORIGINE } from './site';

// Point d'entrée des tests qui ouvrent une page (contrôle commun, scénarios des écrans) :
// import { expect, test } from './support/banc'. Chaque page y est surveillée, et le test
// échoue sur toute requête hors de l'origine du serveur local (data: et blob: mis à part, requêtes
// échouées comprises), toute erreur de console, toute erreur de page non rattrapée et toute
// violation de la politique de sécurité, dans les trois moteurs. Les requêtes vers un autre site
// sont en plus bloquées : aucun test ne sort sur le réseau.

// Chromium et WebKit, pas Firefox, écrivent cette erreur de console pour une réponse en erreur,
// document principal compris. Elle n'est excusée que rattachée, ligne et colonne 0, à l'adresse
// exacte d'une réponse que le test attend avec ce code, comme le document d'une page d'erreur en
// 404. Aucune autre ligne n'est excusée.
const REPONSE_EN_ERREUR =
  /^Failed to load resource: the server responded with a status of (\d{3}) \([^)]*\)$/;
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

  /** Déclare, avant la requête, qu'une adresse répondra avec ce code d'erreur. */
  attendreReponseEnErreur(adresse: string, statut: number): void {
    this.erreursAttendues.set(new URL(adresse, ORIGINE).href, statut);
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
    if (attendue) return;
    this.erreurs.push(
      texte.startsWith(VIOLATION) ? texte : `erreur de console : ${texte}${url ? ` (${url})` : ''}`,
    );
  }

  problemes(): string[] {
    return [...this.requetes.values(), ...this.erreurs];
  }
}

interface Fixtures {
  surveillance: Surveillance;
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
});

export { expect };
