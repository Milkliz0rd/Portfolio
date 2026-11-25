import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Etiquette } from '../etiquette/etiquette';
import { Lien } from '../lien/lien';

export type VarianteListeCleValeur = 'en-ligne' | 'tableau';

/**
 * Un morceau de valeur : un texte seul, ou un texte et son lien. Le lien prend les noms de la carte
 * (CO-05) : lien, une adresse du site posée par routerLink, et fragment, son ancre ; avec externe,
 * lien est une adresse hors du site, posée par href, qui s'ouvre dans un nouvel onglet (CO-02).
 */
export interface SegmentValeur {
  readonly texte: string;
  readonly lien?: string;
  readonly fragment?: string;
  readonly externe?: boolean;
}

/** Une valeur en paragraphes, chacun une suite de segments : la forme des textes du contenu. */
export type ParagraphesValeur = readonly (readonly SegmentValeur[])[];

/** Une paire de la liste, écrite comme le modèle de contenu : champs en lecture seule, texte brut. */
export interface PaireCleValeur {
  /** La clé, affichée comme une étiquette discrète (CO-04). */
  readonly cle: string;
  /**
   * La valeur, déjà écrite par la page : un texte, une période passant d'abord par sa mise en forme,
   * ou des paragraphes de segments, dont certains portent un lien. Absente, nulle ou vide une fois
   * les espaces retirés, elle fait disparaître toute la paire.
   */
  readonly valeur?: string | ParagraphesValeur | null;
  /** Une valeur de date ou de période, écrite en police-mono comme les dates de la frise. */
  readonly date?: boolean;
}

/** Une paire affichée : sa valeur est un texte, ou des paragraphes qui ont chacun du texte. */
interface PaireAffichee {
  readonly cle: string;
  readonly date?: boolean;
  readonly texte?: string;
  readonly paragraphes?: ParagraphesValeur;
}

const plein = (paragraphe: readonly SegmentValeur[]) =>
  paragraphe.some((segment) => !!segment.texte.trim());

/**
 * Liste clé-valeur de la charte (CO-17) : des faits courts, chacun annoncé par une étiquette, dans
 * une vraie liste de définitions, une paire par div (dt, puis dd). Une paire sans valeur disparaît
 * entière, jamais de clé sans valeur ; sans aucune paire, aucune liste n'est rendue. En ligne :
 * valeurs en police-titre, côte à côte, empilées sur téléphone. En tableau : clé à gauche, valeur
 * à droite en texte courant, chaque paire sous un filet. Une valeur en paragraphes peut porter des
 * liens (CO-02, variante texte) : un lien du routeur, avec son ancre, pour une adresse du site,
 * jamais une navigation native vers un fragment (PF-06) ; un lien externe sinon. Statique.
 */
@Component({
  selector: 'app-liste-cle-valeur',
  imports: [Etiquette, Lien, RouterLink],
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
    this.paires().flatMap(({ cle, valeur, date }): PaireAffichee[] => {
      if (typeof valeur === 'string') return valeur.trim() ? [{ cle, date, texte: valeur }] : [];
      const paragraphes = (valeur ?? []).filter(plein);
      return paragraphes.length ? [{ cle, date, paragraphes }] : [];
    }),
  );
}
