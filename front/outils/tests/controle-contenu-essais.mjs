// Contenus d'essai du contrôle du contenu : un contenu correct, complet et sans emplacement, que
// chaque test change pour y glisser une seule faute. Ses images sont dans essais-contenu/public/,
// de vrais WebP produits par cwebp : capture-01 en VP8L (1000 × 600), capture-02 en VP8X
// (1280 × 3), vignette en VP8 (300 × 200).
import { join } from 'node:path';
import { controlerDocuments } from '../controle-contenu/controle-contenu.mjs';
import { MODELE, MODELE_PROJET } from '../controle-contenu/modele.mjs';

export const ESSAIS = join(import.meta.dirname, 'essais-contenu');

const volet = (cle) => ({ cle, intitule: `Volet ${cle}`, description: ['Une description.'] });
const date = ([annee, mois]) => (mois ? { annee, mois } : { annee });
const etape = (type, intitule, debut, fin, etat) => ({
  type,
  intitule,
  debut: date(debut),
  fin: date(fin),
  etat,
});
const capture = (n, largeur, hauteur) => ({
  fichier: `capture-0${n}.webp`,
  alternatif: `La capture ${n}`,
  largeur,
  hauteur,
});

/** Un contenu correct, accepté en mode main : un fichier par clé, <clé>.json. */
export const contenuCorrect = () => ({
  profil: {
    nom: 'Camille Exemple',
    intitule: 'Développeuse fullstack',
    liens: { github: 'https://github.com/exemple', linkedin: 'https://linkedin.com/in/exemple' },
  },
  accueil: {
    presentation: ['Une présentation.', 'L’accueil en deux phrases.'],
    orientations: { parcours: 'P', competences: 'C', experience: 'E', methode: 'M', projets: 'P' },
  },
  parcours: {
    introduction: 'Une introduction.',
    orientation: ['Une orientation vers l’architecture logicielle.'],
    etapes: [
      etape('reconversion', 'Reconversion depuis la restauration', [2019], [2021, 6], 'accomplie'),
      { ...etape('bac+3', 'Bachelor', [2021, 9], [2024, 6], 'accomplie'), etablissement: 'École' },
      etape('master', 'Master', [2025, 9], [2028], 'mise-en-avant'),
    ],
  },
  competences: {
    techniques: [
      { libelle: 'Langages', rang: 1, competences: [{ libelle: 'Java', rang: 1 }] },
      { libelle: 'Outils', rang: 2, competences: [] },
    ],
    humaines: { competences: [{ libelle: 'Rigueur', rang: 1 }], recit: ['Un récit.'] },
  },
  experience: {
    entreprise: 'Une entreprise',
    periode: { debut: 2025, fin: 2028 },
    volets: [volet('application'), volet('backend'), volet('appui-devops')],
    mentionConfidentialite: 'Les projets menés en entreprise ne sont pas partageables.',
  },
  methode: {
    etapes: [{ intitule: 'Cadrer', texte: ['Un texte.'], illustration: 'demonstration-schema' }],
    renvoi: { projet: 'portfolio' },
  },
  'textes-legaux': {
    mentionsLegales: [
      { intitule: 'Contact', paragraphes: [[{ texte: 'Écrire', lien: '/contact' }]] },
    ],
    informationDonnees: [
      {
        intitule: 'Données',
        paragraphes: [[{ texte: 'Gardées au plus trois ans après le dernier échange.' }]],
      },
    ],
  },
  'projets/portfolio': {
    identifiant: 'portfolio',
    titre: 'Portfolio',
    description: ['La démarche.'],
    descriptionCourte: 'Le site lui-même.',
    rang: 1,
    captures: [capture(1, 1000, 600), capture(2, 1280, 3)],
    vignette: { fichier: 'vignette.webp', largeur: 300, hauteur: 200 },
    lienCode: 'https://github.com/exemple/portfolio',
  },
});

/** Le contenu en documents, tels que le contrôle les lit : { nom, fichier, forme, donnees }. */
export const documents = (contenu) =>
  Object.entries(contenu).map(([cle, donnees]) => ({
    nom: `${cle}.json`,
    fichier: `src/contenu/fr/${cle}.json`,
    forme: cle.startsWith('projets/') ? MODELE_PROJET : MODELE[`${cle}.json`],
    donnees,
  }));

/** Une faute en une ligne courte : gravité, fichier sans dossier ni .json, champ, règle. */
export const court = ({ gravite, fichier, champ, regle }) =>
  `${gravite} ${fichier.replace(/^src\/contenu\/fr\/|\.json$/g, '')} ${champ}: ${regle}`;

/** Les fautes du contenu correct, une fois changé par le test, en lignes courtes. */
export function fautes(changer, mode = 'main') {
  const contenu = contenuCorrect();
  changer?.(contenu);
  return controlerDocuments(documents(contenu), { mode, racine: ESSAIS }).map(court);
}
