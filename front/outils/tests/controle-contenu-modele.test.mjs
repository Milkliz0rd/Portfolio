// La liste des champs du contrôle du contenu (modele.mjs) suit src/app/interfaces/contenu.ts : le
// compilateur TypeScript du projet lit chaque interface (champs facultatifs, listes et objets
// imbriqués compris) et le test la compare aux formes du contrôle, valeurs fermées comprises.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import * as modele from '../controle-contenu/modele.mjs';
import * as contenuTs from '../../src/app/interfaces/contenu.ts';

const src = join(import.meta.dirname, '..', '..', 'src');
const chemin = join(src, 'app', 'interfaces', 'contenu.ts');
const programme = ts.createProgram([chemin], { strict: true, noEmit: true });
const verificateur = programme.getTypeChecker();
const source = programme.getSourceFile(chemin);

/** Le squelette d'un type : 'feuille', [élément] pour une liste, ses champs (« ? » si facultatif). */
function squeletteTs(type) {
  const objets = (type.isUnion() ? type.types : [type]).filter(
    (t) => t.flags & ts.TypeFlags.Object,
  );
  if (objets.length !== 1) return 'feuille';
  if (verificateur.isArrayType(objets[0])) {
    return [squeletteTs(verificateur.getTypeArguments(objets[0])[0])];
  }
  const champs = objets[0]
    .getProperties()
    .map((champ) => [
      champ.name + (champ.flags & ts.SymbolFlags.Optional ? '?' : ''),
      squeletteTs(verificateur.getTypeOfSymbolAtLocation(champ, source)),
    ]);
  return Object.fromEntries(champs);
}
const interfaceTs = (nom) =>
  squeletteTs(
    verificateur.getTypeAtLocation(
      source.statements.find((n) => ts.isInterfaceDeclaration(n) && n.name.text === nom).name,
    ),
  );

/** Le même squelette, tiré d'une forme du contrôle. */
function squelette(forme) {
  if (forme.ouVide) return squelette(forme.ouVide);
  if (Array.isArray(forme)) return [squelette(forme[0])];
  if (typeof forme === 'string' || forme instanceof Set) return 'feuille';
  return Object.fromEntries(Object.entries(forme).map(([cle, f]) => [cle, squelette(f)]));
}

describe('controle-contenu : modèle', () => {
  it.each([
    ['profil.json', 'Profil'],
    ['accueil.json', 'Accueil'],
    ['parcours.json', 'Parcours'],
    ['competences.json', 'Competences'],
    ['experience.json', 'Experience'],
    ['methode.json', 'Methode'],
    ['textes-legaux.json', 'TextesLegaux'],
    ['projets/<identifiant>.json', 'Projet'],
  ])('décrit %s comme l’interface %s', (fichier, nom) => {
    const forme = modele.MODELE[fichier] ?? modele.MODELE_PROJET;
    expect(squelette(forme)).toEqual(interfaceTs(nom));
  });

  it('lit les fichiers que contenu-langue.ts importe, et eux seuls', () => {
    const langue = readFileSync(join(src, 'contenu', 'contenu-langue.ts'), 'utf8');
    const importes = [...langue.matchAll(/from '\.\/fr\/([^']+\.json)'/g)].map(([, nom]) => nom);
    expect(Object.keys(modele.MODELE).sort()).toEqual(importes.sort());
  });

  it.each(['TYPES_ETAPE', 'ETATS_ETAPE', 'CLES_VOLET', 'CLES_ILLUSTRATION'])(
    'reprend les valeurs fermées de %s',
    (nom) => expect(modele[nom]).toEqual([...contenuTs[nom]]),
  );
});
