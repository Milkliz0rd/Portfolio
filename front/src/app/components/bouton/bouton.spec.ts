import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Icone } from '../icone/icone';
import { Bouton, VarianteBouton } from './bouton';

const VARIANTES: VarianteBouton[] = ['primaire', 'secondaire', 'discret', 'icone'];

@Component({
  imports: [Bouton, Icone],
  template: `
    <button appBouton [variante]="variante()" [compact]="compact()" libelle="Ouvrir le menu">
      <app-icone nom="menu" />
    </button>
    <button appBouton type="submit">Envoyer</button>
    <button appBouton variante="secondaire" disabled>Télécharger</button>
    <a appBouton href="/contact">Écrire un message</a>
  `,
})
class Hote {
  readonly variante = signal<VarianteBouton>('primaire');
  readonly compact = signal(false);
}

@Component({
  imports: [Bouton, Icone],
  template: `<button appBouton variante="icone"><app-icone nom="menu" /></button>`,
})
class IconeSansLibelle {}

@Component({
  imports: [Bouton, Icone],
  template: `
    <form (submit)="envois = envois + 1; $event.preventDefault()">
      <button appBouton type="submit" [enCours]="enCours()" (click)="clics = clics + 1">
        Envoyer <app-icone nom="fleche" />
      </button>
    </form>
  `,
})
class Envoi {
  readonly enCours = signal(true);
  envois = 0;
  clics = 0;
}

/** Le bouton-lien externe, posé avec href, comme « Voir le code source » sur une fiche. */
@Component({
  imports: [Bouton],
  template: `
    <a appBouton [externe]="externe()" href="https://example.org/code">
      <span>Voir le code source</span>
    </a>
    <a appBouton variante="secondaire" externe href="https://example.org/code">Code</a>
  `,
})
class Externe {
  readonly externe = signal(true);
}

@Component({
  imports: [Bouton],
  template: `<button appBouton externe>Envoyer</button>`,
})
class ButtonExterne {}

function rendreEnvoi() {
  const fixture = TestBed.createComponent(Envoi);
  fixture.detectChanges();
  const bouton = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('button')!;
  return { fixture, hote: fixture.componentInstance, bouton };
}

function rendre() {
  const fixture = TestBed.createComponent(Hote);
  fixture.detectChanges();
  const [bouton, envoi, desactive, lien] = [
    ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('[appBouton]'),
  ];
  return { fixture, bouton, envoi, desactive, lien };
}

const variantesPortees = (element: HTMLElement) =>
  [...element.classList].filter((classe) => /^bouton--(?!compact)/.test(classe));
const texte = (element: HTMLElement) => element.textContent?.replace(/\s+/g, ' ').trim();

function rendreExterne() {
  const fixture = TestBed.createComponent(Externe);
  fixture.detectChanges();
  const liens = [...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('a')];
  return { fixture, liens };
}

describe('Bouton', () => {
  it('reste un button natif, primaire par défaut, de type « button »', () => {
    const { bouton } = rendre();
    expect(bouton.localName).toBe('button');
    expect(bouton.classList).toContain('bouton');
    expect(variantesPortees(bouton)).toEqual(['bouton--primaire']);
    expect(bouton.getAttribute('type')).toBe('button');
  });

  it.each(VARIANTES)('porte la seule classe de la variante « %s »', (variante) => {
    const { fixture, bouton } = rendre();
    fixture.componentInstance.variante.set(variante);
    fixture.detectChanges();
    expect(variantesPortees(bouton)).toEqual([`bouton--${variante}`]);
  });

  it('se resserre en compact, quelle que soit la variante', () => {
    const { fixture, bouton } = rendre();
    expect(bouton.classList).not.toContain('bouton--compact');
    fixture.componentInstance.variante.set('secondaire');
    fixture.componentInstance.compact.set(true);
    fixture.detectChanges();
    expect(bouton.classList).toContain('bouton--compact');
    expect(variantesPortees(bouton)).toEqual(['bouton--secondaire']);
  });

  it('garde le type écrit sur l’élément', () => {
    expect(rendre().envoi.getAttribute('type')).toBe('submit');
  });

  it('se désactive par l’attribut natif', () => {
    const { desactive } = rendre();
    expect((desactive as HTMLButtonElement).disabled).toBe(true);
    expect(variantesPortees(desactive)).toEqual(['bouton--secondaire']);
  });

  it('pose l’aspect du bouton sur un lien, sans type ni rôle ajouté', () => {
    const { lien } = rendre();
    expect(lien.localName).toBe('a');
    expect(lien.getAttribute('href')).toBe('/contact');
    expect(variantesPortees(lien)).toEqual(['bouton--primaire']);
    expect(lien.hasAttribute('type')).toBe(false);
    expect(lien.hasAttribute('role')).toBe(false);
  });

  it('ouvre un lien sans externe dans l’onglet courant, sans icône ni texte ajouté', () => {
    const { lien } = rendre();
    expect(['target', 'rel'].map((nom) => lien.hasAttribute(nom))).toEqual([false, false]);
    expect(lien.querySelector('svg, .masque-visuellement')).toBeNull();
    expect(texte(lien)).toBe('Écrire un message');
  });

  it('ouvre un lien externe dans un nouvel onglet, sans lien vers la page d’origine, dans sa variante', () => {
    const { liens } = rendreExterne();
    for (const [lien, variante] of [
      [liens[0], 'bouton--primaire'],
      [liens[1], 'bouton--secondaire'],
    ] as const) {
      expect(lien.getAttribute('href')).toBe('https://example.org/code');
      expect(lien.getAttribute('target')).toBe('_blank');
      expect(lien.getAttribute('rel')?.split(' ').sort()).toEqual(['noopener', 'noreferrer']);
      expect(variantesPortees(lien)).toEqual([variante]);
      expect(['type', 'role'].map((nom) => lien.hasAttribute(nom))).toEqual([false, false]);
    }
  });

  it('annonce le lien externe par la flèche oblique après le texte, décorative, et un texte masqué', () => {
    const [lien] = rendreExterne().liens;
    const contenu = lien.querySelector('.bouton__contenu')!;
    const [libelle, icone, masque] = [...contenu.children];
    expect(libelle.textContent).toBe('Voir le code source');
    expect(icone.localName).toBe('app-icone');
    const svg = icone.querySelector('svg')!;
    expect(svg.querySelector('path')?.getAttribute('d')).toBe('M9 5h10v10M19 5 6 18');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(masque.classList).toContain('masque-visuellement');
    // Le nom accessible : le texte, puis l'annonce ; la flèche, aria-hidden, n'en fait pas partie.
    expect(texte(lien)).toBe('Voir le code source (nouvel onglet)');
  });

  it('retire le nouvel onglet, la flèche et le texte masqué quand externe repasse à faux', () => {
    const { fixture, liens } = rendreExterne();
    fixture.componentInstance.externe.set(false);
    fixture.detectChanges();
    expect(['target', 'rel'].map((nom) => liens[0].hasAttribute(nom))).toEqual([false, false]);
    expect(liens[0].querySelector('svg, .masque-visuellement')).toBeNull();
    expect(texte(liens[0])).toBe('Voir le code source');
  });

  it('refuse un button externe : seul un lien s’ouvre dans un nouvel onglet', () => {
    const fixture = TestBed.createComponent(ButtonExterne);
    expect(() => fixture.detectChanges()).toThrow(/nouvel onglet/);
  });

  it('nomme l’icône seule par son libellé masqué, l’icône restant décorative', () => {
    const { fixture, bouton } = rendre();
    fixture.componentInstance.variante.set('icone');
    fixture.detectChanges();
    const masque = bouton.querySelector('.masque-visuellement');
    expect(masque?.textContent).toBe('Ouvrir le menu');
    expect(bouton.textContent?.trim()).toBe('Ouvrir le menu');
    expect(bouton.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('refuse une icône seule sans libellé masqué', () => {
    const fixture = TestBed.createComponent(IconeSansLibelle);
    expect(() => fixture.detectChanges()).toThrow(/libellé masqué/);
  });

  it('montre en cours l’indicateur et « Envoi en cours… », sans perdre l’aspect primaire', () => {
    const { bouton } = rendreEnvoi();
    expect(variantesPortees(bouton)).toEqual(['bouton--primaire', 'bouton--en-cours']);
    // Le contenu de la page reste dans le bouton, masqué par la classe bouton--en-cours.
    const [contenu, indicateur, libelle] = [...bouton.children];
    expect(contenu.classList).toContain('bouton__contenu');
    expect(indicateur.localName).toBe('app-indicateur-activite');
    expect(indicateur.classList).toContain('indicateur-activite--bouton');
    expect(indicateur.getAttribute('aria-hidden')).toBe('true');
    expect(libelle.textContent).toBe('Envoi en cours…');
  });

  it('bloque un nouvel envoi sans l’attribut disabled : clic et envoi sans effet', () => {
    const { hote, bouton } = rendreEnvoi();
    expect(bouton.disabled).toBe(false);
    expect(bouton.getAttribute('aria-disabled')).toBe('true');
    const clic = new MouseEvent('click', { bubbles: true, cancelable: true });
    bouton.dispatchEvent(clic);
    expect(clic.defaultPrevented).toBe(true);
    expect([hote.clics, hote.envois]).toEqual([0, 0]);
  });

  it('retrouve son contenu et son envoi une fois l’envoi terminé', () => {
    const { fixture, hote, bouton } = rendreEnvoi();
    hote.enCours.set(false);
    fixture.detectChanges();
    expect(bouton.classList).not.toContain('bouton--en-cours');
    expect(bouton.hasAttribute('aria-disabled')).toBe(false);
    expect(bouton.querySelector('app-indicateur-activite')).toBeNull();
    expect(bouton.textContent?.trim()).toBe('Envoyer');
    bouton.click();
    expect([hote.clics, hote.envois]).toEqual([1, 1]);
  });
});
