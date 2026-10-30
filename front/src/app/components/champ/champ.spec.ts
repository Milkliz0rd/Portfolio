import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { disabled, email, form, required, validate } from '@angular/forms/signals';
import { Champ, TypeChamp } from './champ';

@Component({
  imports: [Champ],
  template: `
    <app-champ
      [champ]="formulaire.valeur"
      libelle="Sujet"
      [type]="type()"
      [aide]="aide()"
      [envoiTente]="tentative()"
    />
    <app-champ
      [champ]="formulaire.libre"
      libelle="Libre"
      autocomplete="family-name"
      [envoiTente]="tentative()"
    />
  `,
})
class Hote {
  readonly type = signal<TypeChamp>('texte');
  readonly aide = signal<string | undefined>(undefined);
  readonly envoi = signal(false);
  readonly tentative = signal(false);
  readonly modele = signal({ valeur: '', libre: '' });
  readonly formulaire = form(this.modele, (chemin) => {
    required(chemin.valeur);
    email(chemin.valeur);
    disabled(chemin.valeur, () => this.envoi());
    validate(chemin.libre, ({ value }) =>
      value() === 'propre'
        ? { kind: 'propre', message: 'Un message propre.' }
        : value() === 'muette'
          ? { kind: 'muette' }
          : undefined,
    );
  });
}

@Component({
  imports: [Champ],
  template: `<app-champ [champ]="formulaire.nom" libelle=" " />`,
})
class SansLibelle {
  readonly formulaire = form(signal({ nom: '' }));
}

function rendre(type: TypeChamp = 'texte', aide?: string) {
  const fixture = TestBed.createComponent(Hote);
  const hote = fixture.componentInstance;
  hote.type.set(type);
  hote.aide.set(aide);
  fixture.detectChanges();
  const [champ, libre] = (fixture.nativeElement as HTMLElement).querySelectorAll('app-champ');
  const controle = () => champ.querySelector<HTMLInputElement>('input, textarea')!;
  const actualiser = () => fixture.detectChanges();
  return { fixture, hote, champ, libre, controle, actualiser };
}

const texte = (element: Element | null | undefined) =>
  element?.textContent?.replace(/\s+/g, ' ').trim();
const decrits = (controle: Element) =>
  (controle.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);

describe('Champ', () => {
  it('lie le libellé visible au contrôle, sans le remplacer par le texte indicatif', () => {
    const { champ, controle } = rendre();
    const libelle = champ.querySelector('label');
    expect(champ.firstElementChild).toBe(libelle);
    expect(texte(libelle)).toBe('Sujet');
    expect(libelle?.htmlFor).toBe(controle().id);
    expect([...controle().labels!]).toEqual([libelle]);
    expect(controle().hasAttribute('placeholder')).toBe(false);
  });

  it('donne à chaque champ son propre identifiant', () => {
    const [a, b] = [rendre().champ, rendre().libre].map((c) => c.querySelector('input')!.id);
    expect(a).toMatch(/^champ-\d+$/);
    expect(b).not.toBe(a);
  });

  it('pose une ligne de texte par défaut, avec l’autocomplete écrit par la page', () => {
    const { controle, libre } = rendre();
    expect([controle().localName, controle().type]).toEqual(['input', 'text']);
    expect(controle().hasAttribute('autocomplete')).toBe(false);
    expect(libre.querySelector('input')?.getAttribute('autocomplete')).toBe('family-name');
  });

  it('pose un champ e-mail au clavier adapté, avec son texte indicatif', () => {
    const { controle } = rendre('email');
    expect([controle().localName, controle().getAttribute('type')]).toEqual(['input', 'email']);
    expect(controle().getAttribute('autocomplete')).toBe('email');
    expect(controle().getAttribute('placeholder')).toBe('Votre adresse e-mail');
  });

  it('pose une zone de texte', () => {
    expect(rendre('zone').controle().localName).toBe('textarea');
  });

  it('marque required le champ obligatoire, et lui seul', () => {
    const { controle, libre } = rendre();
    expect(controle().required).toBe(true);
    expect(libre.querySelector('input')?.required).toBe(false);
  });

  it('suit la saisie dans les deux sens', () => {
    const { hote, controle, actualiser } = rendre();
    controle().value = 'Bonjour';
    controle().dispatchEvent(new Event('input'));
    expect(hote.modele().valeur).toBe('Bonjour');
    hote.modele.set({ valeur: 'Rempli', libre: '' });
    actualiser();
    expect(controle().value).toBe('Rempli');
  });

  it('n’affiche aucune erreur sans tentative d’envoi, même une fois le champ vide quitté', () => {
    const { hote, champ, controle, actualiser } = rendre();
    controle().focus();
    controle().blur();
    actualiser();
    expect(hote.formulaire.valeur().touched()).toBe(true);
    expect(hote.formulaire.valeur().invalid()).toBe(true);
    expect(controle().hasAttribute('aria-invalid')).toBe(false);
    expect(controle().hasAttribute('aria-describedby')).toBe(false);
    expect(champ.querySelector('.champ__erreur')).toBeNull();
  });

  it('montre « Ce champ est obligatoire. » après une tentative d’envoi, lié au champ invalide', () => {
    const { hote, champ, controle, actualiser } = rendre();
    hote.tentative.set(true);
    actualiser();
    const erreur = champ.querySelector('.champ__erreur')!;
    expect(texte(erreur)).toBe('Ce champ est obligatoire.');
    expect(controle().getAttribute('aria-invalid')).toBe('true');
    expect(decrits(controle())).toEqual([erreur.id]);
    expect(erreur.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('montre « L’adresse e-mail n’est pas valide. » après une tentative d’envoi', () => {
    const { hote, champ, controle, actualiser } = rendre('email');
    hote.modele.set({ valeur: 'pas-une-adresse', libre: '' });
    actualiser();
    expect(controle().hasAttribute('aria-invalid')).toBe(false);
    hote.tentative.set(true);
    actualiser();
    expect(texte(champ.querySelector(`#${decrits(controle())[0]}`))).toBe(
      'L’adresse e-mail n’est pas valide.',
    );
    expect(controle().getAttribute('aria-invalid')).toBe('true');
  });

  it('montre le message propre d’une autre erreur', () => {
    const { hote, libre, actualiser } = rendre();
    hote.modele.set({ valeur: '', libre: 'propre' });
    hote.tentative.set(true);
    actualiser();
    expect(texte(libre.querySelector('.champ__erreur'))).toBe('Un message propre.');
  });

  it('retire l’erreur et la marque invalide dès que le champ devient valide', () => {
    const { hote, champ, controle, actualiser } = rendre('email');
    hote.tentative.set(true);
    actualiser();
    expect(texte(champ.querySelector('.champ__erreur'))).toBe('Ce champ est obligatoire.');
    hote.modele.set({ valeur: 'nom@example.com', libre: '' });
    actualiser();
    expect(controle().hasAttribute('aria-invalid')).toBe(false);
    expect(controle().hasAttribute('aria-describedby')).toBe(false);
    expect(champ.querySelector('.champ__erreur')).toBeNull();
  });

  it('lie l’aide, puis l’erreur, par aria-describedby', () => {
    const { hote, champ, controle, actualiser } = rendre('texte', 'Pour vous répondre.');
    const aide = champ.querySelector('.champ__aide')!;
    expect(texte(aide)).toBe('Pour vous répondre.');
    expect(decrits(controle())).toEqual([aide.id]);
    hote.tentative.set(true);
    actualiser();
    expect(decrits(controle())).toEqual([aide.id, champ.querySelector('.champ__erreur')!.id]);
  });

  it('se désactive pendant l’envoi en gardant la saisie, sans erreur', () => {
    const { hote, champ, controle, actualiser } = rendre();
    hote.modele.set({ valeur: 'Saisie conservée', libre: '' });
    hote.envoi.set(true);
    hote.tentative.set(true);
    actualiser();
    expect(controle().disabled).toBe(true);
    expect(controle().value).toBe('Saisie conservée');
    expect(controle().hasAttribute('aria-invalid')).toBe(false);
    expect(champ.querySelector('.champ__erreur')).toBeNull();
    hote.envoi.set(false);
    actualiser();
    expect(texte(champ.querySelector('.champ__erreur'))).toBe('L’adresse e-mail n’est pas valide.');
  });

  it('refuse d’afficher une autre erreur sans message', () => {
    const { hote, actualiser } = rendre();
    hote.modele.set({ valeur: '', libre: 'muette' });
    hote.tentative.set(true);
    expect(actualiser).toThrow(/« muette » n'a pas de message/);
  });

  it('refuse un champ sans libellé', () => {
    const fixture = TestBed.createComponent(SansLibelle);
    expect(() => fixture.detectChanges()).toThrow(/libellé visible/);
  });
});
