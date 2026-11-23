import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MouvementService } from './services/mouvement/mouvement';
import { NavigationService } from './services/navigation/navigation';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
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
});
