// Polices servies par le site (TK-11) : chaque fichier nommé par une règle de _polices.scss, et
// chaque police préchargée par index.html, existe dans public/polices/. Une adresse fausse ne
// casse pas le build : seul ce test la voit, avant le navigateur. Le dossier ne contient que ces
// fichiers et une licence SIL OFL 1.1 par famille.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const front = join(import.meta.dirname, '..', '..');
const dossier = join(front, 'public', 'polices');
// Les commentaires sont retirés avant la recherche : une règle en commentaire ne compte pas.
const sansCommentaires = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const polices = sansCommentaires(
  readFileSync(join(front, 'src', 'styles', '_polices.scss'), 'utf8'),
);
const index = readFileSync(join(front, 'src', 'index.html'), 'utf8');

const regles = polices.match(/@font-face\s*\{[^}]*\}/g) ?? [];
// Adresses telles que le navigateur les demande (/polices/…), une par règle.
const adresses = regles.map((regle) => regle.match(/url\(\s*['"]?([^'")]+)/)?.[1] ?? 'absente');
const prechargees = (index.match(/<link\b[^>]*>/g) ?? [])
  .filter((balise) => /\brel="preload"/.test(balise))
  .map((balise) => balise.match(/\bhref="([^"]+)"/)?.[1] ?? 'absente');
const absentes = (liste) => liste.filter((adresse) => !existsSync(join(front, 'public', adresse)));

describe('polices servies par le site', () => {
  it('déclare les huit graisses de la charte, chacune avec son fichier dans public/polices/', () => {
    expect(regles).toHaveLength(8);
    expect(adresses.filter((adresse) => !adresse.startsWith('/polices/'))).toEqual([]);
    expect(absentes(adresses)).toEqual([]);
  });

  it('précharge deux fichiers du dossier, déclarés par les règles', () => {
    expect(prechargees).toHaveLength(2);
    expect(absentes(prechargees)).toEqual([]);
    expect(prechargees.filter((adresse) => !adresses.includes(adresse))).toEqual([]);
  });

  it('ne garde dans le dossier que ces fichiers et les trois licences', () => {
    const declares = adresses.map((adresse) => adresse.replace('/polices/', ''));
    const autres = readdirSync(dossier).filter(
      (nom) => !declares.includes(nom) && !nom.endsWith('-ofl.txt'),
    );
    expect(autres).toEqual([]);
    for (const famille of ['bricolage-grotesque', 'hanken-grotesk', 'jetbrains-mono']) {
      expect(readFileSync(join(dossier, `${famille}-ofl.txt`), 'utf8')).toMatch(
        /SIL Open Font License, Version 1\.1/,
      );
    }
  });
});
