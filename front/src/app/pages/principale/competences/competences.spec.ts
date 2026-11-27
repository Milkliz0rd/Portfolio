import { TestBed } from '@angular/core/testing';
import { competencesDuBanc } from '../../../../configuration/configuration.genere';
import type { Competences as ContenuCompetences } from '../../../interfaces/contenu';
import { FICHIER_COMPETENCES } from '../../../services/contenu/competences';
import { competencesDeTest } from '../../../testing/contenus-de-test';
import { Competences } from './competences';

// competencesDeTest est écrit dans le désordre : la catégorie « Vide », sans compétence, au rang 1 ;
// « Troisième » avant « Deuxième », et ses compétences C (rang 2) avant B (rang 1).

function rendre(fichier: ContenuCompetences = competencesDeTest) {
  TestBed.configureTestingModule({
    providers: [{ provide: FICHIER_COMPETENCES, useValue: fichier }],
  });
  const fixture = TestBed.createComponent(Competences);
  fixture.detectChanges();
  return fixture;
}

const section = (fichier?: ContenuCompetences) => rendre(fichier).nativeElement as HTMLElement;
const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
const textes = (elements: Iterable<Element>) => [...elements].map(texte);

/** Chaque catégorie affichée : son titre et ses compétences, dans l'ordre de la page. */
const categories = (racine: HTMLElement) =>
  [...racine.querySelectorAll('.competences__categories > li')].map((element) => [
    texte(element.querySelector('h4')),
    textes(element.querySelectorAll('app-pastille')),
  ]);

/** Les textes de la section, nœud par nœud, dans l'ordre de lecture. */
function lus(racine: HTMLElement): string[] {
  const parcours = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT);
  const morceaux: string[] = [];
  for (let noeud = parcours.nextNode(); noeud; noeud = parcours.nextNode()) {
    const morceau = noeud.textContent?.trim();
    if (morceau) morceaux.push(morceau);
  }
  return morceaux;
}

describe('Competences', () => {
  it('s’ouvre sur l’en-tête numéroté 02, titre seul de niveau 2, qui porte l’id de la section', () => {
    const racine = section();
    const entete = racine.firstElementChild!;
    expect(entete.localName).toBe('app-entete-section');
    expect(textes(entete.querySelectorAll('.etiquette__numero, .etiquette__texte'))).toEqual([
      '02',
      'Compétences',
    ]);
    const titres = [...racine.querySelectorAll('h1, h2')];
    expect(titres.map((titre) => [titre.localName, texte(titre)])).toEqual([['h2', 'Compétences']]);
    expect(racine.querySelector('#titre-competences')).toBe(titres[0]);
    expect(entete.querySelector('.entete-section__chapo')).toBeNull();
  });

  it('range les catégories et leurs compétences par rang, seulement celles du contenu', () => {
    const racine = section();
    expect(categories(racine)).toEqual([
      ['Deuxième', ['A']],
      ['Troisième', ['B', 'C']],
    ]);
    const cartes = [...racine.querySelectorAll('.competences__categories app-carte')];
    expect(cartes.map((carte) => carte.classList.contains('carte--pleine'))).toEqual([true, true]);
    expect(textes(racine.querySelectorAll('.competences__categories .etiquette'))).toEqual([
      'Catégorie',
      'Catégorie',
    ]);
  });

  it('n’affiche pas une catégorie sans compétence, ni rien à sa place', () => {
    const racine = section();
    expect(lus(racine)).not.toContain('Vide');
    const elements = [...racine.querySelectorAll('.competences__categories > li')];
    expect(elements.map((element) => element.querySelectorAll('app-pastille').length)).toEqual([
      1, 2,
    ]);
  });

  // CI=true et npm test écrivent la configuration de l'environnement test, qui porte le contenu de
  // test du banc (outils/ecrire-configuration.mjs).
  it('lit dans le build de test la catégorie vide du banc, sans l’afficher non plus', () => {
    expect(competencesDuBanc.map(({ competences }) => competences.length)).toEqual([0]);
    const fixture = rendre();
    const lu = fixture.debugElement.injector.get(FICHIER_COMPETENCES);
    expect(lu.techniques).toEqual([...competencesDeTest.techniques, ...competencesDuBanc]);
    expect(lus(fixture.nativeElement as HTMLElement)).not.toContain(competencesDuBanc[0].libelle);
    expect(categories(fixture.nativeElement as HTMLElement)).toHaveLength(2);
  });

  it('pose les compétences humaines en pastilles sous le titre de leur bloc, sans carte, puis le récit', () => {
    const racine = section();
    const blocs = [...racine.querySelectorAll('h3')];
    expect(textes(blocs)).toEqual(['Compétences techniques', 'Compétences humaines']);
    const [liste, recit] = [...blocs[1].nextElementSibling!.children];
    expect(liste.localName).toBe('ul');
    expect(textes(liste.querySelectorAll('app-pastille'))).toEqual(['Rigueur', 'Écoute']);
    expect(liste.closest('app-carte')).toBeNull();
    expect(recit.localName).toBe('app-carte');
    expect(recit.classList).toContain('carte--pleine');
    expect(textes(recit.querySelectorAll('.etiquette, h4, p'))).toEqual([
      'Reconversion',
      'Depuis la restauration',
      'Récit',
    ]);
    expect(recit.querySelector('app-pastille')).toBeNull();
  });

  it('n’affiche aucun niveau : chaque compétence n’est que son libellé', () => {
    const racine = section();
    const elements = [...racine.querySelectorAll('.competences__pastilles > *')];
    expect(elements).toHaveLength(5);
    for (const element of elements) {
      expect(element.localName).toBe('li');
      expect([...element.children].map((enfant) => enfant.localName)).toEqual(['app-pastille']);
      expect(element.querySelector('.pastille__mot')?.children).toHaveLength(0);
    }
    const mesures = '[role="progressbar"], [role="meter"], [role="slider"], [aria-valuenow]';
    expect(racine.querySelectorAll(`progress, meter, ${mesures}`)).toHaveLength(0);
    // Rien que les libellés de la section et le contenu : ni note, ni pourcentage, ni symbole.
    expect(lus(racine)).toEqual([
      '02',
      'Compétences',
      'Compétences',
      'Compétences techniques',
      'Catégorie',
      'Deuxième',
      'A',
      'Catégorie',
      'Troisième',
      'B',
      'C',
      'Compétences humaines',
      'Rigueur',
      'Écoute',
      'Reconversion',
      'Depuis la restauration',
      'Récit',
    ]);
  });

  // jsdom ne calcule pas la mise en page, mais il applique les feuilles des composants, requêtes
  // média comprises (fenêtre de 1024 px) : les propriétés calculées disent que rien ne retient une
  // pastille plus longue que la ligne, ni sa liste, ni la colonne qui la porte.
  it('laisse une compétence longue passer à la ligne, sans élargir sa liste', () => {
    const longue = 'interopérabilité'.repeat(8);
    const racine = section({
      ...competencesDeTest,
      humaines: { ...competencesDeTest.humaines, competences: [{ libelle: longue, rang: 1 }] },
    });
    const pastille = [...racine.querySelectorAll('app-pastille')].find((p) => texte(p) === longue)!;
    const [element, liste] = [pastille.parentElement!, pastille.parentElement!.parentElement!];
    const style = (cible: Element, nom: string) => getComputedStyle(cible).getPropertyValue(nom);
    expect(['display', 'flex-wrap', 'overflow-wrap'].map((nom) => style(liste, nom))).toEqual([
      'flex',
      'wrap',
      'anywhere',
    ]);
    expect(style(element, 'min-width')).toMatch(/^0(px)?$/);
    expect(style(pastille, 'max-width')).toBe('100%');
    expect(style(liste.parentElement!, 'grid-template-columns')).toBe(
      'repeat(2, minmax(0px, 1fr))',
    );
  });

  it('n’anime rien : aucune classe ni directive du mouvement', () => {
    const racine = section();
    const animes = [racine, ...racine.querySelectorAll('*')].filter(
      (e) =>
        [...e.classList].some((classe) => classe.startsWith('mv-')) ||
        [...e.attributes].some(({ name }) => /^(appmv|data-mv)/i.test(name)),
    );
    expect(animes).toEqual([]);
  });
});
