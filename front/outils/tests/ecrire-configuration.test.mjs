// Adresses par environnement (PF-07) : déduction de l'environnement, adresses versionnées en
// production, variable de préproduction facultative, origines HTTPS exigées, fichier généré dans
// la forme de Prettier.
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EMPLACEMENT } from '../controle-contenu/structure.mjs';
import { dimensionsWebp } from '../controle-contenu/webp.mjs';
import {
  ORIGINE_LOCALE_TEST,
  copierImagesDuBanc,
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
    const banc = texteConfiguration(configuration({ PORTFOLIO_ENVIRONNEMENT: 'test' }));
    expect(await format(banc, options)).toBe(banc);
  });

  it('n’importe le contenu de test des mentions légales que dans le build de test', () => {
    const importe = (environnement) =>
      texteConfiguration(configuration({ PORTFOLIO_ENVIRONNEMENT: environnement })).includes(
        "from '../../e2e/support/mentions-legales-du-banc.json'",
      );
    expect(['developpement', 'test', 'preproduction', 'production'].map(importe)).toEqual([
      false,
      true,
      false,
      false,
    ]);
    const production = texteConfiguration(configuration({ PORTFOLIO_ENVIRONNEMENT: 'production' }));
    expect(production).toContain('export const mentionsLegalesDuBanc: readonly BlocTexte[] = [];');
  });

  it('donne au build de test un contenu des mentions légales qui mène à une ancre qui ne nomme rien', () => {
    const banc = JSON.parse(
      readFileSync(join(front, 'e2e', 'support', 'mentions-legales-du-banc.json'), 'utf8'),
    );
    const liens = banc.flatMap(({ paragraphes }) => paragraphes.flat().map(({ lien }) => lien));
    expect(liens).toEqual(['/#competence']);
  });

  it('n’importe le contenu de test des compétences que dans le build de test', () => {
    const texte = (environnement) =>
      texteConfiguration(configuration({ PORTFOLIO_ENVIRONNEMENT: environnement }));
    const importe = (environnement) =>
      texte(environnement).includes("from '../../e2e/support/competences-du-banc.json'");
    expect(['developpement', 'test', 'preproduction', 'production'].map(importe)).toEqual([
      false,
      true,
      false,
      false,
    ]);
    expect(texte('production')).toContain(
      'export const competencesDuBanc: readonly CategorieCompetences[] = [];',
    );
  });

  it('donne au build de test une seule catégorie de compétences, sans compétence ni niveau', () => {
    const banc = JSON.parse(
      readFileSync(join(front, 'e2e', 'support', 'competences-du-banc.json'), 'utf8'),
    );
    expect(banc.map((categorie) => Object.keys(categorie).sort())).toEqual([
      ['competences', 'libelle', 'rang'],
    ]);
    expect(banc[0].competences).toEqual([]);
  });

  it('n’importe le contenu de test des fiches que dans le build de test', () => {
    const texte = (environnement) =>
      texteConfiguration(configuration({ PORTFOLIO_ENVIRONNEMENT: environnement }));
    const importe = (environnement) =>
      texte(environnement).includes("from '../../e2e/support/projets-du-banc.json'");
    expect(['developpement', 'test', 'preproduction', 'production'].map(importe)).toEqual([
      false,
      true,
      false,
      false,
    ]);
    expect(texte('production')).toContain('export const projetsDuBanc: readonly Projet[] = [];');
  });

  it('donne au build de test un projet complet, hors du contenu, ses captures en WebP aux dimensions déclarées', () => {
    const banc = JSON.parse(
      readFileSync(join(front, 'e2e', 'support', 'projets-du-banc.json'), 'utf8'),
    );
    const reels = readdirSync(join(front, 'src', 'contenu', 'fr', 'projets'));
    for (const { identifiant, description, captures, lienCode } of banc) {
      expect(identifiant).toMatch(/^[a-z0-9-]+$/);
      expect(reels).not.toContain(`${identifiant}.json`);
      expect([description.length > 0, captures.length > 0]).toEqual([true, true]);
      expect(lienCode).toMatch(/^https:\/\//);
      for (const { fichier, alternatif, largeur, hauteur } of captures) {
        const chemin = join(front, 'e2e', 'support', 'projets-du-banc', identifiant, fichier);
        expect(dimensionsWebp(readFileSync(chemin)), fichier).toEqual({ largeur, hauteur });
        expect(alternatif.trim()).not.toBe('');
      }
    }
    expect(JSON.stringify(banc)).not.toMatch(EMPLACEMENT);
  });

  it('ne copie les images du contenu de test des fiches que dans le build de test', () => {
    const sortie = join(racine, 'dist');
    for (const environnement of ['developpement', 'preproduction', 'production']) {
      expect(copierImagesDuBanc(front, sortie, environnement)).toBeNull();
      expect(existsSync(sortie)).toBe(false);
    }
    expect(copierImagesDuBanc(front, sortie, 'test')).toBe(join(sortie, 'images', 'projets'));
    const capture = join(sortie, 'images', 'projets', 'projet-du-banc', 'capture-01.webp');
    expect(dimensionsWebp(readFileSync(capture))).toEqual({ largeur: 320, hauteur: 200 });
  });
});
