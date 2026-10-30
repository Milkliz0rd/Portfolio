import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Icone } from '../icone/icone';

export type VarianteLien = 'texte' | 'discret' | 'action' | 'navigation' | 'externe';

/**
 * Lien de la charte (CO-02), posé sur l'élément natif a, avec href ou routerLink : la sémantique,
 * le clavier et le lien du routeur restent ceux du navigateur. Le lien d'action porte la flèche ;
 * le lien externe, posé avec href (routerLink imposerait sa propre cible), s'ouvre dans un nouvel
 * onglet et l'annonce par la flèche oblique et un texte masqué. La page courante est désignée par
 * la page elle-même (entrée courant), jamais par une comparaison d'adresses (PF-06).
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
    '[attr.aria-current]': "courant() ? 'page' : null",
  },
})
export class Lien {
  readonly variante = input<VarianteLien>('texte');
  /** Le lien mène à la page affichée : aria-current="page". */
  readonly courant = input(false, { transform: booleanAttribute });

  protected readonly externe = computed(() => this.variante() === 'externe');
}
