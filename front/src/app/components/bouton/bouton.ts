import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostAttributeToken,
  inject,
  input,
} from '@angular/core';

export type VarianteBouton = 'primaire' | 'secondaire' | 'discret' | 'icone';

/**
 * Bouton de la charte (CO-01), posé sur l'élément natif : button pour une action, a pour une
 * destination de premier plan qui prend l'aspect d'un bouton. La sémantique, le clavier et le lien
 * du routeur restent ceux du navigateur ; les états survol, focus, appuyé et désactivé sont en CSS.
 */
@Component({
  selector: 'button[appBouton], a[appBouton]',
  templateUrl: './bouton.html',
  styleUrl: './bouton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bouton',
    '[class.bouton--primaire]': "variante() === 'primaire'",
    '[class.bouton--secondaire]': "variante() === 'secondaire'",
    '[class.bouton--discret]': "variante() === 'discret'",
    '[class.bouton--icone]': "variante() === 'icone'",
    '[class.bouton--compact]': 'compact()',
    '[attr.type]': 'type()',
  },
})
export class Bouton {
  readonly variante = input<VarianteBouton>('primaire');
  /** Marges latérales réduites, même hauteur : pour l'en-tête. */
  readonly compact = input(false, { transform: booleanAttribute });
  /** Texte masqué ajouté au contenu, lu par les lecteurs d'écran ; obligatoire pour l'icône seule. */
  readonly libelle = input<string>();

  protected readonly libelleMasque = computed(() => {
    const libelle = this.libelle()?.trim();
    if (this.variante() === 'icone' && !libelle) {
      throw new Error('Un bouton à icône seule exige son libellé masqué : entrée « libelle ».');
    }
    return libelle;
  });
  // Un button sans type enverrait le formulaire qui le contient : il reçoit type="button", sauf si
  // l'élément écrit le sien (type="submit" pour un bouton d'envoi).
  protected readonly type = computed(() =>
    this.element.localName === 'button' ? (this.typeEcrit ?? 'button') : null,
  );

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly typeEcrit = inject(new HostAttributeToken('type'), { optional: true });
}
