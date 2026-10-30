import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Icone } from '../icone/icone';
import { MessageEtat, VarianteMessageEtat } from './message-etat';

const ANNONCES: [VarianteMessageEtat, string][] = [
  ['information', 'status'],
  ['envoi', 'status'],
  ['succes', 'status'],
  ['echec', 'alert'],
  ['attention', 'status'],
];

@Component({
  imports: [MessageEtat],
  template: `
    <app-message-etat [variante]="variante()" [titre]="titre()">
      {{ texte() }}
      @if (texte().trim()) {
        <a href="/contact">Écrire un message</a>
      }
      <button type="button">Réessayer</button>
    </app-message-etat>
  `,
})
class Hote {
  readonly variante = signal<VarianteMessageEtat>('information');
  readonly titre = signal('Le titre');
  readonly texte = signal('');
}

function rendre(variante: VarianteMessageEtat = 'information', titre = 'Le titre', texte = '…') {
  const fixture = TestBed.createComponent(Hote);
  fixture.componentInstance.variante.set(variante);
  fixture.componentInstance.titre.set(titre);
  fixture.componentInstance.texte.set(texte);
  fixture.detectChanges();
  const message = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
    'app-message-etat',
  )!;
  return { fixture, message };
}

const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
const variantesPortees = (message: HTMLElement) =>
  [...message.classList].filter((classe) => classe.startsWith('message-etat--'));

describe('MessageEtat', () => {
  it.each(ANNONCES)('annonce la variante « %s » par role="%s"', (variante, role) => {
    const { message } = rendre(variante);
    expect(variantesPortees(message)).toEqual([`message-etat--${variante}`]);
    expect(message.getAttribute('role')).toBe(role);
  });

  it.each([
    ['information', 'info'],
    ['succes', 'valide'],
    ['echec', 'erreur'],
    ['attention', 'attention'],
  ] as const)('pose l’icône décorative de la variante « %s » (%s)', (variante, nom) => {
    const { fixture, message } = rendre(variante);
    expect(
      fixture.debugElement
        .query((e) => e.name === 'app-icone')
        .injector.get(Icone)
        .nom(),
    ).toBe(nom);
    expect(message.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(message.querySelector('app-indicateur-activite')).toBeNull();
  });

  it('pose l’indicateur d’activité, décoratif, pour l’envoi en cours', () => {
    const { message } = rendre('envoi');
    expect(message.firstElementChild?.localName).toBe('app-indicateur-activite');
    expect(message.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(message.querySelector('app-icone')).toBeNull();
  });

  it('dit le titre, puis le texte projeté, le lien restant dans le texte', () => {
    const { message } = rendre('attention', 'Le titre', 'Le texte du message.');
    expect(texte(message.querySelector('.message-etat__titre'))).toBe('Le titre');
    const corps = message.querySelector('.message-etat__texte');
    expect(texte(corps)).toBe('Le texte du message. Écrire un message');
    expect(corps?.querySelector('a')?.getAttribute('href')).toBe('/contact');
  });

  it('place le bouton projeté en action, sous le texte', () => {
    const { message } = rendre('echec');
    const action = message.lastElementChild;
    expect(action?.classList).toContain('message-etat__action');
    expect(texte(action?.querySelector('button'))).toBe('Réessayer');
    expect(message.querySelector('.message-etat__texte button')).toBeNull();
  });

  it('ne disparaît pas de lui-même', () => {
    vi.useFakeTimers();
    try {
      const { fixture, message } = rendre('succes');
      vi.advanceTimersByTime(10 * 60 * 1000);
      fixture.detectChanges();
      expect(message.isConnected).toBe(true);
      expect(texte(message.querySelector('.message-etat__titre'))).toBe('Le titre');
      expect(message.hasAttribute('hidden')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('refuse un message sans titre', () => {
    expect(() => rendre('echec', ' ')).toThrow(/titre et un texte/);
  });

  it('refuse un message sans texte, le bouton projeté ne comptant pas', () => {
    expect(() => rendre('echec', 'Le titre', ' ')).toThrow(/titre et un texte/);
  });
});
