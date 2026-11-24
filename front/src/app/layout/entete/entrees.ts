import type { Entree } from '../../services/navigation/navigation';

/** Une entrée de la navigation : son nom, l'ancre de sa section, son libellé. */
export interface EntreeNavigation {
  entree: Entree;
  ancre?: string;
  libelle: string;
}

/**
 * Les entrées de la navigation, une par section de la page principale (EC-00) : la seule liste,
 * que lisent la navigation complète de l'en-tête (CO-06) et le menu replié (CO-07), avec les mêmes
 * libellés et les mêmes identifiants de traduction. Liens du routeur vers / avec l'ancre de leur
 * section, sauf « Accueil ». Une fonction : les libellés se lisent à l'appel, une fois la traduction
 * en place, comme les messages du champ.
 */
export const entreesNavigation = (): readonly EntreeNavigation[] => [
  { entree: 'accueil', libelle: $localize`:@@entete.accueil:Accueil` },
  { entree: 'parcours', ancre: 'parcours', libelle: $localize`:@@entete.parcours:Parcours` },
  {
    entree: 'competences',
    ancre: 'competences',
    libelle: $localize`:@@entete.competences:Compétences`,
  },
  {
    entree: 'experience',
    ancre: 'experience',
    libelle: $localize`:@@entete.experience:Expérience`,
  },
  // « Méthode », et non « Méthode de travail » : choix C8.
  { entree: 'methode', ancre: 'methode', libelle: $localize`:@@entete.methode:Méthode` },
  { entree: 'projets', ancre: 'projets', libelle: $localize`:@@entete.projets:Projets` },
];
