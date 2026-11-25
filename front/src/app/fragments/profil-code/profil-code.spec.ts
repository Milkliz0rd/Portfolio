import type { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import experienceFr from '../../../contenu/fr/experience.json';
import profilFr from '../../../contenu/fr/profil.json';
import type { Profil } from '../../interfaces/contenu';
import { FICHIER_EXPERIENCE } from '../../services/contenu/experience';
import { FICHIER_PROFIL } from '../../services/contenu/profil';
import { experienceDeTest } from '../../testing/contenus-de-test';
import { ProfilCode } from './profil-code';

// Un contenu de test, pour voir que chaque valeur vient du contenu : des guillemets dans
// l'intitulé, que l'extrait échappe, et une autre période que celle du contenu réel.
const PROFIL: Profil = {
  nom: 'Nom de test',
  intitule: 'Intitulé avec des "guillemets"',
  liens: { github: 'https://example.org/github', linkedin: 'https://example.org/linkedin' },
};
const CONTENU_DE_TEST: Provider[] = [
  { provide: FICHIER_PROFIL, useValue: PROFIL },
  {
    provide: FICHIER_EXPERIENCE,
    useValue: { ...experienceDeTest, periode: { debut: 2031, fin: 2034 } },
  },
];

function rendre(providers: Provider[] = []): HTMLElement {
  TestBed.configureTestingModule({ providers });
  const fixture = TestBed.createComponent(ProfilCode);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

const lignes = (hote: HTMLElement) =>
  [...hote.querySelectorAll('.fenetre__ligne')].map((ligne) => ligne.textContent);
/** Les valeurs que la fenêtre affiche : ses chaînes, lues comme le langage les lit. */
const chaines = (hote: HTMLElement) =>
  [...hote.querySelectorAll('.fenetre__segment--chaine')].map(
    (segment) => JSON.parse(segment.textContent ?? '') as string,
  );

describe('ProfilCode', () => {
  it('écrit le nom, l’intitulé et l’alternance du contenu, sans bloc « liens »', () => {
    const hote = rendre(CONTENU_DE_TEST);
    expect(lignes(hote)).toEqual([
      'export const profil = {',
      '  nom: "Nom de test",',
      '  intitule: "Intitulé avec des \\"guillemets\\"",',
      '  alternance: {',
      '    entreprise: "Entreprise de test",',
      '    periode: "2031–2034",',
      '  },',
      '} as const;',
    ]);
    expect(hote.textContent).not.toMatch(/liens|github|linkedin|example\.org/);
  });

  it('ne dit rien d’autre que ce que donne le contenu de la langue du build', () => {
    const { debut, fin } = experienceFr.periode;
    expect(chaines(rendre())).toEqual([
      profilFr.nom,
      profilFr.intitule,
      experienceFr.entreprise,
      `${debut}–${fin}`,
    ]);
  });

  it('colore les mots-clés et les chaînes', () => {
    const hote = rendre(CONTENU_DE_TEST);
    const motsCles = [...hote.querySelectorAll('.fenetre__segment--mot-cle')];
    expect(motsCles.map((segment) => segment.textContent)).toEqual(['export const', 'as const']);
    expect(chaines(hote)).toHaveLength(4);
  });

  it('est un décor titré « profil.ts » : masqué aux lecteurs d’écran, sans élément focalisable', () => {
    const hote = rendre();
    const cadre = hote.querySelector('.fenetre__cadre');
    expect(cadre?.getAttribute('aria-hidden')).toBe('true');
    expect(cadre?.hasAttribute('aria-labelledby')).toBe(false);
    expect(hote.querySelector('.masque-visuellement')).toBeNull();
    expect(
      hote.querySelectorAll('a[href], button, input, select, textarea, [tabindex]'),
    ).toHaveLength(0);
    expect(hote.querySelector('.fenetre__titre')?.textContent?.trim()).toBe('profil.ts');
  });
});
