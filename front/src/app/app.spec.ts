import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { MouvementService } from './services/mouvement/mouvement';
import { NavigationService } from './services/navigation/navigation';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should use French as the locale', () => {
    expect(TestBed.inject(LOCALE_ID)).toBe('fr');
  });

  it('démarre le mouvement et la navigation après le premier rendu, et pas avant', async () => {
    // En mode serveur, afterNextRender ne fait rien : le mode doit être celui du navigateur. S'il ne
    // l'est pas, un autre fichier de test l'a laissé posé (voir app.config.server.spec.ts).
    expect(
      (globalThis as { ngServerMode?: boolean }).ngServerMode,
      'mode serveur laissé par un autre fichier de test',
    ).toBeFalsy();
    const demarrer = vi.spyOn(TestBed.inject(MouvementService), 'demarrer');
    const navigation = vi.spyOn(TestBed.inject(NavigationService), 'demarrer');
    const fixture = TestBed.createComponent(App);
    expect([demarrer, navigation].map(({ mock }) => mock.calls.length)).toEqual([0, 0]);
    await fixture.whenStable();
    expect([demarrer, navigation].map(({ mock }) => mock.calls.length)).toEqual([1, 1]);
  });

  it('ouvre chaque page par le lien d’évitement, l’en-tête, le contenu principal, puis le pied', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    expect([...page.children].map(({ localName }) => localName)).toEqual([
      'app-lien-evitement',
      'app-entete',
      'main',
      'app-pied',
    ]);
    expect(page.querySelector('app-pied > footer')).not.toBeNull();
    const [premier] = page.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
    expect([premier.textContent?.trim(), premier.getAttribute('href')]).toEqual([
      'Aller au contenu',
      '#contenu',
    ]);
    const contenu = page.querySelector('main')!;
    expect(['id', 'tabindex', 'aria-label'].map((nom) => contenu.getAttribute(nom))).toEqual([
      'contenu',
      '-1',
      'Contenu principal',
    ]);
  });
});
