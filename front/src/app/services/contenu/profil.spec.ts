import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { langueContenu } from '../../../contenu/contenu-langue';
import profilFr from '../../../contenu/fr/profil.json';
import { LectureProfil } from './profil';

describe('LectureProfil', () => {
  it('lit le profil de la langue du build, celle de LOCALE_ID', () => {
    expect(langueContenu).toBe(TestBed.inject(LOCALE_ID));
    expect(TestBed.inject(LectureProfil).profil).toEqual(profilFr);
  });
});
