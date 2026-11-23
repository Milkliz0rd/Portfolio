import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
} from '@angular/core';

/** Une date au mois ou à l'année ; une partie, ou toute la date, peut être un emplacement. */
export interface DateFrise {
  readonly annee: number | string;
  readonly mois?: number | string;
}
export type DateOuEmplacement = DateFrise | string;

/**
 * Une date au format de la langue, par Intl : mois sur deux chiffres et année, ou année seule. Le
 * jour formaté est le 1er du mois, en temps universel, jamais la date du jour ; l'emplacement
 * d'une partie (« [C-01 — année] ») prend sa place, dans l'ordre que donne la langue.
 */
function formaterDate(date: DateOuEmplacement, langue: string): string {
  if (typeof date === 'string') {
    return date;
  }
  const { annee, mois } = date;
  if (typeof mois === 'number' && !(Number.isInteger(mois) && mois >= 1 && mois <= 12)) {
    throw new RangeError(`Mois d'une étape de frise hors de 1 à 12 : ${mois}.`);
  }
  const format = new Intl.DateTimeFormat(langue, {
    timeZone: 'UTC',
    year: 'numeric',
    ...(mois === undefined ? {} : { month: '2-digit' as const }),
  });
  // Une partie en emplacement est formatée sur une valeur quelconque, puis remplacée.
  const jour = new Date(Date.UTC(Number(annee) || 2000, (Number(mois) || 1) - 1));
  const parties: Partial<Record<string, number | string>> = { year: annee, month: mois };
  return format
    .formatToParts(jour)
    .map(({ type, value }) => (typeof parties[type] === 'string' ? parties[type] : value))
    .join('');
}

const anneeSeule = (date: DateOuEmplacement) =>
  typeof date !== 'string' && typeof date.annee === 'number' && date.mois === undefined;

/**
 * La période d'une étape (PF-03) : « 09/2025 – 06/2028 » en français, « 2025–2028 » entre deux
 * années seules. Le tiret suit une espace insécable U+00A0, que portent les polices (U+202F et
 * l'espace fine des plages d'Intl leur manquent) : il ne commence jamais une ligne.
 */
export function formaterPeriode(debut: DateOuEmplacement, fin: DateOuEmplacement, langue: string) {
  const separateur = anneeSeule(debut) && anneeSeule(fin) ? '–' : '\u00a0– ';
  return formaterDate(debut, langue) + separateur + formaterDate(fin, langue);
}

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
