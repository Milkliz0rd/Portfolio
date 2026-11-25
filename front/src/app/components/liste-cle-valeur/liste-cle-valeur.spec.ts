import { Location } from '@angular/common';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, provideRouter, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import {
  ListeCleValeur,
  PaireCleValeur,
  ParagraphesValeur,
  VarianteListeCleValeur,
} from './liste-cle-valeur';

const PAIRES: PaireCleValeur[] = [
  { cle: 'Rôle', valeur: 'Développeur' },
  { cle: 'Période', valeur: '2024 – 2026', date: true },
  { cle: 'Absente' },
  { cle: 'Nulle', valeur: null },
  { cle: 'Vide', valeur: '' },
  { cle: 'Espaces', valeur: '   ' },
  { cle: 'Pile', valeur: 'Angular, Spring Boot' },
];

function rendre(paires = PAIRES, variante?: VarianteListeCleValeur): HTMLElement {
  const fixture = TestBed.createComponent(ListeCleValeur);
  fixture.componentRef.setInput('paires', paires);
  if (variante) {
    fixture.componentRef.setInput('variante', variante);
  }
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const texte = (element: Element) => element.textContent?.replace(/\s+/g, ' ').trim();

describe('ListeCleValeur', () => {
  it('est une liste de définitions, une paire par div, une clé puis sa valeur', () => {
    const liste = rendre().querySelector('dl')!;
    for (const paire of liste.children) {
      expect(paire.localName).toBe('div');
      expect([...paire.children].map((enfant) => enfant.localName)).toEqual(['dt', 'dd']);
    }
    expect(liste.querySelectorAll('dt')).toHaveLength(liste.querySelectorAll('dd').length);
  });

  it('retire toute paire dont la valeur manque, nulle ou vide après retrait des espaces', () => {
    const liste = rendre().querySelector('dl')!;
    expect([...liste.querySelectorAll('dt')].map(texte)).toEqual(['Rôle', 'Période', 'Pile']);
    expect([...liste.querySelectorAll('dd')].map(texte)).toEqual([
      'Développeur',
      '2024 – 2026',
      'Angular, Spring Boot',
    ]);
  });

  it('ne rend aucune liste quand aucune paire n’a de valeur', () => {
    const hote = rendre([{ cle: 'Absente' }, { cle: 'Vide', valeur: ' ' }]);
    expect(hote.querySelector('dl')).toBeNull();
    expect(hote.children).toHaveLength(0);
  });

  it('annonce chaque clé par une étiquette discrète', () => {
    for (const cle of rendre().querySelectorAll('dt')) {
      const etiquette = cle.querySelector('app-etiquette');
      expect(etiquette?.classList).toContain('etiquette--discrete');
      expect(cle.children).toHaveLength(1);
    }
  });

  it('écrit la seule valeur de date ou de période en chasse fixe', () => {
    const dates = [...rendre().querySelectorAll('dd.liste-cle-valeur__valeur--date')];
    expect(dates.map(texte)).toEqual(['2024 – 2026']);
  });

  it.each(['en-ligne', 'tableau'] as const)('porte la seule classe de « %s »', (variante) => {
    const classes = [...rendre(PAIRES, variante).classList];
    expect(classes).toContain('liste-cle-valeur');
    expect(classes.filter((classe) => classe.startsWith('liste-cle-valeur--'))).toEqual([
      `liste-cle-valeur--${variante}`,
    ]);
  });

  it('est en ligne par défaut, et statique', () => {
    const hote = rendre();
    expect(hote.classList).toContain('liste-cle-valeur--en-ligne');
    expect(hote.querySelector('a, button, input, [tabindex]')).toBeNull();
  });
});

@Component({ template: '' })
class PageVide {}

// Une valeur en paragraphes, dans le vrai routeur, sur un historique simulé (SpyLocation).
describe('ListeCleValeur, valeur en paragraphes', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: PageVide },
          { path: 'contact', component: PageVide },
        ]),
        provideLocationMocks(),
      ],
    }),
  );

  const CONTACT: ParagraphesValeur = [
    [{ texte: 'Par le ' }, { texte: 'formulaire de contact', lien: '/contact' }, { texte: '.' }],
  ];

  it('rend chaque paragraphe dans la valeur, chaque segment tel quel, sans espace ajoutée', () => {
    const valeur = [
      ...CONTACT,
      [{ texte: '   ' }],
      [{ texte: 'Deuxième ' }, { texte: 'paragraphe' }],
    ] satisfies ParagraphesValeur;
    const dd = rendre([{ cle: 'Contact', valeur }], 'tableau').querySelector('dd')!;
    const paragraphes = [...dd.querySelectorAll('p.liste-cle-valeur__paragraphe')];
    expect(paragraphes.map((p) => p.textContent)).toEqual([
      'Par le formulaire de contact.',
      'Deuxième paragraphe',
    ]);
  });

  it('fait d’une adresse du site un lien du routeur, avec son ancre, en variante texte', () => {
    const valeur = [
      ...CONTACT,
      [{ texte: 'Une section', lien: '/', fragment: 'competence' }],
    ] satisfies ParagraphesValeur;
    const liens = [...rendre([{ cle: 'Contact', valeur }]).querySelectorAll('a')];
    expect(liens.map((lien) => lien.getAttribute('href'))).toEqual(['/contact', '/#competence']);
    for (const lien of liens) {
      expect(lien.classList).toContain('lien--texte');
      expect(lien.getAttribute('target')).toBeNull();
    }
  });

  it('suit l’adresse et son ancre par le routeur, en ajoutant une entrée d’historique', async () => {
    const routeur = TestBed.inject(Router);
    const historique = TestBed.inject(Location) as SpyLocation;
    await routeur.navigateByUrl('/contact');
    const valeur = [[{ texte: 'Une section', lien: '/', fragment: 'competence' }]];
    const lien = rendre([{ cle: 'Lien', valeur }]).querySelector('a')!;
    const avant = historique.urlChanges.length;
    const fin = firstValueFrom(routeur.events.pipe(filter((e) => e instanceof NavigationEnd)));
    const clic = new MouseEvent('click', { bubbles: true, cancelable: true });
    lien.dispatchEvent(clic);
    await fin;
    // Le routeur a pris le clic : le navigateur n'a pas suivi le lien lui-même.
    expect(clic.defaultPrevented).toBe(true);
    expect(routeur.url).toBe('/#competence');
    expect(historique.urlChanges.slice(avant)).toEqual(['/#competence']);
  });

  it('ouvre un lien externe dans un nouvel onglet, posé par href, et l’annonce', () => {
    const valeur = [[{ texte: 'Hébergeur', lien: 'https://example.org/', externe: true }]];
    const lien = rendre([{ cle: 'Hébergement', valeur }]).querySelector('a')!;
    expect(lien.getAttribute('href')).toBe('https://example.org/');
    expect([lien.getAttribute('target'), lien.getAttribute('rel')]).toEqual([
      '_blank',
      'noopener noreferrer',
    ]);
    expect(texte(lien)).toBe('Hébergeur (nouvel onglet)');
  });

  it('retire la paire dont aucun paragraphe n’a de texte, et ne rend que les paragraphes pleins', () => {
    const hote = rendre([
      { cle: 'Vide', valeur: [] },
      { cle: 'Blanche', valeur: [[{ texte: ' ' }], [{ texte: '', lien: '/contact' }]] },
      { cle: 'Pleine', valeur: [[{ texte: '' }], [{ texte: 'Texte' }]] },
    ]);
    expect([...hote.querySelectorAll('dt')].map(texte)).toEqual(['Pleine']);
    expect(hote.querySelectorAll('dd p')).toHaveLength(1);
  });
});
