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
