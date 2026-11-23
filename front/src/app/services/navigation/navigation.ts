import {
  computed,
  DOCUMENT,
  inject,
  Injectable,
  makeStateKey,
  signal,
  TransferState,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
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
 * le DefilementService tant que la page y inscrit ses sections ; ailleurs, data.section. Le
 * service ne lit la fenêtre et le document que dans le navigateur, depuis inscrire().
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly routeur = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly defilement = inject(DefilementService);
  private readonly transfert = inject(TransferState);
  private readonly page = signal<Page>(this.transfert.get(PAGE_PRERENDUE, { principale: false }));
  private readonly lue = signal<Entree>('accueil');
  private sections: readonly HTMLElement[] = [];
  private desabonner: (() => void) | undefined;

  /** Vrai quand la page affichée est la page principale. */
  readonly surPrincipale = computed(() => this.page().principale);
  /** L'entrée signalée : la section lue sur la page principale, data.section ailleurs. */
  readonly entree = computed(() => (this.page().principale ? this.lue() : this.page().section));

  constructor() {
    this.routeur.events.pipe(takeUntilDestroyed()).subscribe((evenement) => {
      if (evenement instanceof NavigationEnd) {
        const page = {
          principale: cheminDe(evenement.urlAfterRedirects) === PRINCIPALE,
          section: sectionDe(this.routeur.routerState.snapshot.root),
        };
        this.page.set(page);
        this.transfert.set(PAGE_PRERENDUE, page);
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

  private suivre(): void {
    const vue = this.document.defaultView;
    if (!vue || this.sections.length === 0) return;
    const hauts = this.sections.map((section) => section.getBoundingClientRect().top);
    const reste = this.document.documentElement.scrollHeight - vue.scrollY - vue.innerHeight;
    const indice = sectionLue(hauts, vue.innerHeight, reste);
    this.lue.set(indice < 0 ? 'accueil' : (this.sections[indice].id as Section));
  }
}
