import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Icone } from '../icone/icone';

export type VarianteLien = 'texte' | 'discret' | 'action' | 'navigation';
/** La valeur d'aria-current de l'entrée courante : la page affichée, ou la section lue (PF-06). */
export type CourantLien = 'page' | 'location';

/**
 * Lien de la charte (CO-02), posé sur l'élément natif a, avec href ou routerLink : la sémantique,
 * le clavier et le lien du routeur restent ceux du navigateur. Le lien d'action porte la flèche.
 * « Externe » n'est pas une variante mais une entrée oui/non, qui s'ajoute à n'importe laquelle
 * (décision 1 de W19) : un lien discret et externe, par exemple, dans le pied de page. Posé avec
 * href (routerLink imposerait sa propre cible), le lien externe s'ouvre dans un nouvel onglet et
 * l'annonce par la flèche oblique et un texte masqué ; il garde la couleur et le survol de sa
 * variante. CO-02 donne une seule icône par lien : un lien d'action externe ne porte que la flèche
 * oblique, qui annonce le nouvel onglet. L'entrée courante est désignée par ce qui pose le lien
 * (entrée courant), jamais par une comparaison d'adresses (PF-06) : « page » pour la page affichée,
 * « location » pour la section lue de la page principale ; sans elle, le lien ne porte pas
 * d'aria-current.
 */
@Component({
  selector: 'a[appLien]',
  imports: [Icone],
  templateUrl: './lien.html',
  styleUrl: './lien.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lien',
    '[class.lien--texte]': "variante() === 'texte'",
    '[class.lien--discret]': "variante() === 'discret'",
    '[class.lien--action]': "variante() === 'action'",
    '[class.lien--navigation]': "variante() === 'navigation'",
    '[class.lien--externe]': 'externe()',
    // Nouvel onglet, sans accès de la page ouverte à celle-ci ni adresse d'origine transmise.
    '[attr.target]': "externe() ? '_blank' : null",
    '[attr.rel]': "externe() ? 'noopener noreferrer' : null",
    '[attr.aria-current]': 'courant() ?? null',
  },
})
export class Lien {
  readonly variante = input<VarianteLien>('texte');
  /** Hors du site, quelle que soit la variante : nouvel onglet, flèche oblique et texte masqué. */
  readonly externe = input(false, { transform: booleanAttribute });
  /** L'entrée courante : aria-current="page" (la page affichée) ou "location" (la section lue). */
  readonly courant = input<CourantLien>();
}
