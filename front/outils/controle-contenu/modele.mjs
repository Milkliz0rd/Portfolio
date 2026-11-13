// Les champs de chaque fichier de contenu, recopiés de src/app/interfaces/contenu.ts (PF-02) : ils
// servent aux champs obligatoires et refusent un champ en trop. Le test controle-contenu-modele
// confronte cette liste aux types de contenu.ts, pour qu'elle ne s'en écarte pas.
//
// Une forme est : une feuille ('texte', 'nombre', 'https' pour une adresse HTTPS, 'lien' pour une
// adresse interne ou HTTPS, 'image' pour un nom de fichier d'image) ; un Set de valeurs fermées ;
// [forme], une liste non vide ; ouVide([forme]), une liste qui peut être vide ; un objet, dont un
// champ suivi de « ? » est facultatif, comme dans contenu.ts.

export const TYPES_ETAPE = ['reconversion', 'bac+3', 'master'];
export const ETATS_ETAPE = ['accomplie', 'mise-en-avant', 'prevue'];
export const CLES_VOLET = ['application', 'backend', 'appui-devops'];
export const CLES_ILLUSTRATION = [
  'demonstration-schema',
  'demonstration-barres',
  'demonstration-couches',
  'demonstration-validation',
];

export const ouVide = (liste) => ({ ouVide: liste });

const paragraphes = ['texte'];
const date = { annee: 'nombre', 'mois?': 'nombre' };
const competence = { libelle: 'texte', rang: 'nombre' };
const image = { fichier: 'image', largeur: 'nombre', hauteur: 'nombre' };
const bloc = { intitule: 'texte', paragraphes: [[{ texte: 'texte', 'lien?': 'lien' }]] };
const orientations = { parcours: 'texte', competences: 'texte', experience: 'texte' };

/** Chaque fichier de src/contenu/<langue>/, hors des projets. */
export const MODELE = {
  'profil.json': { nom: 'texte', intitule: 'texte', liens: { github: 'https', linkedin: 'https' } },
  'accueil.json': {
    presentation: paragraphes,
    orientations: { ...orientations, methode: 'texte', projets: 'texte' },
  },
  'parcours.json': {
    introduction: 'texte',
    orientation: paragraphes,
    etapes: [
      {
        type: new Set(TYPES_ETAPE),
        intitule: 'texte',
        'etablissement?': 'texte',
        debut: date,
        fin: date,
        etat: new Set(ETATS_ETAPE),
      },
    ],
  },
  // Une catégorie sans compétence est retirée à la lecture (services/contenu) : ce n'est pas une faute.
  'competences.json': {
    techniques: [{ libelle: 'texte', rang: 'nombre', competences: ouVide([competence]) }],
    humaines: { competences: [competence], recit: paragraphes },
  },
  'experience.json': {
    entreprise: 'texte',
    periode: { debut: 'nombre', fin: 'nombre' },
    volets: [{ cle: new Set(CLES_VOLET), intitule: 'texte', description: paragraphes }],
    mentionConfidentialite: 'texte',
  },
  'methode.json': {
    etapes: [{ intitule: 'texte', texte: paragraphes, illustration: new Set(CLES_ILLUSTRATION) }],
    renvoi: { projet: 'texte' },
  },
  'textes-legaux.json': { mentionsLegales: [bloc], informationDonnees: [bloc] },
};

/** Chaque fichier de src/contenu/<langue>/projets/ : de zéro à plusieurs captures (MF-13). */
export const MODELE_PROJET = {
  identifiant: 'texte',
  titre: 'texte',
  description: paragraphes,
  descriptionCourte: 'texte',
  rang: 'nombre',
  captures: ouVide([{ ...image, alternatif: 'texte' }]),
  'vignette?': image,
  'lienCode?': 'https',
};
