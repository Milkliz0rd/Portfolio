import { DOCUMENT, DestroyRef, Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { lireDureeMs, modeArrivee } from './calculs';
import { CLASSES, CLE_PAUSE, JETONS_DUREE, type JetonDuree, type ModeArrivee } from './reglages';

/**
 * Le socle du mouvement (PF-04), démarré par le composant racine dans afterNextRender : rien ici
 * ne s'exécute pendant le pré-rendu. Sans mv-actif sur html (animations réduites, ou repli des
 * 3 s du script de tête déjà joué), il reste inactif : le contenu reste tel que le pré-rendu l'a
 * posé. Sinon il lit les jetons de durée, fixe le mode d'arrivée, puis pose mv-pret.
 */
@Injectable({ providedIn: 'root' })
export class MouvementService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly etatActif = signal(false);
  private readonly etatMode = signal<ModeArrivee>('anime');
  private readonly etatPause = signal(false);
  private readonly durees: Record<JetonDuree, number> = { ...JETONS_DUREE };
  private demarre = false;
  private dernierImmediat = 0;

  /** Vrai une fois démarré sous mv-actif : un motif peut alors cacher, puis révéler. */
  readonly actif = this.etatActif.asReadonly();
  /** immediat au retour ou à l'avance dans l'historique : chaque motif pose son état final. */
  readonly modeArrivee = this.etatMode.asReadonly();
  /** Vrai quand le visiteur a mis en pause ce qui tourne en boucle (MV-04). */
  readonly enPause = this.etatPause.asReadonly();

  /** Un jeton de durée en ms, lu au démarrage ; sa valeur de la charte avant, ou s'il est illisible. */
  duree(nom: JetonDuree): number {
    return this.durees[nom];
  }

  /** Démarre le mouvement, une seule fois, dans le navigateur. */
  demarrer(): void {
    const html = this.document.documentElement;
    const vue = this.document.defaultView;
    if (this.demarre || !vue || !html.classList.contains(CLASSES.actif)) return;
    this.demarre = true;
    const style = vue.getComputedStyle(html);
    for (const nom of Object.keys(JETONS_DUREE) as JetonDuree[]) {
      this.durees[nom] = lireDureeMs(style.getPropertyValue(`--${nom}`), JETONS_DUREE[nom]);
    }
    this.etatPause.set(lirePause(vue));
    html.classList.toggle(CLASSES.pause, this.etatPause());
    // Absent de certains environnements de test : la page arrive alors animée.
    const [navigation] = vue.performance.getEntriesByType?.('navigation') ?? [];
    this.arriver(modeArrivee((navigation as PerformanceNavigationTiming | undefined)?.type), vue);
    this.suivreLHistorique(vue);
    this.etatActif.set(true);
    html.classList.add(CLASSES.pret);
  }

  /** Met en pause ou relance ce qui tourne en boucle, et mémorise le choix (bouton de TK-50). */
  basculerPause(): void {
    const pause = !this.etatPause();
    this.etatPause.set(pause);
    this.document.documentElement.classList.toggle(CLASSES.pause, pause);
    try {
      this.document.defaultView?.localStorage.setItem(CLE_PAUSE, pause ? '1' : '0');
    } catch {
      // Stockage indisponible : le choix vaut jusqu'au prochain chargement.
    }
  }

  // Retour ou avance par le routeur (popstate), page rendue par le cache du navigateur (pageshow) :
  // aucune entrée ne se rejoue. La première navigation, celle du démarrage, garde le mode lu.
  private suivreLHistorique(vue: Window): void {
    const abonnement = this.router.events.subscribe((evenement) => {
      if (evenement instanceof NavigationStart && this.router.navigated) {
        this.etatMode.set(modeArrivee(evenement.navigationTrigger));
      } else if (evenement instanceof NavigationEnd && this.etatMode() === 'immediat') {
        this.arriver('immediat', vue);
      }
    });
    const auRetour = ({ persisted }: PageTransitionEvent) => {
      if (persisted) this.arriver('immediat', vue);
    };
    vue.addEventListener('pageshow', auRetour);
    this.destroyRef.onDestroy(() => {
      abonnement.unsubscribe();
      vue.removeEventListener('pageshow', auRetour);
    });
  }

  // En mode immédiat, mv-immediat coupe les transitions le temps de deux images, pendant que
  // chaque motif pose son état final.
  private arriver(mode: ModeArrivee, vue: Window): void {
    this.etatMode.set(mode);
    if (mode !== 'immediat') return;
    const html = this.document.documentElement;
    const appel = ++this.dernierImmediat;
    html.classList.add(CLASSES.immediat);
    vue.requestAnimationFrame(() =>
      vue.requestAnimationFrame(() => {
        if (appel === this.dernierImmediat) html.classList.remove(CLASSES.immediat);
      }),
    );
  }
}

/** Le choix de pause mémorisé ; faux si le stockage local est indisponible. */
function lirePause(vue: Window): boolean {
  try {
    return vue.localStorage.getItem(CLE_PAUSE) === '1';
  } catch {
    return false;
  }
}
