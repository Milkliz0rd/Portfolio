// Fichier d'en-têtes (PF-09) : empreintes calculées sur la sortie, politique selon l'environnement,
// règle du CV, et échecs du build sur un gestionnaire en ligne ou une ligne trop longue.
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { lireConfiguration } from '../ecrire-configuration.mjs';
import { ecrireEnTetes, empreintesScripts, texteEnTetes } from '../en-tetes.mjs';

const front = join(import.meta.dirname, '..', '..');
const modele = readFileSync(join(front, 'hebergement', 'en-tetes.modele'), 'utf8');
// L'empreinte de « alert(1) », telle que la donnent les exemples de politique de sécurité.
const alerte = "'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='";
const enTetes = (environnement, baseApi = '', empreintes = [], fichiersCv = []) =>
  texteEnTetes(modele, { environnement, baseApi, empreintes, fichiersCv });
const entete = (texte, nom) => texte.match(new RegExp(`^  ${nom}: (.*)$`, 'm'))?.[1];

let racine;
const ecrire = (chemin, texte) => {
  mkdirSync(dirname(join(racine, chemin)), { recursive: true });
  writeFileSync(join(racine, chemin), texte);
};
const page = (tete) => `<!doctype html><html><head>${tete}</head><body><p>x</p></body></html>`;
const produire = (environnement = 'production') =>
  ecrireEnTetes(racine, join(racine, 'dist'), { environnement, baseApi: '' });
const fichierProduit = () => readFileSync(join(racine, 'dist', '_headers'), 'utf8');

beforeEach(() => {
  racine = mkdtempSync(join(tmpdir(), 'en-tetes-'));
  cpSync(join(front, 'hebergement'), join(racine, 'hebergement'), { recursive: true });
  ecrire('src/contenu/fr/profil.json', JSON.stringify({ cv: { fichier: 'cv-essai.pdf' } }));
});
afterEach(() => rmSync(racine, { recursive: true, force: true }));

describe('en-tetes', () => {
  it('calcule l’empreinte des seuls scripts en ligne que le navigateur exécute', () => {
    const html = [
      '<script>alert(1)</script>',
      '<script type="module">alert(1)</script>',
      "<script type='text/javascript'>window.a = 1;\r\nwindow.b = 2;</script>",
      '<script src="main.js" type="module"></script>',
      '<script id="ng-state" type="application/json">{"a":1}</script>',
      '<script type="application/ld+json">{"@type":"Person"}</script>',
      // Le texte exact entre les balises, espaces et fins de ligne compris.
      '<script>\n  alert(1)\n</script>',
    ].join('');
    expect(empreintesScripts(html)).toEqual([
      alerte,
      alerte,
      "'sha256-NGPfjnKeFW+AIqdECe3jeLOTpAEYUpQHpJuVdOkPEpM='",
      "'sha256-BjA0ROBfupHLCiW2gRrYiELX3ecfNFbiR7URMIXYaeU='",
    ]);
  });

  it('écrit dans script-src l’union des empreintes de tous les HTML du build', () => {
    ecrire('dist/index.html', page('<script>alert(1)</script>'));
    ecrire(
      'dist/parcours/index.html',
      page('<script>alert(1)</script><script>window.x=1</script>'),
    );
    ecrire('dist/404.html', page(''));
    expect(produire().empreintes).toBe(2);
    const scripts = entete(fichierProduit(), 'Content-Security-Policy').split('; ')[1].split(' ');
    expect(scripts).toHaveLength(4);
    expect(scripts.slice(0, 2)).toEqual(['script-src', "'self'"]);
    expect(scripts).toContain(alerte);
  });

  it('fait échouer le build sur un gestionnaire d’événement en ligne ou une adresse javascript:', () => {
    ecrire('dist/index.html', page('<link rel="stylesheet" href="s.css" onload="x()">'));
    expect(produire).toThrow(/index\.html : attribut onload/);
    ecrire('dist/index.html', page('<a href="javascript:void(0)">x</a>'));
    expect(produire).toThrow(/javascript:/);
    ecrire('dist/index.html', page('<script>el.onclick = () => 1; // <a onclick=x></script>'));
    expect(produire).not.toThrow();
  });

  it('fait échouer le build sur une ligne de plus de 2 000 caractères', () => {
    const empreintes = Array.from(
      { length: 36 },
      (_, n) => `'sha256-${String(n).padStart(44, 'A')}'`,
    );
    expect(() => enTetes('production', '', empreintes)).toThrow(/2000 au plus/);
    expect(() => enTetes('production', '', empreintes.slice(0, 30))).not.toThrow();
  });

  it('pose en production la politique du plan, avec la base de l’API versionnée', () => {
    const { environnement, baseApi } = lireConfiguration(front, { WORKERS_CI_BRANCH: 'main' });
    const texte = enTetes(environnement, baseApi);
    expect(entete(texte, 'Content-Security-Policy')).toBe(
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self' https://api.alexandre-morozoff-dev.fr; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
    );
    expect(entete(texte, 'Strict-Transport-Security')).toBe('max-age=31536000');
    expect(entete(texte, 'X-Robots-Tag')).toBeUndefined();
    for (const nom of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']) {
      expect(entete(texte, nom)).toBeDefined();
    }
    expect(entete(texte, 'X-Frame-Options')).toBe('DENY');
  });

  it('réduit connect-src à self en préproduction sans variable, avec la non-indexation', () => {
    const { environnement, baseApi } = lireConfiguration(front, { WORKERS_CI_BRANCH: 'staging' });
    const texte = enTetes(environnement, baseApi);
    expect(entete(texte, 'Content-Security-Policy')).toContain("; connect-src 'self'; ");
    expect(entete(texte, 'X-Robots-Tag')).toBe('noindex');
    expect(entete(texte, 'Strict-Transport-Security')).toBeDefined();
  });

  it('retire upgrade-insecure-requests et HSTS en test, servi en HTTP', () => {
    const texte = enTetes('test', 'http://localhost:8787');
    expect(entete(texte, 'Content-Security-Policy')).not.toContain('upgrade-insecure-requests');
    expect(entete(texte, 'Content-Security-Policy')).toMatch(/frame-ancestors 'none'$/);
    expect(entete(texte, 'Strict-Transport-Security')).toBeUndefined();
    expect(entete(texte, 'X-Robots-Tag')).toBe('noindex');
  });

  it('retire la politique du seul fichier du CV, quand il est dans le build', () => {
    ecrire('dist/index.html', page(''));
    produire();
    expect(fichierProduit()).not.toContain('/cv/');
    ecrire('dist/cv/cv-essai.pdf', '');
    produire();
    expect(fichierProduit()).toContain('\n/cv/cv-essai.pdf\n  ! Content-Security-Policy\n');
  });
});
