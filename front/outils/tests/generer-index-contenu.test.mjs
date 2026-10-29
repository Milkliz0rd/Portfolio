// Index des projets (PF-02) : un fichier ajouté entre dans l'index, l'ordre ne dépend pas de
// celui de la création des fichiers, cvPresent suit le fichier du CV, et l'index est écrit dans
// la forme de Prettier, qui ne le refuse donc pas, même s'il ne le lit pas (fichier non versionné).
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { format, resolveConfig } from 'prettier';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { genererIndexContenu, texteIndex } from '../generer-index-contenu.mjs';

let racine;
const ecrire = (chemin, texte = '{}') => {
  mkdirSync(dirname(join(racine, chemin)), { recursive: true });
  writeFileSync(join(racine, chemin), texte);
};
const ajouterProjet = (nom) => ecrire(`src/contenu/fr/projets/${nom}.json`);
const ecrireProfil = (fichier) =>
  ecrire('src/contenu/fr/profil.json', JSON.stringify({ cv: { fichier } }));
const index = () => {
  const [chemin] = genererIndexContenu(racine);
  return readFileSync(chemin, 'utf8');
};

beforeEach(() => {
  racine = mkdtempSync(join(tmpdir(), 'index-contenu-'));
  ecrireProfil('cv-essai.pdf');
  ajouterProjet('portfolio');
});
afterEach(() => rmSync(racine, { recursive: true, force: true }));

describe('generer-index-contenu', () => {
  it('importe chaque fichier de projet et le vérifie par « satisfies Projet »', () => {
    expect(index()).toContain("import projet_portfolio from './portfolio.json';");
    expect(index()).toContain('[projet_portfolio satisfies Projet]');
  });

  it('fait entrer un fichier ajouté dans l’index, à côté des autres', () => {
    ajouterProjet('essai-ajout');
    const texte = index();
    expect(texte).toContain("import projet_essai_ajout from './essai-ajout.json';");
    expect(texte).toContain(
      '  projet_essai_ajout satisfies Projet,\n  projet_portfolio satisfies Projet,\n',
    );
  });

  it('range les fichiers par nom, quel que soit l’ordre de leur création', () => {
    ajouterProjet('zeta');
    ajouterProjet('alpha');
    const texte = index();
    const positions = ['alpha', 'portfolio', 'zeta'].map((nom) => texte.indexOf(`./${nom}.json`));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(index()).toBe(texte);
  });

  it('donne cvPresent vrai seulement si le fichier du CV est dans public/cv/', () => {
    expect(index()).toContain('export const cvPresent = false;');
    ecrire('public/cv/cv-essai.pdf', '');
    expect(index()).toContain('export const cvPresent = true;');
    ecrireProfil('[C-03 — le CV]');
    expect(index()).toContain('export const cvPresent = false;');
  });

  it('écrit un index que Prettier accepte tel quel, court ou long', async () => {
    const options = {
      ...(await resolveConfig(join(import.meta.dirname, '..', 'x.ts'))),
      parser: 'typescript',
    };
    for (const fichiers of [
      [],
      ['portfolio.json'],
      ['un.json', 'deux.json', 'trois.json', 'quatre.json'],
    ]) {
      const texte = texteIndex(fichiers, false);
      expect(await format(texte, options)).toBe(texte);
    }
  });
});
