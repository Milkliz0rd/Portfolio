// Règles du contenu qui croisent les champs (PF-02, TK-28) : chaque faute sort seule, à son fichier
// et à son champ ; un champ étiqueté n'y est pas soumis ; les dimensions d'un WebP se lisent dans
// ses trois en-têtes, VP8, VP8L et VP8X, sur de vrais fichiers produits par cwebp.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { dimensionsWebp } from '../controle-contenu/webp.mjs';
import { ESSAIS, fautes } from './controle-contenu-essais.mjs';

const P = 'projets/portfolio';
/** Un second projet, copie du premier sans image, sous projets/<nom>.json. */
const projet =
  (nom, champs = {}) =>
  (c) => {
    c[`projets/${nom}`] = { ...c[P], identifiant: nom, rang: 2, captures: [], ...champs };
    delete c[`projets/${nom}`].vignette;
  };
const legal = (c) => c['textes-legaux'].mentionsLegales[0].paragraphes[0][0];

describe('controle-contenu : règles croisées', () => {
  it.each([
    ['projets/Mon-Projet identifiant: identifiant de projet', projet('Mon-Projet')],
    ['projets/404 identifiant: identifiant de projet', projet('404')],
    ['projets/autre identifiant: identifiant de projet', projet('autre', { identifiant: 'x' })],
    [
      'projets/copie identifiant: identifiant de projet',
      projet('copie', { identifiant: 'portfolio' }),
    ],
    ['projets/autre rang: rang', projet('autre', { rang: 1 })],
    [`${P} rang: rang`, (c) => (c[P].rang = 1.5)],
    ['competences techniques[1].rang: rang', (c) => (c.competences.techniques[1].rang = 1)],
    [
      'competences humaines.competences[1].rang: rang',
      (c) => c.competences.humaines.competences.push({ libelle: 'Écoute', rang: 1 }),
    ],
    [`${P} captures[0].fichier: image`, (c) => (c[P].captures[0].fichier = 'capture-09.webp')],
    [`${P} captures[1].fichier: image`, (c) => (c[P].captures[1].fichier = 'texte.webp')],
    [`${P} vignette.fichier: image`, (c) => (c[P].vignette.fichier = 'vignette.png')],
    [`${P} captures[0]: image`, (c) => (c[P].captures[0].largeur = 1200)],
    [`${P} vignette: image`, (c) => (c[P].vignette.hauteur = 201)],
    [
      'profil liens.linkedin: lien en HTTPS',
      (c) => (c.profil.liens.linkedin = 'http://linkedin.com/in/x'),
    ],
    [`${P} lienCode: lien en HTTPS`, (c) => (c[P].lienCode = 'github.com/exemple/portfolio')],
    [
      'textes-legaux mentionsLegales[0].paragraphes[0][0].lien: lien en HTTPS',
      (c) => (legal(c).lien = '//exemple.fr'),
    ],
    ['methode renvoi.projet: renvoi de la méthode', (c) => (c.methode.renvoi.projet = 'inconnu')],
    [
      'parcours etapes[1].type: ordre du parcours',
      (c) => c.parcours.etapes.unshift(...c.parcours.etapes.splice(1, 1)),
    ],
    [
      'parcours etapes[1].etablissement: établissement du bac+3',
      (c) => delete c.parcours.etapes[1].etablissement,
    ],
    ['parcours etapes[0].debut.mois: date', (c) => (c.parcours.etapes[0].debut.mois = 13)],
    ['parcours etapes[2].fin.annee: date', (c) => (c.parcours.etapes[2].fin.annee = 28)],
    [
      'parcours etapes[1].fin: fin avant le début',
      (c) => (c.parcours.etapes[1].fin = { annee: 2021, mois: 3 }),
    ],
    ['experience periode.debut: date', (c) => (c.experience.periode.debut = 25)],
    ['experience periode.fin: fin avant le début', (c) => (c.experience.periode.fin = 2024)],
    [
      'parcours etapes[2].etat: une seule étape mise en avant',
      (c) => (c.parcours.etapes[0].etat = 'mise-en-avant'),
    ],
    ['experience volets: trois volets', (c) => c.experience.volets.pop()],
    ['experience volets[2].cle: trois volets', (c) => (c.experience.volets[2].cle = 'backend')],
    [
      'accueil presentation[0]: pas de HTML',
      (c) => (c.accueil.presentation[0] = 'Un <strong>mot</strong>.'),
    ],
    ['profil nom: pas de HTML', (c) => (c.profil.nom = 'Camille <!-- note -->')],
    [
      'textes-legaux mentionsLegales[0].paragraphes[0][0].texte: pas de HTML',
      (c) => (legal(c).texte = 'Fin</p>'),
    ],
  ])('relève « %s », et rien d’autre', (attendu, changer) => {
    expect(fautes(changer)).toEqual([`erreur ${attendu}`]);
  });

  it('accepte « < » suivi d’une espace ou d’un chiffre, et une date au même mois', () => {
    const changer = (c) => {
      c.accueil.presentation[0] = 'Moins de 3 < 4, et 1 <2.';
      c.parcours.etapes[1].fin = { annee: 2021, mois: 9 };
    };
    expect(fautes(changer)).toEqual([]);
  });

  it('ne soumet un champ étiqueté qu’à la règle des emplacements', () => {
    const etiqueter = (c) => {
      c[P].captures[0] = { ...c[P].captures[0], fichier: '[C-05 — capture 1]', largeur: 1 };
      c[P].vignette.largeur = '[C-05 — largeur]';
      c.parcours.etapes[1].etablissement = '[C-01 — établissement]';
      c.parcours.etapes[2].debut = '[C-01 — début du master]';
      c.methode.renvoi.projet = '[C-04 — projet du renvoi]';
      c.profil.liens.github = '[C-10 — <a> en http://]';
    };
    const autres = fautes(etiqueter, 'staging').filter((f) => !f.endsWith('emplacement étiqueté'));
    expect(autres).toEqual([]);
    expect(fautes(etiqueter, 'staging')).toHaveLength(6);
  });
});

describe('controle-contenu : dimensions d’un WebP', () => {
  const lire = (nom) => readFileSync(join(ESSAIS, 'public/images/projets/portfolio', nom));

  it.each([
    ['capture-01.webp', 'VP8L', 1000, 600],
    ['capture-02.webp', 'VP8X', 1280, 3],
    ['vignette.webp', 'VP8 ', 300, 200],
  ])('lit %s, en-tête %s, dans son en-tête', (nom, morceau, largeur, hauteur) => {
    expect(lire(nom).toString('latin1', 12, 16)).toBe(morceau);
    expect(dimensionsWebp(lire(nom))).toEqual({ largeur, hauteur });
  });

  it('ne lit rien dans un autre fichier, ni dans un WebP tronqué', () => {
    expect(dimensionsWebp(lire('texte.webp'))).toBeNull();
    expect(dimensionsWebp(lire('vignette.webp').subarray(0, 24))).toBeNull();
  });
});
