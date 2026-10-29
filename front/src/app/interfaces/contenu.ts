// Modèle typé du contenu (PF-02), d'après la section 5 de la conception technique et les
// maquettes. Du texte brut, jamais de HTML ; les libellés d'interface n'en font pas partie (PF-03).

/** Un contenu encore à fournir : « [C-xx — description] », exactement comme sur les maquettes. */
export type Emplacement = string;

/** Un champ de date ou de nombre accepte aussi l'emplacement étiqueté du contenu qui manque. */
export type NombreOuEmplacement = number | Emplacement;

export type Paragraphes = readonly string[];

/** Un fichier JSON tel que TypeScript le lit, chaque valeur fermée élargie en string. */
export type Brut<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Brut<U>[]
    : T extends object
      ? { readonly [K in keyof T]: Brut<T[K]> }
      : T;

/** profil.json, une seule occurrence (MF-01, MF-15, MF-17). */
export interface Profil {
  readonly nom: string;
  readonly intitule: string;
  /** Adresses HTTPS ; aucun lien vers X (Q-08). */
  readonly liens: { readonly github: string; readonly linkedin: string };
  /** Nom du fichier dans public/cv/ (C-03), sans date ni mention de situation (A-07). */
  readonly cv: { readonly fichier: string };
}

export type SectionOrientee = 'parcours' | 'competences' | 'experience' | 'methode' | 'projets';

/** accueil.json : la présentation (C-06) et une phrase d'orientation par carte (C-10). */
export interface Accueil {
  readonly presentation: Paragraphes;
  readonly orientations: Readonly<Record<SectionOrientee, string>>;
}

/** Les types d'étape du parcours, dans leur ordre d'affichage, toujours le même (MF-07). */
export const TYPES_ETAPE = ['reconversion', 'bac+3', 'master'] as const;
export type TypeEtape = (typeof TYPES_ETAPE)[number];

/** L'état d'une étape est écrit dans le contenu, jamais déduit de la date du jour (MF-18). */
export const ETATS_ETAPE = ['accomplie', 'mise-en-avant', 'prevue'] as const;
export type EtatEtape = (typeof ETATS_ETAPE)[number];

/** Une date du parcours, au mois ou à l'année (Q-03, Q-04). */
export interface DateParcours {
  readonly annee: NombreOuEmplacement;
  readonly mois?: NombreOuEmplacement;
}

export interface EtapeParcours {
  readonly type: TypeEtape;
  readonly intitule: string;
  /** Obligatoire pour le bac+3 (Q-04). */
  readonly etablissement?: string;
  readonly debut: DateParcours | Emplacement;
  readonly fin: DateParcours | Emplacement;
  readonly etat: EtatEtape;
}

/** parcours.json : introduction (C-10), orientation (C-09) et étapes (C-01). */
export interface Parcours {
  readonly introduction: string;
  readonly orientation: Paragraphes;
  readonly etapes: readonly EtapeParcours[];
}

/** Une compétence de la liste fournie (C-02), sans niveau (Q-06), rangée dans sa catégorie. */
export interface Competence {
  readonly libelle: string;
  readonly rang: number;
}

export interface CategorieCompetences {
  readonly libelle: string;
  readonly rang: number;
  readonly competences: readonly Competence[];
}

/** competences.json (MF-09, MF-10) ; le récit de reconversion (C-07) va aux humaines seules. */
export interface Competences {
  readonly techniques: readonly CategorieCompetences[];
  readonly humaines: { readonly competences: readonly Competence[]; readonly recit: Paragraphes };
}

/** Les trois volets du rôle en alternance : l'appui DevOps est un appui, pas un poste (MF-11). */
export const CLES_VOLET = ['application', 'backend', 'appui-devops'] as const;
export type CleVolet = (typeof CLES_VOLET)[number];

export interface Volet {
  readonly cle: CleVolet;
  readonly intitule: string;
  readonly description: Paragraphes;
}

/** experience.json : seul fichier qui nomme l'entreprise et la période de l'alternance (PF-02). */
export interface Experience {
  readonly entreprise: string;
  /** En années, jamais au présent (Q-02). */
  readonly periode: { readonly debut: number; readonly fin: number };
  /** Exactement trois, un par clé (C-08). */
  readonly volets: readonly Volet[];
  /** Les projets menés en entreprise ne sont pas partageables (Q-05). */
  readonly mentionConfidentialite: string;
}

export const CLES_ILLUSTRATION = [
  'demonstration-schema',
  'demonstration-barres',
  'demonstration-couches',
  'demonstration-validation',
] as const;
export type CleIllustration = (typeof CLES_ILLUSTRATION)[number];

/** Une étape de la méthode (MV-08) : son intitulé, son texte et la clé de son illustration. */
export interface EtapeMethode {
  readonly intitule: string;
  readonly texte: Paragraphes;
  readonly illustration: CleIllustration;
}

/** methode.json : la méthode en étapes (C-04) et l'identifiant du projet de son renvoi (MF-22). */
export interface Methode {
  readonly etapes: readonly EtapeMethode[];
  readonly renvoi: { readonly projet: string };
}

/** Une capture : fichier présent dans le dépôt, texte alternatif obligatoire, dimensions. */
export interface Capture {
  readonly fichier: string;
  readonly alternatif: string;
  readonly largeur: NombreOuEmplacement;
  readonly hauteur: NombreOuEmplacement;
}

/** La vignette de la liste des projets (choix C2) : décorative, sans texte alternatif. */
export interface Vignette {
  readonly fichier: string;
  readonly largeur: number;
  readonly hauteur: number;
}

/** projets/<identifiant>.json : un fichier et un dossier d'images par projet (MF-12 à MF-14). */
export interface Projet {
  /** Le nom du fichier : minuscules, chiffres et tirets, jamais « 404 » ; ne change jamais. */
  readonly identifiant: string;
  readonly titre: string;
  readonly description: Paragraphes;
  readonly descriptionCourte: string;
  /** Ordre dans la liste : ajouter un projet ne modifie pas les autres. */
  readonly rang: number;
  readonly captures: readonly Capture[];
  readonly vignette?: Vignette;
  /** Adresse HTTPS du code source ; absente, rien n'est affiché. */
  readonly lienCode?: string;
}

/** Un morceau de paragraphe : un texte seul, ou un texte et son lien (interne ou HTTPS). */
export interface Segment {
  readonly texte: string;
  readonly lien?: string;
}

/** Un bloc de texte : son intitulé, puis ses paragraphes, chacun fait de segments. */
export interface BlocTexte {
  readonly intitule: string;
  readonly paragraphes: readonly (readonly Segment[])[];
}

/** textes-legaux.json : mentions légales (MF-19) et information sur les données (MF-20). */
export interface TextesLegaux {
  readonly mentionsLegales: readonly BlocTexte[];
  readonly informationDonnees: readonly BlocTexte[];
}
