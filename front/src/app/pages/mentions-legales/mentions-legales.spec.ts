import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { mentionsLegalesDuBanc } from '../../../configuration/configuration.genere';
import type { TextesLegaux } from '../../interfaces/contenu';
import { FICHIER_TEXTES_LEGAUX } from '../../services/contenu/textes-legaux';
import { textesLegauxDeTest } from '../../testing/contenus-de-test';
import { MentionsLegales, segmentDeLaListe } from './mentions-legales';

const texte = (element: Element) => element.textContent?.replace(/\s+/g, ' ').trim();

/** Des textes de test : un lien du site, une ancre, une adresse HTTPS et un emplacement étiqueté. */
const TEXTES: TextesLegaux = {
  ...textesLegauxDeTest,
  mentionsLegales: [
    { intitule: 'Éditeur', paragraphes: [[{ texte: 'Alexandre Morozoff' }]] },
    ...textesLegauxDeTest.mentionsLegales,
    {
      intitule: 'Hébergement',
      paragraphes: [
        [{ texte: 'Hébergeur', lien: 'https://example.org/' }, { texte: '. [C-99 — adresse]' }],
        [{ texte: 'Les projets', lien: '/#projets' }],
      ],
    },
  ],
};

function rendre(textes?: TextesLegaux): HTMLElement {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      provideLocationMocks(),
      ...(textes ? [{ provide: FICHIER_TEXTES_LEGAUX, useValue: textes }] : []),
    ],
  });
  const fixture = TestBed.createComponent(MentionsLegales);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('MentionsLegales', () => {
  it('porte le seul titre de niveau 1, « Mentions légales », sous une étiquette sans numéro', () => {
    const page = rendre(TEXTES);
    expect([...page.querySelectorAll('h1')].map(texte)).toEqual(['Mentions légales']);
    expect(page.querySelector('app-etiquette.etiquette--accent')?.textContent).toBe(
      'Informations légales',
    );
    expect(page.querySelector('.etiquette--numerotee')).toBeNull();
  });

  it('donne une paire par bloc des textes légaux, dans leur ordre, puis le contenu de test du build', () => {
    const liste = rendre(TEXTES).querySelector('app-liste-cle-valeur')!;
    expect(liste.classList).toContain('liste-cle-valeur--tableau');
    expect([...liste.querySelectorAll('dt')].map(texte)).toEqual([
      'Éditeur',
      'Contact',
      'Hébergement',
      ...mentionsLegalesDuBanc.map(({ intitule }) => intitule),
    ]);
    // Les textes tels quels, emplacement étiqueté compris, un paragraphe par paragraphe du bloc.
    const hebergement = liste.querySelectorAll('dd')[2];
    expect([...hebergement.querySelectorAll('p')].map(texte)).toEqual([
      'Hébergeur (nouvel onglet). [C-99 — adresse]',
      'Les projets',
    ]);
  });

  it('fait d’une adresse du site un lien du routeur, avec son ancre, et d’une adresse HTTPS un lien externe', () => {
    const liens = [...rendre(TEXTES).querySelectorAll('dd a')].slice(0, 3);
    expect(liens.map((lien) => [lien.getAttribute('href'), lien.getAttribute('target')])).toEqual([
      ['/contact', null],
      ['https://example.org/', '_blank'],
      ['/#projets', null],
    ]);
  });

  it('lit textes-legaux.json : l’éditeur, le contact par le formulaire et les hébergeurs, sans adresse ni téléphone', () => {
    const page = rendre();
    const dd = (cle: string) =>
      [...page.querySelectorAll('.liste-cle-valeur__paire')]
        .find((paire) => texte(paire.querySelector('dt')!) === cle)
        ?.querySelector('dd');
    expect(texte(dd('Éditeur')!)).toBe('Alexandre Morozoff');
    expect(dd('Contact')?.querySelector('a')?.getAttribute('href')).toBe('/contact');
    expect(texte(dd('Hébergement des pages')!)).toContain('Cloudflare');
    expect(texte(dd('Hébergement du formulaire')!)).toContain('Render');
    const tout = texte(page) ?? '';
    expect(tout).not.toMatch(/\d{2}[\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2}/);
    expect(tout).not.toMatch(/@|\b(rue|avenue|boulevard|chemin|impasse|allée)\b/i);
  });
});

describe('segmentDeLaListe', () => {
  it.each([
    [{ texte: 'Seul' }, { texte: 'Seul' }],
    [
      { texte: 'Contact', lien: '/contact' },
      { texte: 'Contact', lien: '/contact' },
    ],
    [
      { texte: 'Inconnue', lien: '/#competence' },
      { texte: 'Inconnue', lien: '/', fragment: 'competence' },
    ],
    [
      { texte: 'Code', lien: 'https://example.org/code' },
      { texte: 'Code', lien: 'https://example.org/code', externe: true },
    ],
  ])('rend %o en %o', (segment, attendu) => {
    expect(segmentDeLaListe(segment)).toEqual(attendu);
  });
});
