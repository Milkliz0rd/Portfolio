import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { origineSite } from '../../../configuration/configuration.genere';
import type { Profil } from '../../interfaces/contenu';
import { FICHIER_PROFIL } from '../../services/contenu/profil';
import { domaineDe, Pied } from './pied';

/** Un profil de test : les adresses des profils viennent du contenu, jamais du code. */
const PROFIL: Profil = {
  nom: 'Prénom Nom',
  intitule: 'Intitulé de test',
  liens: {
    github: 'https://example.org/profil-github-de-test',
    linkedin: 'https://example.org/profil-linkedin-de-test',
  },
};

async function rendre() {
  const fixture = TestBed.createComponent(Pied);
  await fixture.whenStable();
  const hote = fixture.nativeElement as HTMLElement;
  const liens = [...hote.querySelectorAll('a')];
  const lien = (nom: string) => liens.find((l) => l.textContent?.trim().startsWith(nom))!;
  return { hote, pied: hote.querySelector('footer')!, liens, lien };
}

const texte = (element: Element) => element.textContent?.replace(/\s+/g, ' ').trim();

describe('Pied', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: FICHIER_PROFIL, useValue: PROFIL }],
    }),
  );

  it('clôt la page : la marque et les profils, puis la signature et les mentions légales', async () => {
    const { hote, pied } = await rendre();
    expect([...hote.children].map(({ localName }) => localName)).toEqual(['footer']);
    // Une région nommée, comme l'en-tête (« En-tête du site ») et le contenu principal.
    expect(pied.getAttribute('aria-label')).toBe('Pied de page du site');
    const rangees = [...pied.children].map((rangee) => rangee.className);
    expect(rangees).toEqual(['pied__haut', 'pied__bas']);
    const lus = [...pied.querySelectorAll('.pied__marque, a, .pied__signature')].map(texte);
    expect(lus).toEqual([
      'Prénom Nom',
      'GitHub (nouvel onglet)',
      'LinkedIn (nouvel onglet)',
      domaineDe(origineSite),
      'Mentions légales',
    ]);
  });

  it('mène aux profils GitHub et LinkedIn lus dans le profil, seuls liens hors du site', async () => {
    const { liens, lien } = await rendre();
    expect(lien('GitHub').getAttribute('href')).toBe(PROFIL.liens.github);
    expect(lien('LinkedIn').getAttribute('href')).toBe(PROFIL.liens.linkedin);
    // Aucun autre lien ne sort du site : ni X, ni aucun autre réseau.
    const horsDuSite = liens.map((l) => l.getAttribute('href')).filter((h) => /^\w+:/.test(h!));
    expect(horsDuSite).toEqual([PROFIL.liens.github, PROFIL.liens.linkedin]);
  });

  it.each(['GitHub', 'LinkedIn'])(
    'ouvre %s dans un nouvel onglet, annoncé, en lien discret de 44 px',
    async (nom) => {
      const { lien } = await rendre();
      const profil = lien(nom);
      expect(profil.getAttribute('target')).toBe('_blank');
      expect(profil.getAttribute('rel')?.split(' ').sort()).toEqual(['noopener', 'noreferrer']);
      expect(profil.classList).toContain('lien--discret');
      expect(profil.classList).toContain('lien--externe');
      expect(profil.classList).toContain('pied__lien');
      expect(profil.querySelector('.masque-visuellement')?.textContent?.trim()).toBe(
        '(nouvel onglet)',
      );
    },
  );

  it('mène aux mentions légales par un lien du routeur, discret, dans l’onglet courant', async () => {
    const { lien } = await rendre();
    const mentions = lien('Mentions légales');
    expect(mentions.getAttribute('href')).toBe('/mentions-legales');
    expect(['target', 'rel'].map((nom) => mentions.hasAttribute(nom))).toEqual([false, false]);
    expect([...mentions.classList].filter((c) => c.startsWith('lien--'))).toEqual([
      'lien--discret',
    ]);
    expect(mentions.classList).toContain('pied__lien');
  });

  it('signe du nom de domaine tiré d’origineSite, sans année ni symbole de droit d’auteur', async () => {
    const { pied } = await rendre();
    expect(texte(pied.querySelector('.pied__signature app-etiquette')!)).toBe(
      domaineDe(origineSite),
    );
    expect(texte(pied)).not.toMatch(/\b(1[89]|2\d)\d{2}\b/);
    expect(texte(pied)).not.toMatch(/\u00a9|\(c\)/i);
  });

  it('laisse au bouton de pause sa place après les mentions légales, sans bouton ni texte', async () => {
    const { pied, lien } = await rendre();
    const actions = pied.querySelector('.pied__bas > .pied__actions')!;
    expect([...actions.children]).toEqual([lien('Mentions légales')]);
    expect(pied.querySelectorAll('button')).toHaveLength(0);
    expect(texte(pied)).not.toMatch(/animation/i);
  });

  it('n’entre dans aucune animation d’arrivée : aucune classe du mouvement', async () => {
    const { hote } = await rendre();
    const classes = [hote, ...hote.querySelectorAll('*')].flatMap((e) => [...e.classList]);
    expect(classes.filter((classe) => classe.startsWith('mv-'))).toEqual([]);
  });
});

describe('domaineDe', () => {
  it.each([
    ['https://www.example.org', 'example.org'],
    ['https://example.org', 'example.org'],
    ['https://sous.example.org', 'sous.example.org'],
    ['http://localhost:8787', 'localhost'],
  ])('tire de %s le nom de domaine %s', (origine, domaine) => {
    expect(domaineDe(origine)).toBe(domaine);
  });
});

describe('Pied, selon la page affichée', () => {
  @Component({ template: '' })
  class PageVide {}

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'mentions-legales', component: PageVide },
          { path: 'contact', component: PageVide },
        ]),
        { provide: FICHIER_PROFIL, useValue: PROFIL },
      ],
    }),
  );

  it('désigne la page affichée par le lien des mentions légales, sur /mentions-legales seulement', async () => {
    const routeur = TestBed.inject(Router);
    const fixture = TestBed.createComponent(Pied);
    const mentions = () =>
      [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')].find((lien) =>
        lien.textContent?.trim().startsWith('Mentions légales'),
      )!;
    const aller = async (adresse: string) => {
      await routeur.navigateByUrl(adresse);
      await fixture.whenStable();
      return mentions().getAttribute('aria-current');
    };
    expect(await aller('/contact')).toBeNull();
    expect(await aller('/mentions-legales')).toBe('page');
    expect(await aller('/contact')).toBeNull();
  });
});
