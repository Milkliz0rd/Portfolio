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
    <a appBouton href="/cv">Voir le CV</a>
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
    expect(lien.getAttribute('href')).toBe('/cv');
    expect(variantesPortees(lien)).toEqual(['bouton--primaire']);
    expect(lien.hasAttribute('type')).toBe(false);
    expect(lien.hasAttribute('role')).toBe(false);
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
