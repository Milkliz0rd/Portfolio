// Règles des textes du contenu (PF-02), une par fonction exportée : rien qui se périme (MF-18) et
// l'apostrophe typographique. Elles lisent chaque texte de chaque fichier de contenu,
// textes-legaux.json compris ; ni une adresse (lien, nom de fichier) ni un champ étiqueté n'y est
// soumis. Insensibles à la casse ; une tournure se trouve avec l'une ou l'autre apostrophe.
import { faute } from './structure.mjs';

const fin = '(?![\\p{L}\\p{N}])';
const NOMBRES =
  'deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|' +
  'vingt|trente|quarante|cinquante|soixante|cent|mille';
const MOIS = 'janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre';
const UNITES = 'ans?|années?|mois|semaines?|jours?|décennies?';
const ARTICLES = "l['’]\\s*|(?:un|une|des|quelques|plusieurs|le|la|les|ce|cet|cette|ces)\\s+";
const PRECISIONS = "(?:plus|moins|près)\\s+d['’e]\\s*|presque|environ|bientôt|déjà|maintenant";

// Ce qui, après « depuis », fait une date, un nombre ou une durée, et rien d'autre : un chiffre
// (« depuis 2023 », « depuis 3 ans », « depuis le 3 mars ») ; un nombre en lettres ; un mois ;
// « peu » ou « longtemps » ; une unité de temps après un article (« un an », « l’an dernier »).
// Une précision peut les devancer (« depuis plus de dix ans »). Tout le reste passe.
const unite = `(?:\\s+(?:${UNITES})${fin})?`;
const SUITES = [
  `(?:le\\s+)?\\d+${unite}`,
  `(?:${NOMBRES})(?:-\\p{L}+)*${fin}${unite}`,
  `(?:peu|longtemps)${fin}`,
  `(?:(?:le|en)\\s+)?(?:${MOIS})${fin}`,
  `(?:${ARTICLES})(?:${UNITES})${fin}`,
];

/** La liste signée : le nom de chaque tournure, et son motif, un mot entier. */
const TOURNURES = [
  ['âge', `âg(?:e|es|é|ée|és|ées)${fin}`],
  ['actuellement', `actuellement${fin}`],
  ['depuis', `depuis\\s+(?:(?:${PRECISIONS})\\s*)?(?:${SUITES.join('|')})`],
  ['il y a', `il\\s+y\\s+a${fin}`],
  ['en ce moment', `en\\s+ce\\s+moment${fin}`],
  ['aujourd’hui', `aujourd['’]hui${fin}`],
  ['cette année', `cette\\s+année${fin}`],
].map(([nom, motif]) => [nom, new RegExp(`(?<![\\p{L}\\p{N}])${motif}`, 'iu')]);

const textes = (feuilles) => feuilles.filter(({ genre }) => genre === 'texte');

/** Aucune tournure qui se périme, de la liste signée (section 5 de la conception technique). */
export function tournures({ feuilles }) {
  return textes(feuilles).flatMap(({ fichier, champ, valeur }) =>
    TOURNURES.filter(([, motif]) => motif.test(valeur)).map(([nom, motif]) => {
      return faute(
        fichier,
        champ,
        'tournure qui se périme',
        `« ${valeur.match(motif)[0]} », ${nom}`,
      );
    }),
  );
}

/** Une adresse dans un texte : avec son protocole, un courriel, ou un chemin (/…, ./…, ../…). */
const ADRESSE = /[a-z][a-z\d+.-]*:\/\/\S*|[^\s@]+@[^\s@]+\.[^\s@]+|(?<!\S)\.{0,2}\/\S*/giu;

/** Aucune apostrophe droite dans un texte, hors des adresses : ’ partout ailleurs. */
export function apostrophes({ feuilles }) {
  return textes(feuilles)
    .map((feuille) => ({ ...feuille, reste: feuille.valeur.replace(ADRESSE, ' ') }))
    .filter(({ reste }) => reste.includes("'"))
    .map(({ fichier, champ, reste }) => {
      return faute(
        fichier,
        champ,
        'apostrophe droite',
        `« ${reste.match(/\S*'\S*/)[0]} », ’ attendue`,
      );
    });
}
