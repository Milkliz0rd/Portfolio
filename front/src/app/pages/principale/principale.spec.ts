import { TestBed } from '@angular/core/testing';
import { Principale } from './principale';

// L'ancre de chaque section, dans l'ordre du plan du site, et le nom que lui donne son titre.
const SECTIONS = [
  ['parcours', 'EC-02 Parcours'],
  ['competences', 'EC-03 Compétences'],
  ['experience', 'EC-04 Expérience'],
  ['methode', 'EC-05 Méthode de travail'],
  ['projets', 'EC-06 Liste des projets'],
];

async function rendre(): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(Principale);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

const texte = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();

describe('Principale', () => {
  it('enchaîne les cinq sections dans l’ordre du plan du site, chacune à son ancre', async () => {
    const sections = (await rendre()).querySelectorAll('section');
    expect([...sections].map(({ id }) => id)).toEqual(SECTIONS.map(([ancre]) => ancre));
  });

  it('porte un seul titre de niveau 1, celui de l’accueil, avant les sections', async () => {
    const page = await rendre();
    const titres = page.querySelectorAll('h1');
    expect(titres).toHaveLength(1);
    expect(texte(titres[0])).toBe('EC-01 Accueil');
    expect(titres[0].closest('section')).toBeNull();
    const premiere = page.querySelector('section')!;
    expect(titres[0].compareDocumentPosition(premiere) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('nomme chaque section par son titre de niveau 2', async () => {
    const page = await rendre();
    const noms = [...page.querySelectorAll('section')].map((section) => {
      const titre = page.querySelector(`[id="${section.getAttribute('aria-labelledby')}"]`);
      return [section.id, titre?.tagName, section.contains(titre), texte(titre)];
    });
    expect(noms).toEqual(SECTIONS.map(([ancre, nom]) => [ancre, 'H2', true, nom]));
  });
});
