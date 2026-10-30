import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostAttributeToken,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { IndicateurActivite } from '../indicateur-activite/indicateur-activite';

export type VarianteBouton = 'primaire' | 'secondaire' | 'discret' | 'icone';

/**
 * Bouton de la charte (CO-01), posé sur l'élément natif : button pour une action, a pour une
 * destination de premier plan qui prend l'aspect d'un bouton. La sémantique, le clavier et le lien
 * du routeur restent ceux du navigateur ; les états survol, focus, appuyé et désactivé sont en CSS.
 *
 * En cours (enCours), le bouton garde son aspect et son focus, sans l'attribut disabled : il montre
 * l'indicateur d'activité et « Envoi en cours… », se déclare aria-disabled et annule tout clic, si
 * bien qu'un nouvel envoi (clic, Entrée, Espace, envoi implicite du formulaire) reste sans effet.
 */
@Component({
  selector: 'button[appBouton], a[appBouton]',
  imports: [IndicateurActivite],
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
    '[class.bouton--en-cours]': 'enCours()',
    '[attr.type]': 'type()',
    '[attr.aria-disabled]': "enCours() ? 'true' : null",
  },
})
export class Bouton {
  readonly variante = input<VarianteBouton>('primaire');
  /** Marges latérales réduites, même hauteur : pour l'en-tête. */
  readonly compact = input(false, { transform: booleanAttribute });
  /** Texte masqué ajouté au contenu, lu par les lecteurs d'écran ; obligatoire pour l'icône seule. */
  readonly libelle = input<string>();
  /** Un envoi est en cours : indicateur, « Envoi en cours… » et nouvel envoi bloqué. */
  readonly enCours = input(false, { transform: booleanAttribute });

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
  // En phase de capture, l'écoute passe avant celles que la page pose sur le bouton.
  private readonly arreterEcoute = inject(Renderer2).listen(
    this.element,
    'click',
    (evenement: Event) => this.bloquerPendantEnvoi(evenement),
    { capture: true },
  );

  constructor() {
    inject(DestroyRef).onDestroy(this.arreterEcoute);
  }

  // Le clic annulé n'envoie pas le formulaire, et les autres écoutes du bouton ne le voient pas.
  private bloquerPendantEnvoi(evenement: Event): void {
    if (this.enCours()) {
      evenement.preventDefault();
      evenement.stopImmediatePropagation();
    }
  }
}
