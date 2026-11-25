import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  makeStateKey,
  PLATFORM_ID,
  type Signal,
  TransferState,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Ambiance } from '../../components/ambiance/ambiance';
import { Bouton } from '../../components/bouton/bouton';
import { Icone } from '../../components/icone/icone';

/** Les deux variantes de la page introuvable (PF-06). */
export type VarianteErreur = 'adresse-inconnue' | 'projet-inexistant';

/**
 * La variante d'une adresse, par la règle même de l'hébergeur, qui sert le 404.html le plus proche
 * (PF-06, PF-08) : sous /projets/, projets/404.html, « projet-inexistant » ; partout ailleurs, et à
 * /projets seule, relevée sur le serveur local, 404.html, « adresse-inconnue ».
 */
export function varianteDeLAdresse(segments: readonly string[]): VarianteErreur {
  return segments.length > 1 && segments[0] === 'projets'
    ? 'projet-inexistant'
    : 'adresse-inconnue';
}

/**
 * La variante du document pré-rendu, transmise au navigateur, qui la reprend une fois, au démarrage
 * sur ce document : la page reste celle que l'hébergeur a servie, même quand le routeur lit
 * l'adresse autrement (/projets/, barre finale comprise, reçoit projets/404.html, et le routeur la
 * lit /projets).
 */
export const VARIANTE_SERVIE = makeStateKey<VarianteErreur>('erreur.variante');

/**
 * La page introuvable (EC-11, MF-05), un seul composant pour les deux variantes, sur l'ambiance de
 * l'accueil : le « 404 » d'affiche, décoratif ; le titre de niveau 1, « Cette page n’existe pas » ;
 * la phrase de la maquette ; « Revenir à l’accueil », en haut de la page principale ; pour un projet
 * inexistant, en plus, « Voir la liste des projets », vers /#projets. La variante vient du document
 * servi au démarrage, sinon des données de la route, sinon de l'adresse. La page porte la consigne
 * de non-indexation tant qu'elle est affichée. Aucune entrée signalée : ses routes n'ont pas de
 * data.section. Le statut 404 vient de l'hébergeur, jamais d'ici.
 */
@Component({
  selector: 'app-erreur',
  imports: [Ambiance, Bouton, Icone, RouterLink],
  templateUrl: './erreur.html',
  styleUrl: './erreur.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Erreur {
  protected readonly variante: Signal<VarianteErreur>;

  constructor() {
    // Le routeur garde la page d'une adresse inconnue à l'autre : la variante suit l'adresse ; celle
    // du document servi ne vaut que pour l'adresse du démarrage.
    const route = inject(ActivatedRoute);
    const adresse = toSignal(route.url, { requireSync: true });
    const donnees = toSignal(route.data, { requireSync: true });
    const transfert = inject(TransferState);
    const [depart, servie] = [adresse(), transfert.get(VARIANTE_SERVIE, null)];
    transfert.remove(VARIANTE_SERVIE);
    this.variante = computed(
      () =>
        (adresse() === depart ? servie : null) ??
        (donnees()['variante'] as VarianteErreur | undefined) ??
        varianteDeLAdresse(adresse().map(({ path }) => path)),
    );
    if (isPlatformServer(inject(PLATFORM_ID))) transfert.set(VARIANTE_SERVIE, this.variante());

    // meta robots « noindex », reprise du document pré-rendu à l'hydratation, retirée en quittant.
    const meta = inject(Meta);
    const consigne = meta.addTag({ name: 'robots', content: 'noindex' });
    inject(DestroyRef).onDestroy(() => {
      if (consigne) meta.removeTagElement(consigne);
    });
  }
}
