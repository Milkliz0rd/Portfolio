import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Etiquette } from '../etiquette/etiquette';

export type VarianteListeCleValeur = 'en-ligne' | 'tableau';

/** Une paire de la liste, écrite comme le modèle de contenu : champs en lecture seule, texte brut. */
export interface PaireCleValeur {
  /** La clé, affichée comme une étiquette discrète (CO-04). */
  readonly cle: string;
  /**
   * La valeur, déjà écrite par la page : une période passe d'abord par sa mise en forme. Absente,
   * nulle ou vide une fois les espaces retirés, elle fait disparaître toute la paire.
   */
  readonly valeur?: string | null;
  /** Une valeur de date ou de période, écrite en police-mono comme les dates de la frise. */
  readonly date?: boolean;
}

/**
 * Liste clé-valeur de la charte (CO-17) : des faits courts, chacun annoncé par une étiquette, dans
 * une vraie liste de définitions, une paire par div (dt, puis dd). Une paire sans valeur disparaît
 * entière, jamais de clé sans valeur ; sans aucune paire, aucune liste n'est rendue. En ligne :
 * valeurs en police-titre, côte à côte, empilées sur téléphone. En tableau : clé à gauche, valeur
 * à droite en texte courant, chaque paire sous un filet. Statique.
 */
@Component({
  selector: 'app-liste-cle-valeur',
  imports: [Etiquette],
  templateUrl: './liste-cle-valeur.html',
  styleUrl: './liste-cle-valeur.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'liste-cle-valeur',
    '[class.liste-cle-valeur--en-ligne]': "variante() === 'en-ligne'",
    '[class.liste-cle-valeur--tableau]': "variante() === 'tableau'",
  },
})
export class ListeCleValeur {
  readonly variante = input<VarianteListeCleValeur>('en-ligne');
  readonly paires = input.required<readonly PaireCleValeur[]>();

  protected readonly pairesAffichees = computed(() =>
    this.paires().filter((paire) => !!paire.valeur?.trim()),
  );
}
