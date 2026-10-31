import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Icone } from '../icone/icone';

export type TypeChamp = 'texte' | 'email' | 'zone';

// Les deux messages que la charte donne au champ ; toute autre erreur apporte le sien.
const MESSAGES: Record<string, () => string> = {
  required: () => $localize`:@@champ.erreur-obligatoire:Ce champ est obligatoire.`,
  email: () => $localize`:@@champ.erreur-email:L’adresse e-mail n’est pas valide.`,
};

let prochainNumero = 0;

/**
 * Champ de formulaire de la charte (CO-10), lié à un champ de Signal Forms par la directive
 * FormField : valeur, required, disabled et touché viennent de son état. Le libellé, visible
 * au-dessus, est lié au contrôle ; l'aide et l'erreur, sous le champ, lui sont liées par
 * aria-describedby.
 *
 * L'erreur s'affiche quand le champ est touché et invalide : submit() (ou [formRoot]) touche tous
 * les champs, si bien que chaque champ en faute montre son message à l'envoi ; Signal Forms touche
 * aussi un champ que le visiteur quitte. Un champ désactivé n'est jamais touché ni validé.
 */
@Component({
  selector: 'app-champ',
  imports: [FormField, Icone],
  templateUrl: './champ.html',
  styleUrl: './champ.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'champ' },
})
export class Champ {
  readonly champ = input.required<FieldTree<string>>();
  /** Le libellé visible, écrit et marqué pour la traduction par la page. */
  readonly libelle = input.required<string>();
  readonly type = input<TypeChamp>('texte');
  /** Une aide facultative, sous le champ. */
  readonly aide = input<string>();
  /** La valeur d'autocomplete ; « email » par défaut pour le type email. */
  readonly autocomplete = input<string>();

  protected readonly identifiant = `champ-${prochainNumero++}`;
  protected readonly indicatifEmail = $localize`:@@champ.indicatif-email:Votre adresse e-mail`;

  protected readonly libelleAffiche = computed(() => {
    const libelle = this.libelle().trim();
    if (!libelle) {
      throw new Error('Un champ porte toujours un libellé visible : entrée « libelle » (CO-10).');
    }
    return libelle;
  });
  protected readonly erreur = computed(() => {
    const etat = this.champ()();
    const [erreur] = etat.touched() && etat.invalid() ? etat.errors() : [];
    if (!erreur) {
      return undefined;
    }
    const message = erreur.message?.trim() || MESSAGES[erreur.kind]?.();
    if (!message) {
      throw new Error(`L'erreur « ${erreur.kind} » n'a pas de message : lui en donner un (CO-10).`);
    }
    return message;
  });
  protected readonly descriptions = computed(
    () =>
      [this.aide() && `${this.identifiant}-aide`, this.erreur() && `${this.identifiant}-erreur`]
        .filter(Boolean)
        .join(' ') || null,
  );
  protected readonly autocompleteEffectif = computed(
    () => this.autocomplete() ?? (this.type() === 'email' ? 'email' : null),
  );
}
