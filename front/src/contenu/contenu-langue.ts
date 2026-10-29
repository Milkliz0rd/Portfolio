// Rattache le build à la langue de son contenu (CT-04), le français en v2.0.0, et vérifie chaque
// fichier contre le modèle. La v2.0.1 en donnera une variante anglaise à son build (PF-03).
import type * as Modele from '../app/interfaces/contenu';
import accueil from './fr/accueil.json';
import competences from './fr/competences.json';
import experience from './fr/experience.json';
import methode from './fr/methode.json';
import parcours from './fr/parcours.json';
import profil from './fr/profil.json';
import textesLegaux from './fr/textes-legaux.json';

/** La langue du contenu : celle de LOCALE_ID, la langue source d'angular.json. */
export const langueContenu = 'fr';

export const contenuProfil: Modele.Profil = profil;
export const contenuAccueil: Modele.Accueil = accueil;
export const contenuParcours: Modele.Brut<Modele.Parcours> = parcours;
export const contenuCompetences: Modele.Competences = competences;
export const contenuExperience: Modele.Brut<Modele.Experience> = experience;
export const contenuMethode: Modele.Brut<Modele.Methode> = methode;
export const contenuTextesLegaux: Modele.TextesLegaux = textesLegaux;
