import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MouvementService } from './services/mouvement/mouvement';

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

  it('démarre le mouvement après le premier rendu, et pas avant', async () => {
    const demarrer = vi.spyOn(TestBed.inject(MouvementService), 'demarrer');
    const fixture = TestBed.createComponent(App);
    expect(demarrer).not.toHaveBeenCalled();
    await fixture.whenStable();
    expect(demarrer).toHaveBeenCalledOnce();
  });
});
