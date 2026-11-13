// Règles des textes du contenu (PF-02, TK-28) : chaque tournure de la liste signée est relevée,
// insensible à la casse et avec l'une ou l'autre apostrophe, dans tout fichier de contenu, textes
// légaux compris ; « depuis » ne l'est que suivi d'une date, d'un nombre ou d'une durée ; une
// apostrophe droite est une faute, sauf dans une adresse.
import { describe, expect, it } from 'vitest';
import { fautes } from './controle-contenu-essais.mjs';

const tournure = 'erreur accueil presentation[0]: tournure qui se périme';
const apostrophe = 'erreur accueil presentation[0]: apostrophe droite';
/** Le texte, mis en premier paragraphe de la présentation de l'accueil. */
const presenter = (texte) => (c) => (c.accueil.presentation[0] = texte);

describe('controle-contenu : tournures qui se périment', () => {
  it.each([
    'Mon âge : 32 ans.',
    'Âgé de 32 ans.',
    'Je suis actuellement en master.',
    'Développeur depuis 2023.',
    'Développeur depuis 3 ans.',
    'Développeur depuis le 3 mars.',
    'Développeur depuis trois ans.',
    'Développeur depuis vingt-deux mois.',
    'Développeur depuis peu.',
    'Développeur depuis longtemps.',
    'Développeur depuis septembre.',
    'Développeur depuis un an.',
    'Développeur depuis des années.',
    'Développeur depuis l’an dernier.',
    'Développeur DEPUIS plus de dix ans.',
    'Développeur depuis près d’un an.',
    'Développeur depuis hier.',
    'Développeur depuis avant-hier.',
    'Développeur depuis l’été.',
    'Développeur depuis cet hiver.',
    'Il y a deux ans, j’ai changé de métier.',
    'En ce moment, je code.',
    'Aujourd’hui, je code.',
    'Cette année, je code.',
  ])('relève « %s »', (texte) => {
    expect(fautes(presenter(texte))).toEqual([tournure]);
  });

  it.each(["Aujourd'hui, je code.", "Développeur depuis l'an dernier."])(
    'relève « %s », avec l’apostrophe droite, qui est aussi une faute',
    (texte) => expect(fautes(presenter(texte))).toEqual([tournure, apostrophe]),
  );

  it('lit tous les fichiers de contenu, textes légaux compris', () => {
    const changer = (c) => {
      c['textes-legaux'].informationDonnees[0].paragraphes[0][0].texte = 'Gardées depuis 2023.';
      c.parcours.etapes[0].intitule = 'Reconversion il y a deux ans';
    };
    expect(fautes(changer)).toEqual([
      'erreur parcours etapes[0].intitule: tournure qui se périme',
      'erreur textes-legaux informationDonnees[0].paragraphes[0][0].texte: tournure qui se périme',
    ]);
  });

  it.each([
    'Reconversion depuis la restauration.',
    'Un passage depuis un restaurant, depuis le début, depuis Lean et depuis Marseille.',
    'Il y avait un langage ; il y aura un message ; c’est peut-être un partage.',
    'Les messages sont gardés au plus trois ans après le dernier échange.',
  ])('laisse passer « %s », en mode main', (texte) => {
    expect(fautes(presenter(texte), 'main')).toEqual([]);
  });
});

describe('controle-contenu : apostrophe droite', () => {
  it('relève une apostrophe droite dans un texte, dans tout fichier de contenu', () => {
    const changer = (c) => {
      c.accueil.presentation[0] = "L'accueil.";
      c['textes-legaux'].mentionsLegales[0].intitule = "Contact de l'éditeur";
    };
    expect(fautes(changer)).toEqual([
      apostrophe,
      'erreur textes-legaux mentionsLegales[0].intitule: apostrophe droite',
    ]);
  });

  it('laisse passer les adresses : liens, chemins et courriels, dans un texte ou un champ', () => {
    const changer = (c) => {
      c.accueil.presentation[0] =
        "Voir https://example.org/l'outil, /l'essai, ./l'essai ou camille.o'hara@example.org.";
      c['projets/portfolio'].lienCode = "https://example.org/l'outil";
      c['textes-legaux'].mentionsLegales[0].paragraphes[0][0].lien = "/l'essai";
    };
    expect(fautes(changer)).toEqual([]);
  });
});
