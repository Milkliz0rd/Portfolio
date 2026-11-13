// Structure du contenu (PF-02, TK-28) : un contenu correct passe dans les deux modes ; chaque faute
// de structure sort seule, à son fichier et à son champ, dont un champ hors du modèle ; un
// emplacement étiqueté avertit en mode staging et bloque en mode main, et rien d'autre.
import { describe, expect, it } from 'vitest';
import { fautes } from './controle-contenu-essais.mjs';

const P = 'projets/portfolio';

describe('controle-contenu : structure et modes', () => {
  it('accepte un contenu correct, dans les deux modes', () => {
    expect(fautes(undefined, 'staging')).toEqual([]);
    expect(fautes(undefined, 'main')).toEqual([]);
  });

  it.each([
    ['profil cv: champ hors du modèle', (c) => (c.profil.cv = { fichier: 'cv.pdf' })],
    ['parcours etapes[0].duree: champ hors du modèle', (c) => (c.parcours.etapes[0].duree = 2)],
    ['profil liens.github: champ obligatoire absent', (c) => delete c.profil.liens.github],
    [`${P} titre: champ obligatoire absent`, (c) => delete c[P].titre],
    ['accueil orientations.methode: champ vide', (c) => (c.accueil.orientations.methode = ' ')],
    ['accueil presentation: champ vide', (c) => (c.accueil.presentation = [])],
    [`${P} captures[0].alternatif: champ vide`, (c) => (c[P].captures[0].alternatif = '')],
    [`${P} rang: type de champ`, (c) => (c[P].rang = '1')],
    ['parcours orientation: type de champ', (c) => (c.parcours.orientation = 'Texte.')],
    ['profil liens: type de champ', (c) => (c.profil.liens = 'https://github.com/exemple')],
    ['parcours etapes[2].type: valeur inconnue', (c) => (c.parcours.etapes[2].type = 'doctorat')],
    ['parcours etapes[0].etat: valeur inconnue', (c) => (c.parcours.etapes[0].etat = 'en-cours')],
    ['experience volets[2].cle: valeur inconnue', (c) => (c.experience.volets[2].cle = 'devops')],
    [
      'methode etapes[0].illustration: valeur inconnue',
      (c) => (c.methode.etapes[0].illustration = 'x'),
    ],
  ])('relève « %s », et rien d’autre', (attendu, changer) => {
    expect(fautes(changer)).toEqual([`erreur ${attendu}`]);
  });

  it('signale un emplacement étiqueté : avertissement en mode staging, erreur en mode main', () => {
    const etiqueter = (c) => {
      c.accueil.presentation[1] = 'Texte. [C-06 — présentation de l’accueil]';
      c.accueil.presentation[0] = 'Texte. [texte à valider — D-10]';
      c[P].captures = '[C-05 — captures]';
      c[P].vignette.largeur = '[C-05 — largeur de la vignette]';
    };
    const champs = [
      'accueil presentation[0]',
      'accueil presentation[1]',
      `${P} captures`,
      `${P} vignette.largeur`,
    ];
    const lignes = (gravite) => champs.map((champ) => `${gravite} ${champ}: emplacement étiqueté`);
    expect(fautes(etiqueter, 'staging')).toEqual(lignes('avertissement'));
    expect(fautes(etiqueter, 'main')).toEqual(lignes('erreur'));
  });
});
