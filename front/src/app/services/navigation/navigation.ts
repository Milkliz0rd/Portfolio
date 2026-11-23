import { Location } from '@angular/common';
import {
  computed,
  DestroyRef,
  DOCUMENT,
  inject,
  Injectable,
  makeStateKey,
  signal,
  TransferState,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import type { CourantLien } from '../../components/lien/lien';
import { DefilementService } from '../defilement/defilement';
import { sectionLue } from './section-lue';

/** Les sections de la page principale, dans l'ordre du plan du site ; leur id est leur ancre. */
export const SECTIONS = ['parcours', 'competences', 'experience', 'methode', 'projets'] as const;
export type Section = (typeof SECTIONS)[number];
/** Une entrée que l'en-tête signale (EC-00) : l'accueil, une section ou le contact. */
export type Entree = 'accueil' | Section | 'contact';

/** Le chemin de la page principale. */
export const PRINCIPALE = '/';

/** Le chemin d'une adresse du routeur, sans sa requête ni son ancre. */
export const cheminDe = (adresse: string) => adresse.split(/[?#]/, 1)[0];

/** L'élément que nomme une ancre : par son id, puis par son nom, comme le navigateur. */
export function cibleDe(document: Document, ancre: string): HTMLElement | null {
  return document.getElementById(ancre) ?? document.getElementsByName(ancre).item(0);
}

/** Une ancre de l'adresse, décodée ; telle quelle si elle est mal formée. */
function decoder(ancre: string): string {
  try {
    return decodeURIComponent(ancre);
  } catch {
    return ancre;
  }
}

/** La page affichée, d'après la dernière navigation finie. */
interface Page {
  principale: boolean;
  /** data.section de la route : l'entrée dont dépend une page à part. */
  section?: Entree;
}

// La page que le pré-rendu signale, transmise au navigateur, qui la garde jusqu'à sa première
// navigation finie : l'hydratation retrouve l'en-tête du document pré-rendu.
export const PAGE_PRERENDUE = makeStateKey<Page>('navigation.page');

/** data.section de la route la plus profonde ; null (mentions légales) ou absente : undefined. */
function sectionDe(route: ActivatedRouteSnapshot): Entree | undefined {
  while (route.firstChild) route = route.firstChild;
  return (route.data['section'] as Entree | null | undefined) ?? undefined;
}

/**
 * La navigation du site (PF-06). L'entrée signalée de l'en-tête et la valeur de son aria-current,
 * jamais tirées d'une comparaison d'adresses : sur la page principale, la section lue, suivie par
 * le DefilementService tant que la page y inscrit ses sections ; ailleurs, data.section. Une fois
 * la page chargée, l'adresse de la page principale suit la section lue. Le chemin de la dernière
 * navigation finie, que lit le défilement du routeur (app.config.ts). Le service ne lit la fenêtre
 * et le document que dans le navigateur, depuis demarrer(), inscrire() et quitterLAncre().
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly routeur = inject(Router);
  private readonly adresses = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly destruction = inject(DestroyRef);
  private readonly defilement = inject(DefilementService);
  private readonly transfert = inject(TransferState);
  private readonly page = signal<Page>(this.transfert.get(PAGE_PRERENDUE, { principale: false }));
  private readonly lue = signal<Entree>('accueil');
  private sections: readonly HTMLElement[] = [];
  private desabonner: (() => void) | undefined;
  private charge = false;
  // Le chemin avant et après la dernière navigation finie ; historique : retour ou avance.
  private avant: string | undefined;
  private apres: string | undefined;
  private historique = false;

  /** Vrai quand la page affichée est la page principale. */
  readonly surPrincipale = computed(() => this.page().principale);
  /** L'entrée signalée : la section lue sur la page principale, data.section ailleurs. */
  readonly entree = computed(() => (this.page().principale ? this.lue() : this.page().section));

  constructor() {
    this.routeur.events.pipe(takeUntilDestroyed()).subscribe((evenement) => {
      if (evenement instanceof NavigationStart) {
        this.historique = evenement.navigationTrigger === 'popstate';
      } else if (evenement instanceof NavigationEnd) {
        [this.avant, this.apres] = [this.apres, cheminDe(evenement.urlAfterRedirects)];
        const page = {
          principale: this.apres === PRINCIPALE,
          section: sectionDe(this.routeur.routerState.snapshot.root),
        };
        this.page.set(page);
        this.transfert.set(PAGE_PRERENDUE, page);
      } else if (evenement instanceof NavigationSkipped) {
        // Une navigation ignorée parce que l'adresse est la même défile aussi, sur le même chemin.
        [this.avant, this.historique] = [this.apres, false];
      }
    });
  }

  /**
   * L'aria-current de l'entrée : « location » pour la section lue, « page » pour l'entrée dont
   * dépend une page à part ; undefined, jamais null, pour toute autre entrée.
   */
  courant(entree: Entree): CourantLien | undefined {
    if (this.entree() !== entree) return undefined;
    return this.page().principale ? 'location' : 'page';
  }

  /**
   * Démarre dans le navigateur ce qui attend la fin du chargement (PF-06). Une ancre qui ne nomme
   * rien quitte l'adresse, sur toute page (V-11). Une ancre qui nomme un élément : au rechargement
   * et au retour dans l'historique, la page s'ouvre sur lui, d'un coup, car le routeur a réglé
   * history.scrollRestoration sur « manual » et Chrome et Firefox ne l'ouvrent alors plus eux-mêmes
   * (relevé de W18) ; à la première ouverture, le navigateur y défile juste après le chargement, et
   * l'adresse attend ce défilement. Puis, sur la page principale, l'adresse suit la section lue.
   */
  demarrer(): void {
    const vue = this.document.defaultView;
    this.apresChargement(() => {
      const ancre = this.adresses.path(true).split('#').slice(1).join('#');
      const cible = ancre ? cibleDe(this.document, decoder(ancre)) : null;
      if (ancre && !cible) this.remplacerAncre('');
      // getEntriesByType manque à certains environnements de test.
      const [ouverture] = vue?.performance.getEntriesByType?.('navigation') ?? [];
      const type = (ouverture as PerformanceNavigationTiming | undefined)?.type;
      if (cible && (type === 'reload' || type === 'back_forward')) {
        cible.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
      const suivreLAdresse = () => {
        this.charge = true;
        this.suivre();
      };
      if (cible && vue?.scrollY === 0) {
        const attente = this.defilement.abonner(() => {
          attente();
          suivreLAdresse();
        });
        this.destruction.onDestroy(attente);
      } else {
        suivreLAdresse();
      }
    });
  }

  /** Vrai quand la dernière navigation, hors retour et avance, part de la principale et y reste. */
  resteSurPrincipale(): boolean {
    return !this.historique && this.avant === PRINCIPALE && this.apres === PRINCIPALE;
  }

  /**
   * Inscrit les sections de la page principale, dans l'ordre du document, après son premier rendu
   * dans le navigateur ; rend leur retrait, à appeler quand on la quitte. Tant qu'il y en a, la
   * section lue suit chaque image où la page défile ou change de taille.
   */
  inscrire(sections: readonly HTMLElement[]): () => void {
    this.sections = sections;
    this.desabonner ??= this.defilement.abonner(() => this.suivre());
    this.suivre();
    return () => {
      if (this.sections !== sections) return;
      this.sections = [];
      this.desabonner?.();
      this.desabonner = undefined;
      this.lue.set('accueil');
    };
  }

  /**
   * Ôte l'ancre de l'adresse affichée (ancre qui ne nomme rien, V-11), une fois la page chargée,
   * et seulement si aucune autre navigation n'a suivi.
   */
  quitterLAncre(): void {
    const adresse = this.routeur.url;
    this.apresChargement(() => {
      if (this.routeur.url === adresse) this.remplacerAncre('');
    });
  }

  private suivre(): void {
    const vue = this.document.defaultView;
    if (!vue || this.sections.length === 0) return;
    const hauts = this.sections.map((section) => section.getBoundingClientRect().top);
    const reste = this.document.documentElement.scrollHeight - vue.scrollY - vue.innerHeight;
    const indice = sectionLue(hauts, vue.innerHeight, reste);
    this.lue.set(indice < 0 ? 'accueil' : (this.sections[indice].id as Section));
    // Une fois la page chargée, l'adresse affichée est celle de la section lue, / pour l'accueil,
    // dès qu'elle diffère ; jamais hors de la page principale ni pendant une navigation du routeur.
    // Location rend le chemin de la racine sans sa barre, vide.
    const racine = Location.stripTrailingSlash(cheminDe(this.adresses.path())) === '';
    if (this.charge && racine && this.page().principale && !this.routeur.currentNavigation()) {
      this.remplacerAncre(this.lue() === 'accueil' ? '' : this.lue());
    }
  }

  // Règle de moment de PF-06 : une fois le document entièrement chargé, aussitôt s'il l'est,
  // sinon à l'événement load ; tant qu'il ne l'est pas, le navigateur peut encore défiler vers
  // l'ancre de l'adresse. L'écouteur part avec l'application.
  private apresChargement(action: () => void): void {
    const vue = this.document.defaultView;
    if (this.document.readyState === 'complete') {
      action();
    } else if (vue) {
      vue.addEventListener('load', action, { once: true });
      this.destruction.onDestroy(() => vue.removeEventListener('load', action));
    }
  }

  // Remplace l'ancre de l'adresse affichée, chemin et requête gardés, sans étape d'historique :
  // history.state garde l'état que le routeur a posé, dont il a besoin au retour arrière. Rien
  // quand l'adresse est déjà la bonne.
  private remplacerAncre(ancre: string): void {
    const adresse = this.adresses.path(true);
    const sansAncre = adresse.split('#', 1)[0];
    const voulue = ancre ? `${sansAncre}#${ancre}` : sansAncre;
    if (voulue === adresse) return;
    history.replaceState(history.state, '', this.adresses.prepareExternalUrl(voulue));
  }
}
