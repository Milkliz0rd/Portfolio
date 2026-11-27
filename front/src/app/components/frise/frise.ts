import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
} from '@angular/core';
// La mise en forme des périodes vit avec les lecteurs du contenu (W22), pour la frise, l'accueil
// et la section Expérience. Une fonction pure, qui ne lit aucun contenu : la seule exception de la
// frise à la règle d'import des composants de la charte (PF-01).
// eslint-disable-next-line no-restricted-imports -- formaterPeriode, fonction pure, sans contenu
import {
  formaterPeriode,
  type DateFrise,
  type DateOuEmplacement,
} from '../../services/contenu/lecture/periode';

// Les dates d'une étape, entrées de la frise : la page les donne telles que le contenu les écrit.
export type { DateFrise, DateOuEmplacement };

export type EtatEtapeFrise = 'accomplie' | 'mise-en-avant' | 'prevue';

/** Une période a toujours un début et une fin, jamais au présent (MF-18). */
export interface EtapeFrise {
  readonly intitule: string;
  readonly detail?: string;
  readonly debut: DateOuEmplacement;
  readonly fin: DateOuEmplacement;
  /** Écrit par la page, jamais déduit de la date du jour (MF-18). */
  readonly etat: EtatEtapeFrise;
}

/**
 * Frise chronologique de la charte (CO-09) : les étapes que lui donne la page, dans l'ordre reçu,
 * en liste ordonnée ; chacune a un point décoratif, sa période en chasse fixe, son intitulé et un
 * détail facultatif. Verticale sous 900 px, horizontale au-delà. L'étape mise en avant, une au
 * plus, l'annonce par un texte masqué ; le trait lumineux va du premier point au sien. Statique :
 * le tracé au défilement viendra avec le mouvement (MV-02).
 */
@Component({
  selector: 'app-frise',
  templateUrl: './frise.html',
  styleUrl: './frise.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'frise' },
})
export class Frise {
  readonly etapes = input.required<readonly EtapeFrise[]>();
  /** Le nom de la liste, écrit et marqué pour la traduction par la page. */
  readonly libelle = input<string>();

  protected readonly etapesAffichees = computed(() =>
    this.etapes().map((etape) => ({
      ...etape,
      periode: formaterPeriode(etape.debut, etape.fin, this.langue),
    })),
  );
  /** Le rang de l'étape mise en avant, à partir de 1 ; 0 sans elle. */
  protected readonly rangMiseEnAvant = computed(() => {
    const etats = this.etapes().map((etape) => etape.etat);
    if (etats.indexOf('mise-en-avant') !== etats.lastIndexOf('mise-en-avant')) {
      throw new Error('Une frise met en avant une étape au plus (CO-09).');
    }
    return etats.indexOf('mise-en-avant') + 1;
  });

  private readonly langue = inject(LOCALE_ID);
}
