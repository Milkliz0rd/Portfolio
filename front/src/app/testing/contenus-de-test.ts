// Contenus de test de la couche d'accès (PF-01), écrits dans le désordre et sans les champs
// facultatifs, pour que les tests voient le tri, l'absence et le refus d'une valeur inconnue.
import type * as Modele from '../interfaces/contenu';

export const parcoursDeTest: Modele.Brut<Modele.Parcours> = {
  introduction: 'Introduction de test',
  orientation: ['Orientation de test'],
  etapes: [
    {
      type: 'master',
      intitule: 'Master',
      debut: { annee: 2025, mois: 9 },
      fin: { annee: 2028 },
      etat: 'prevue',
    },
    {
      type: 'reconversion',
      intitule: 'Reconversion',
      debut: { annee: 2021 },
      fin: { annee: 2022 },
      etat: 'accomplie',
    },
    {
      type: 'bac+3',
      intitule: 'Licence',
      etablissement: 'École',
      debut: { annee: 2022 },
      fin: { annee: 2025 },
      etat: 'mise-en-avant',
    },
  ],
};

const competence = (libelle: string, rang: number) => ({ libelle, rang });

export const competencesDeTest: Modele.Competences = {
  techniques: [
    { libelle: 'Troisième', rang: 3, competences: [competence('C', 2), competence('B', 1)] },
    { libelle: 'Vide', rang: 1, competences: [] },
    { libelle: 'Deuxième', rang: 2, competences: [competence('A', 1)] },
  ],
  humaines: { competences: [competence('Écoute', 2), competence('Rigueur', 1)], recit: ['Récit'] },
};

export const experienceDeTest: Modele.Brut<Modele.Experience> = {
  entreprise: 'Entreprise de test',
  periode: { debut: 2025, fin: 2028 },
  volets: [{ cle: 'backend', intitule: 'Backend', description: ['Description'] }],
  mentionConfidentialite: 'Mention de test',
};

export const textesLegauxDeTest: Modele.TextesLegaux = {
  mentionsLegales: [
    {
      intitule: 'Contact',
      paragraphes: [[{ texte: 'Par le ' }, { texte: 'formulaire', lien: '/contact' }]],
    },
  ],
  informationDonnees: [{ intitule: 'Données', paragraphes: [[{ texte: 'Sans lien' }]] }],
};
