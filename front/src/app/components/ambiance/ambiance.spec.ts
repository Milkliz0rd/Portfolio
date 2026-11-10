import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Ambiance, VarianteAmbiance } from './ambiance';

@Component({
  imports: [Ambiance],
  template: `
    <app-ambiance [variante]="variante()">
      <h2>Le titre de la section</h2>
      <p>Le texte de la section.</p>
    </app-ambiance>
  `,
})
class Hote {
  readonly variante = signal<VarianteAmbiance>('accueil');
}

function monter(variante: VarianteAmbiance) {
  const fixture = TestBed.createComponent(Hote);
  fixture.componentInstance.variante.set(variante);
  fixture.detectChanges();
  const ambiance = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
    'app-ambiance',
  )!;
  return { fixture, ambiance };
}

const calques = (ambiance: HTMLElement) => [...ambiance.querySelectorAll('.ambiance__calque')];
// Chaque calque par son rôle : trame, halo--accent, halo--secondaire ou voile.
const roles = (ambiance: HTMLElement) =>
  calques(ambiance).map((calque) =>
    [...calque.classList]
      .filter((classe) => classe !== 'ambiance__calque' && classe !== 'ambiance__halo')
      .map((classe) => classe.replace('ambiance__', ''))
      .join(' '),
  );

const ATTENDUS: Record<VarianteAmbiance, string[]> = {
  accueil: ['trame', 'halo--secondaire', 'halo--accent', 'voile'],
  section: ['trame', 'halo--accent', 'voile'],
  sobre: ['trame', 'voile'],
};

describe('Ambiance', () => {
  it.each(['accueil', 'section', 'sobre'] as const)(
    'porte la seule classe de la variante « %s »',
    (variante) => {
      const { ambiance } = monter(variante);
      expect(ambiance.classList).toContain('ambiance');
      expect([...ambiance.classList].filter((classe) => classe.startsWith('ambiance--'))).toEqual([
        `ambiance--${variante}`,
      ]);
    },
  );

  it.each(['accueil', 'section', 'sobre'] as const)(
    'rend un calque par jeton de la variante « %s », du fond vers le contenu',
    (variante) => {
      expect(roles(monter(variante).ambiance)).toEqual(ATTENDUS[variante]);
    },
  );

  it('pose deux halos en coins opposés sur l’accueil, un seul sur la section, aucun en sobre', () => {
    const halos = (variante: VarianteAmbiance) =>
      calques(monter(variante).ambiance).filter((calque) =>
        calque.classList.contains('ambiance__halo'),
      ).length;
    expect([halos('accueil'), halos('section'), halos('sobre')]).toEqual([2, 1, 0]);
  });

  it('rend des calques décoratifs et vides, avant le contenu projeté', () => {
    const { ambiance } = monter('accueil');
    const tous = calques(ambiance);
    for (const calque of tous) {
      expect(calque.localName).toBe('div');
      expect(calque.getAttribute('aria-hidden')).toBe('true');
      expect(calque.childNodes).toHaveLength(0);
    }
    expect([...ambiance.children].slice(0, tous.length)).toEqual(tous);
    expect([...ambiance.children].slice(tous.length).map((enfant) => enfant.localName)).toEqual([
      'h2',
      'p',
    ]);
  });

  it('laisse le contenu lisible, sans rien rendre de focalisable', () => {
    const { ambiance } = monter('section');
    expect(ambiance.querySelector('h2')?.closest('[aria-hidden]')).toBeNull();
    expect(ambiance.querySelector('a, button, input, [tabindex]')).toBeNull();
    expect(ambiance.hasAttribute('role')).toBe(false);
  });

  it('suit le changement de variante', () => {
    const { fixture, ambiance } = monter('sobre');
    expect(roles(ambiance)).toEqual(ATTENDUS.sobre);
    fixture.componentInstance.variante.set('accueil');
    fixture.detectChanges();
    expect(roles(ambiance)).toEqual(ATTENDUS.accueil);
  });
});
