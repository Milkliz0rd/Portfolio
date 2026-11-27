import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import experienceFr from '../../../../contenu/fr/experience.json';
import type { Brut, Experience as ContenuExperience } from '../../../interfaces/contenu';
import { FICHIER_EXPERIENCE } from '../../../services/contenu/experience';
import { formaterPeriode } from '../../../services/contenu/lecture/periode';
import { Experience } from './experience';

// Un contenu de test, autre que celui du build : chaque texte de la section en vient, et la
// section n'en dit pas d'autre que ses libellés.
const CONTENU_DE_TEST: Brut<ContenuExperience> = {
  entreprise: 'Entreprise de test',
  periode: { debut: 2031, fin: 2034 },
  volets: [
    {
      cle: 'application',
      intitule: 'Volet A',
      description: ['Premier paragraphe A.', 'Second paragraphe A.'],
    },
    { cle: 'backend', intitule: 'Volet B', description: ['Paragraphe B.'] },
    { cle: 'appui-devops', intitule: 'Volet C', description: ['Paragraphe C.'] },
  ],
  mentionConfidentialite: 'Mention de test.',
};

function rendre(fichier?: Brut<ContenuExperience>, langue?: string): HTMLElement {
  TestBed.configureTestingModule({
    providers: [
      ...(fichier ? [{ provide: FICHIER_EXPERIENCE, useValue: fichier }] : []),
      ...(langue ? [{ provide: LOCALE_ID, useValue: langue }] : []),
    ],
  });
  const fixture = TestBed.createComponent(Experience);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const tous = (hote: Element, selecteur: string) => [...hote.querySelectorAll(selecteur)];
const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
const textes = (hote: Element, selecteur: string) => tous(hote, selecteur).map(texte);
const precede = (a: Node, b: Node) =>
  (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

/** Les textes de la section, nœud par nœud, dans l'ordre de lecture. */
function lus(racine: Element): string[] {
  const parcours = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
  const morceaux: string[] = [];
  for (let noeud = parcours.nextNode(); noeud; noeud = parcours.nextNode()) {
    const morceau = noeud.textContent?.trim();
    if (morceau) morceaux.push(morceau);
  }
  return morceaux;
}

/** Les faits de l'en-tête : chaque clé et sa valeur. */
const faits = (section: Element) =>
  tous(section, 'app-liste-cle-valeur .liste-cle-valeur__paire').map((paire) => [
    texte(paire.querySelector('dt')),
    texte(paire.querySelector('dd')),
  ]);

describe('Experience', () => {
  it('s’ouvre sur l’ambiance d’une section, l’en-tête numéroté 03 seul dessus, titre seul de niveau 2 qui porte l’id de la section', () => {
    const section = rendre(CONTENU_DE_TEST);
    const ouverture = section.firstElementChild!;
    expect(ouverture.localName).toBe('app-ambiance');
    expect(ouverture.classList).toContain('ambiance--section');
    const entete = ouverture.querySelector('.conteneur-large > app-entete-section')!;
    expect(textes(entete, '.etiquette--numerotee > *')).toEqual(['03', '', 'Expérience']);
    const titres = tous(section, 'h1, h2');
    expect(titres.map((titre) => [titre.localName, texte(titre)])).toEqual([['h2', 'Expérience']]);
    expect(section.querySelector('#titre-experience')).toBe(titres[0]);
    expect(entete.querySelector('.entete-section__chapo')).toBeNull();
    expect(ouverture.querySelector('app-carte, app-message-etat, h3')).toBeNull();
  });

  it('pose sous le titre, dans le complément de l’en-tête, l’entreprise et la période du contenu, en ligne', () => {
    const section = rendre(CONTENU_DE_TEST);
    const complement = section.querySelector('app-entete-section .entete-section__complement')!;
    const liste = complement.querySelector('app-liste-cle-valeur')!;
    expect(liste.classList).toContain('liste-cle-valeur--en-ligne');
    expect(precede(section.querySelector('h2')!, liste)).toBe(true);
    expect(faits(section)).toEqual([
      ['Alternance', 'Entreprise de test'],
      ['Période', '2031–2034'],
    ]);
    // La période seule en chasse fixe (C6), comme une date.
    const valeurs = tous(liste, 'dd');
    expect(valeurs.map((dd) => dd.classList.contains('liste-cle-valeur__valeur--date'))).toEqual([
      false,
      true,
    ]);
  });

  it('écrit la période par formaterPeriode, dans la langue de l’application, jamais en dur', () => {
    const attendue = formaterPeriode({ annee: 2031 }, { annee: 2034 }, 'ja');
    expect(attendue).not.toBe('2031–2034');
    expect(faits(rendre(CONTENU_DE_TEST, 'ja'))[1]).toEqual(['Période', attendue]);
  });

  it('ne lit jamais la date du jour', () => {
    // Horloge factice, rendue dans tous les cas : Vitest tourne sans isolation (#169).
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      vi.setSystemTime(Date.UTC(2020, 0, 1));
      const avant = lus(rendre(CONTENU_DE_TEST));
      TestBed.resetTestingModule();
      vi.setSystemTime(Date.UTC(2040, 5, 15));
      expect(lus(rendre(CONTENU_DE_TEST))).toEqual(avant);
    } finally {
      vi.useRealTimers();
    }
  });

  it('décrit le rôle en trois volets, une carte pleine par volet, dans l’ordre du contenu, numérotés 01 à 03, hors de l’ambiance', () => {
    const section = rendre(CONTENU_DE_TEST);
    expect(textes(section, 'h3')).toEqual(['Le rôle, en trois volets']);
    const cartes = tous(section, '.experience__volets > li > app-carte');
    expect(cartes.map((carte) => carte.classList.contains('carte--pleine'))).toEqual([
      true,
      true,
      true,
    ]);
    expect(cartes.filter((carte) => carte.closest('app-ambiance'))).toEqual([]);
    expect(cartes.map((carte) => texte(carte.querySelector('h4')))).toEqual([
      'Volet A',
      'Volet B',
      'Volet C',
    ]);
    expect(cartes.map((carte) => textes(carte, '.etiquette--numerotee > *'))).toEqual([
      ['01', '', 'Volet'],
      ['02', '', 'Volet'],
      ['03', '', 'Volet'],
    ]);
    expect(cartes.map((carte) => textes(carte, 'p'))).toEqual(
      CONTENU_DE_TEST.volets.map(({ description }) => description),
    );
    expect(section.querySelector('.experience__volets')?.getAttribute('role')).toBe('list');
  });

  it('dit, sous les volets, que les projets menés en entreprise ne sont pas partageables', () => {
    const section = rendre(CONTENU_DE_TEST);
    const mention = section.querySelector('app-message-etat')!;
    expect(mention.classList).toContain('message-etat--information');
    expect(texte(mention.querySelector('.message-etat__titre'))).toBe('Projets d’entreprise');
    expect(texte(mention.querySelector('.message-etat__texte'))).toBe('Mention de test.');
    expect(precede(section.querySelector('.experience__volets')!, mention)).toBe(true);
    expect(mention.closest('app-ambiance')).toBeNull();
  });

  it('ne dit rien d’autre que le contenu et ses libellés : ni projet, ni lien, ni bouton', () => {
    const section = rendre(CONTENU_DE_TEST);
    expect(lus(section)).toEqual([
      '03',
      'Expérience',
      'Expérience',
      'Alternance',
      'Entreprise de test',
      'Période',
      '2031–2034',
      'Le rôle, en trois volets',
      ...CONTENU_DE_TEST.volets.flatMap(({ intitule, description }, rang) => [
        `0${rang + 1}`,
        'Volet',
        intitule,
        ...description,
      ]),
      'Projets d’entreprise',
      'Mention de test.',
    ]);
    expect(section.querySelector('a, button, input, [tabindex], app-fenetre')).toBeNull();
  });

  it('lit experience.json, celui du build, sans date ni durée relative, et n’anime rien', () => {
    const section = rendre();
    const { entreprise, periode } = experienceFr;
    expect(faits(section)).toEqual([
      ['Alternance', entreprise],
      ['Période', formaterPeriode({ annee: periode.debut }, { annee: periode.fin }, 'fr')],
    ]);
    expect(texte(section)).not.toMatch(
      /\b\d+\s*(ans?|mois|années?)\b|actuellement|en cours|depuis|il y a|en ce moment|aujourd[’']hui|cette année/i,
    );
    const animes = [section, ...section.querySelectorAll('*')].filter(
      (e) =>
        [...e.classList].some((classe) => classe.startsWith('mv-')) ||
        [...e.attributes].some(({ name }) => /^(appmv|data-mv)/i.test(name)),
    );
    expect(animes).toEqual([]);
  });
});
