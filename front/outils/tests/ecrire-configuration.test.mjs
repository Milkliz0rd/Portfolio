// Adresses par environnement (PF-07) : déduction de l'environnement, adresses versionnées en
// production, variable de préproduction facultative, origines HTTPS exigées, fichier généré dans
// la forme de Prettier.
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ORIGINE_LOCALE_TEST,
  deduireEnvironnement,
  ecrireConfiguration,
  lireConfiguration,
  texteConfiguration,
} from '../ecrire-configuration.mjs';

const front = join(import.meta.dirname, '..', '..');
const adresses = JSON.parse(
  readFileSync(join(front, 'src', 'configuration', 'adresses-publiques.json'), 'utf8'),
);
let racine;
const configuration = (variables, pourLesTests) =>
  lireConfiguration(racine, variables, pourLesTests);
const preproduction = (valeur) =>
  configuration({
    PORTFOLIO_ENVIRONNEMENT: 'preproduction',
    PORTFOLIO_BASE_API_PREPRODUCTION: valeur,
  });

beforeEach(() => {
  racine = mkdtempSync(join(tmpdir(), 'configuration-'));
  mkdirSync(join(racine, 'src', 'configuration'), { recursive: true });
  cpSync(
    join(front, 'src', 'configuration', 'adresses-publiques.json'),
    join(racine, 'src', 'configuration', 'adresses-publiques.json'),
  );
});
afterEach(() => rmSync(racine, { recursive: true, force: true }));

describe('ecrire-configuration', () => {
  it('déduit l’environnement : la variable, puis la branche de l’hébergeur, puis la CI', () => {
    const hebergeur = { CI: 'true', WORKERS_CI: '1' };
    expect(deduireEnvironnement({ ...hebergeur, WORKERS_CI_BRANCH: 'main' })).toBe('production');
    expect(deduireEnvironnement({ ...hebergeur, WORKERS_CI_BRANCH: 'staging' })).toBe(
      'preproduction',
    );
    const choisi = { PORTFOLIO_ENVIRONNEMENT: 'test', WORKERS_CI_BRANCH: 'main' };
    expect(deduireEnvironnement(choisi)).toBe('test');
    expect(deduireEnvironnement({ CI: 'true' })).toBe('test');
    expect(deduireEnvironnement({}, true)).toBe('test');
    expect(deduireEnvironnement({})).toBe('developpement');
    expect(() => deduireEnvironnement({ PORTFOLIO_ENVIRONNEMENT: 'prod' })).toThrow(/inconnu/);
  });

  it('prend les adresses versionnées en production', () => {
    expect(configuration({ WORKERS_CI_BRANCH: 'main' })).toEqual({
      environnement: 'production',
      baseApi: 'https://api.alexandre-morozoff-dev.fr',
      origineSite: 'https://www.alexandre-morozoff-dev.fr',
      avertissements: [],
    });
  });

  it('construit la préproduction sans variable, avec un avertissement et baseApi vide', () => {
    const { baseApi, origineSite, avertissements } = preproduction(undefined);
    expect(baseApi).toBe('');
    expect(origineSite).toBe(adresses.origineSite);
    expect(avertissements).toEqual([expect.stringContaining('PORTFOLIO_BASE_API_PREPRODUCTION')]);
    expect(preproduction('https://back.example').baseApi).toBe('https://back.example');
  });

  it('refuse en préproduction et en production une valeur qui n’est pas une origine HTTPS', () => {
    for (const valeur of [
      'http://back.example',
      'https://back.example/',
      'https://back.example/api',
      'https://back.example:8443',
      'https://Back.example',
      'back.example',
    ]) {
      expect(() => preproduction(valeur)).toThrow(/origine HTTPS/);
    }
    const chemin = join(racine, 'src', 'configuration', 'adresses-publiques.json');
    writeFileSync(chemin, JSON.stringify({ ...adresses, baseApiProduction: 'http://api.example' }));
    expect(() => configuration({ PORTFOLIO_ENVIRONNEMENT: 'production' })).toThrow(/HTTPS/);
  });

  it('sert le site et le back simulé sur l’origine du serveur local en test', () => {
    const { baseApi, origineSite } = configuration({ CI: 'true' });
    expect([baseApi, origineSite]).toEqual([ORIGINE_LOCALE_TEST, ORIGINE_LOCALE_TEST]);
  });

  it('lit la base du back local dans .env.local en développement, la variable l’emportant', () => {
    expect(configuration({}).baseApi).toBe('');
    writeFileSync(join(racine, '.env.local'), 'PORTFOLIO_BASE_API=http://localhost:8080\n');
    expect(configuration({}).baseApi).toBe('http://localhost:8080');
    expect(configuration({ PORTFOLIO_BASE_API: 'http://localhost:9090' }).baseApi).toBe(
      'http://localhost:9090',
    );
  });

  it('écrit un fichier que Prettier accepte tel quel', async () => {
    const { fichier } = ecrireConfiguration(racine, { PORTFOLIO_ENVIRONNEMENT: 'production' });
    const texte = readFileSync(fichier, 'utf8');
    expect(texte).toContain("export const baseApi = 'https://api.alexandre-morozoff-dev.fr'");
    const options = { ...(await resolveConfig(join(front, 'x.ts'))), parser: 'typescript' };
    expect(await format(texte, options)).toBe(texte);
    const vide = texteConfiguration({
      environnement: 'preproduction',
      baseApi: '',
      origineSite: '',
    });
    expect(await format(vide, options)).toBe(vide);
  });
});
