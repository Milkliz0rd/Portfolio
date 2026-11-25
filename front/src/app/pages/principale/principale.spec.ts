import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LectureProfil } from '../../services/contenu/profil';
import { NavigationService } from '../../services/navigation/navigation';
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
// Les sections de la page : ses enfants directs, hors des régions de l'accueil.
const sections = (page: HTMLElement) => [...page.querySelectorAll(':scope > section')];

describe('Principale', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));
  afterEach(() => vi.restoreAllMocks());

  it('ouvre sur l’accueil, puis enchaîne les cinq sections dans l’ordre, chacune à son ancre', async () => {
    const page = await rendre();
    expect(page.firstElementChild?.localName).toBe('app-accueil');
    expect(sections(page).map(({ id }) => id)).toEqual(SECTIONS.map(([ancre]) => ancre));
  });

  it('porte un seul titre de niveau 1, le nom, dans l’accueil, avant les sections', async () => {
    const page = await rendre();
    const titres = page.querySelectorAll('h1');
    expect(titres).toHaveLength(1);
    expect(texte(titres[0])).toBe(TestBed.inject(LectureProfil).profil.nom);
    expect(titres[0].closest('app-accueil')).not.toBeNull();
    const premiere = sections(page)[0];
    expect(titres[0].compareDocumentPosition(premiere) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('nomme chaque section par son titre de niveau 2', async () => {
    const page = await rendre();
    const noms = sections(page).map((section) => {
      const titre = page.querySelector(`[id="${section.getAttribute('aria-labelledby')}"]`);
      return [section.id, titre?.tagName, section.contains(titre), texte(titre)];
    });
    expect(noms).toEqual(SECTIONS.map(([ancre, nom]) => [ancre, 'H2', true, nom]));
  });

  it('inscrit ses cinq sections, sans les régions de l’accueil, après le premier rendu, et les retire quand on la quitte', async () => {
    const retirer = vi.fn();
    const inscrire = vi.spyOn(TestBed.inject(NavigationService), 'inscrire');
    inscrire.mockReturnValue(retirer);
    const fixture = TestBed.createComponent(Principale);
    expect(inscrire).not.toHaveBeenCalled();
    await fixture.whenStable();
    expect(inscrire).toHaveBeenCalledOnce();
    expect(inscrire.mock.calls[0][0].map(({ id }) => id)).toEqual(SECTIONS.map(([ancre]) => ancre));
    fixture.destroy();
    expect(retirer).toHaveBeenCalledOnce();
  });
});
