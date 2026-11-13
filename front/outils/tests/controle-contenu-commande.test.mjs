// La commande du contrôle du contenu (PF-02, TK-28) : elle lit les fichiers de chaque langue
// (fichier absent, illisible ou hors du modèle relevé), ne trouve dans le contenu du dépôt que des
// emplacements étiquetés, sort une ligne par faute (une annotation de GitHub dans la CI) puis son
// bilan, et rend son code de sortie : 0, 1 sur une erreur, 2 sans mode reconnu.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commande, controlerContenu } from '../controle-contenu/controle-contenu.mjs';
import { contenuCorrect, court, ecrireContenu } from './controle-contenu-essais.mjs';

const front = join(import.meta.dirname, '..', '..');
let racine;
beforeEach(() => {
  racine = mkdtempSync(join(tmpdir(), 'controle-contenu-'));
});
afterEach(() => rmSync(racine, { recursive: true, force: true }));

/** Écrit le contenu correct, changé par le test, dans le dossier jetable. */
const ecrire = (changer) => {
  const contenu = contenuCorrect();
  changer?.(contenu);
  ecrireContenu(racine, contenu);
};
const etiqueter = (c) => {
  c.accueil.presentation[1] = '[C-06 — présentation de l’accueil]';
  c['projets/portfolio'].captures[0].largeur = '[C-05 — capture 1]';
};
const lancer = (args, env = {}) => commande(args, { racine, env });

describe('controle-contenu : la commande', () => {
  it('lit un contenu correct écrit en fichiers, sans faute', () => {
    ecrire();
    expect(controlerContenu(racine, 'main')).toEqual([]);
  });

  it.each([
    ['cv : fichier hors du modèle', (c) => (c.cv = { fichier: 'cv.pdf' })],
    ['textes-legaux : fichier absent', (c) => delete c['textes-legaux']],
    ['accueil : JSON illisible', (c) => (c.accueil = '{ "presentation": [')],
  ])('lit chaque fichier de la langue et relève « %s »', (attendu, changer) => {
    ecrire(changer);
    expect(controlerContenu(racine, 'main').map(court)).toEqual([`erreur ${attendu}`]);
  });

  it('ne relève dans le contenu du dépôt que des emplacements étiquetés', () => {
    for (const mode of ['staging', 'main']) {
      const fautes = controlerContenu(front, mode);
      expect(fautes.filter(({ regle }) => regle !== 'emplacement étiqueté')).toEqual([]);
    }
  });

  it('sort une ligne par faute, puis le bilan ; code 0 en mode staging, 1 en mode main', () => {
    ecrire(etiqueter);
    expect(lancer(['--mode=staging'])).toEqual({
      code: 0,
      lignes: [
        'avertissement — src/contenu/fr/accueil.json, presentation[1] : emplacement étiqueté (« [C-06 — présentation de l’accueil] »)',
        'avertissement — src/contenu/fr/projets/portfolio.json, captures[0].largeur : emplacement étiqueté (« [C-05 — capture 1] »)',
        'Contrôle du contenu, mode staging : 0 erreur, 2 avertissements.',
      ],
    });
    const main = lancer(['--mode=main']);
    expect(main.code).toBe(1);
    expect(main.lignes.at(-1)).toBe('Contrôle du contenu, mode main : 2 erreurs, 0 avertissement.');
  });

  it('écrit chaque ligne en annotation de GitHub dans la CI, fichier pris depuis le dépôt', () => {
    ecrire(etiqueter);
    const env = { GITHUB_ACTIONS: 'true', GITHUB_WORKSPACE: join(racine, '..') };
    expect(lancer(['--mode=staging'], env).lignes[0]).toBe(
      `::warning file=${basename(racine)}/src/contenu/fr/accueil.json,title=Contrôle du contenu::avertissement — src/contenu/fr/accueil.json, presentation[1] : emplacement étiqueté (« [C-06 — présentation de l’accueil] »)`,
    );
    expect(lancer(['--mode=main'], env).lignes[0]).toMatch(/^::error file=/);
  });

  it('refuse un mode absent ou inconnu (code 2)', () => {
    expect(lancer([]).code).toBe(2);
    expect(lancer(['--mode=prod']).code).toBe(2);
  });

  it('passe sur le contenu du dépôt en mode staging, lancée par node', () => {
    const cli = join(front, 'outils', 'controle-contenu', 'controle-contenu.mjs');
    const env = { ...process.env, GITHUB_ACTIONS: '' };
    const sortie = spawnSync(process.execPath, [cli, '--mode=staging'], { encoding: 'utf8', env });
    expect(sortie.status).toBe(0);
    expect(sortie.stdout).toMatch(/Contrôle du contenu, mode staging : 0 erreur, \d+ avert/);
  });
});
