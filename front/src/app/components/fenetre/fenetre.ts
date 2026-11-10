import { NgOptimizedImage } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type VarianteFenetre = 'code' | 'navigateur' | 'capture';

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
 * décoratifs, puis le titre en chasse fixe, ou l'adresse factice du navigateur) et son contenu.
 * Elle n'a aucun texte propre : titre, adresse, lignes de code, image et texte alternatif viennent
 * de la page.
 *
 * Variante code : chaque ligne est une liste de segments colorés par leur genre ; l'extrait passe
 * à la ligne, même un mot sans espace, sans jamais défiler en largeur, et reste sélectionnable.
 * Variante navigateur : l'adresse factice sur sa pilule, et le contenu projeté par la page.
 * Variante capture : une image au format 16:10, par NgOptimizedImage, aux dimensions déclarées.
 *
 * Décorative (elle ne fait que répéter ce que la page affiche déjà) : aria-hidden sur le cadre,
 * et une capture y a un texte alternatif vide. Sinon, c'est une figure nommée par la légende de sa
 * barre, titre ou adresse ; l'extrait y est lu d'un seul tenant, dans un texte masqué visuellement,
 * et la copie colorée est masquée aux lecteurs d'écran (PF-05).
 *
 * Sans contenu, rien n'est affiché : jamais de cadre vide. Une capture non décorative sans texte
 * alternatif, ou sans dimensions, lève une erreur au rendu : au pré-rendu, le build échoue.
 */
@Component({
  selector: 'app-fenetre',
  imports: [NgOptimizedImage],
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
  /** L'adresse factice de la variante navigateur, à la place du titre. */
  readonly adresse = input<string>();
  /** L'image de la variante capture, ses dimensions et son texte alternatif. */
  readonly source = input<string>();
  readonly largeur = input<number>();
  readonly hauteur = input<number>();
  readonly texteAlternatif = input<string>();

  protected readonly identifiant = `fenetre-${prochainNumero++}`;
  protected readonly titreAffiche = computed(() => this.titre()?.trim());
  protected readonly adresseAffichee = computed(() =>
    this.variante() === 'navigateur' ? this.adresse()?.trim() : undefined,
  );
  // Chrome ne nomme pas la figure par sa légende : elle la désigne, sauf décorative.
  protected readonly nommeePar = computed(() =>
    !this.decorative() && (this.adresseAffichee() || this.titreAffiche()) ? this.identifiant : null,
  );
  /** L'extrait entier, tel qu'un lecteur d'écran le lit : les lignes jointes par un retour. */
  protected readonly extrait = computed(() =>
    this.lignes()
      .map((ligne) => ligne.map((segment) => segment.texte).join(''))
      .join('\n'),
  );
  // Lue au rendu : une capture fautive y lève son erreur.
  protected readonly image = computed(() => {
    const source = this.source()?.trim();
    if (this.variante() !== 'capture' || !source) {
      return null;
    }
    const [largeur, hauteur] = [this.largeur(), this.hauteur()];
    if (!largeur || !hauteur) {
      throw new Error('Une capture déclare ses dimensions : entrées « largeur » et « hauteur ».');
    }
    const alternatif = this.decorative() ? '' : (this.texteAlternatif()?.trim() ?? '');
    if (!this.decorative() && !alternatif) {
      throw new Error(
        'Une capture non décorative dit ce qu’elle montre : entrée « texteAlternatif » (CO-12).',
      );
    }
    return { source, largeur, hauteur, alternatif };
  });
  // Une ligne vide garde sa place dans l'extrait ; un extrait sans aucun caractère visible n'en a
  // pas. Le navigateur sans contenu projeté est masqué par la feuille de style.
  protected readonly affichee = computed(() => {
    switch (this.variante()) {
      case 'code':
        return this.lignes().some((ligne) => ligne.some((segment) => segment.texte.trim()));
      case 'capture':
        return this.image() !== null;
      case 'navigateur':
        return true;
    }
  });
}
