import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type VarianteFenetre = 'code';

/** Le genre d'un segment de code, qui dit sa couleur. */
export type GenreSegment = 'mot-cle' | 'chaine' | 'commentaire' | 'texte';

/** Un morceau d'une ligne de code, écrit par la page, en texte brut. */
export interface SegmentCode {
  readonly texte: string;
  /** Mot-clé en accent, chaîne en accent secondaire, commentaire en texte discret. */
  readonly genre: GenreSegment;
}

/** Une ligne de code : ses segments, dans l'ordre. */
export type LigneCode = readonly SegmentCode[];

let prochainNumero = 0;

/**
 * Fenêtre factice de la charte (CO-12) : un cadre d'application, avec sa barre (trois points
 * décoratifs, puis le titre en chasse fixe) et son contenu. Elle n'a aucun texte propre : le titre
 * et les lignes de code viennent de la page.
 *
 * Variante code : chaque ligne est une liste de segments colorés par leur genre ; l'extrait passe
 * à la ligne, même un mot sans espace, sans jamais défiler en largeur, et reste sélectionnable.
 *
 * Décorative (elle ne fait que répéter ce que la page affiche déjà) : aria-hidden sur le cadre.
 * Sinon, c'est une figure dont la barre est la légende ; l'extrait y est lu d'un seul tenant, dans
 * un texte masqué visuellement, et la copie colorée est masquée aux lecteurs d'écran (PF-05).
 * Sans contenu, rien n'est rendu : jamais de cadre vide.
 */
@Component({
  selector: 'app-fenetre',
  templateUrl: './fenetre.html',
  styleUrl: './fenetre.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fenetre' },
})
export class Fenetre {
  readonly variante = input<VarianteFenetre>('code');
  /** Le titre de la barre, « profil.ts », écrit par la page. */
  readonly titre = input<string>();
  /** Masquée aux lecteurs d'écran : elle ne fait que répéter une information déjà affichée. */
  readonly decorative = input(false, { transform: booleanAttribute });
  /** Les lignes de la variante code. */
  readonly lignes = input<readonly LigneCode[]>([]);

  protected readonly identifiant = `fenetre-${prochainNumero++}`;
  protected readonly titreAffiche = computed(() => this.titre()?.trim());
  // Chrome ne nomme pas la figure par sa légende : elle la désigne, sauf décorative.
  protected readonly nommeePar = computed(() =>
    !this.decorative() && this.titreAffiche() ? this.identifiant : null,
  );
  // Une ligne vide garde sa place dans l'extrait ; un extrait sans aucun caractère visible n'en a
  // pas.
  protected readonly affichee = computed(() =>
    this.lignes().some((ligne) => ligne.some((segment) => segment.texte.trim())),
  );
  /** L'extrait entier, tel qu'un lecteur d'écran le lit : les lignes jointes par un retour. */
  protected readonly extrait = computed(() =>
    this.lignes()
      .map((ligne) => ligne.map((segment) => segment.texte).join(''))
      .join('\n'),
  );
}
