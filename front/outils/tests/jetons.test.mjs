// Jetons de la charte (TK-10) : chaque nom des tableaux des sections 3 et 5 de la charte est
// déclaré sous son nom exact, et les valeurs de la palette PA-02 Lagune et de la révision du
// 27/10/2026 sont celles de la charte. Les listes sont recopiées de la charte, dans son ordre,
// et non lues dans le dépôt. Un jeton retiré, renommé ou mis en commentaire fait échouer le
// test, comme une valeur changée de PA-02, de la révision, des tranches ou des ruptures.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const styles = join(import.meta.dirname, '..', '..', 'src', 'styles');
// Les commentaires sont retirés avant la recherche : un jeton en commentaire n'est pas déclaré.
const sansCommentaires = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const lire = (fichier) => sansCommentaires(readFileSync(join(styles, fichier), 'utf8'));
const jetons = lire('_jetons.scss');
const ruptures = lire('_ruptures.scss');

const NOMS_SECTION_3 = [
  // 3.1
  ...['couleur-fond', 'couleur-surface', 'couleur-surface-relevee', 'couleur-bordure'],
  ...['couleur-texte', 'couleur-texte-secondaire', 'couleur-texte-discret', 'couleur-accent'],
  ...['couleur-accent-secondaire', 'couleur-texte-sur-accent', 'couleur-succes', 'couleur-erreur'],
  ...['couleur-attention', 'couleur-focus'],
  // 3.2
  ...['police-titre', 'police-texte', 'police-mono', 'graisse-normale', 'graisse-moyenne'],
  ...['graisse-appuyee', 'graisse-forte', 'graisse-titre', 'interligne-affiche'],
  ...['interligne-titre', 'interligne-sous-titre', 'interligne-chapo', 'interligne-texte'],
  ...['interligne-compact', 'approche-affiche', 'approche-titre', 'approche-sous-titre'],
  ...['approche-etiquette', 'approche-pastille'],
  // 3.3
  ...['espace-1', 'espace-2', 'espace-3', 'espace-4', 'espace-5', 'espace-6', 'espace-8'],
  ...['espace-10', 'espace-12', 'espace-16', 'espace-20', 'espace-24', 'espace-32'],
  // 3.4
  ...['arrondi-petit', 'arrondi-moyen', 'arrondi-grand', 'arrondi-pilule', 'arrondi-cercle'],
  // 3.5
  ...['bordure-epaisseur', 'focus-epaisseur', 'focus-decalage', 'anneau-focus', 'cible-tactile'],
  // 3.6
  ...['opacite-verre-haut', 'opacite-verre-bas', 'opacite-verre-bordure', 'verre-fond'],
  ...['verre-bordure', 'flou-verre', 'opacite-halo-accent', 'halo-accent'],
  ...['opacite-halo-secondaire', 'halo-secondaire', 'opacite-trame', 'pas-trame', 'trame-points'],
  ...['voile-bas', 'opacite-teinte', 'opacite-teinte-message', 'lueur-point'],
  ...['opacite-lueur-survol', 'taille-lueur-survol', 'lueur-survol'],
  // 3.7
  ...['ombre-fenetre', 'ombre-flottante'],
  // 3.8
  ...['duree-instant', 'duree-courte', 'duree-moyenne', 'duree-longue', 'duree-apparition'],
  ...['duree-trace', 'duree-rotation', 'duree-etape', 'duree-sortie-page', 'duree-respiration'],
  ...['delai-depart', 'delai-cascade', 'delai-mot-titre', 'delai-mot', 'delai-caractere'],
  ...['distance-apparition', 'distance-soulevement'],
  ...['courbe-standard', 'courbe-sortie', 'courbe-entree-sortie'],
  // 3.9
  ...['plan-contenu', 'plan-entete', 'plan-menu', 'plan-evitement'],
];

// Section 5, sans les points de rupture, qui sont des variables de _ruptures.scss.
const NOMS_SECTION_5 = [
  ...['conteneur-texte', 'conteneur-standard', 'conteneur-large', 'marge-page', 'gouttiere'],
  'hauteur-entete',
];

const RUPTURES = {
  'rupture-moyenne': '600px',
  'rupture-large': '900px',
  'rupture-tres-large': '1200px',
  'rupture-immense': '1600px',
};

const PA_02 = {
  'couleur-fond': '#070C0C',
  'couleur-surface': '#0F1616',
  'couleur-surface-relevee': '#172121',
  'couleur-bordure': '#2A3939',
  'couleur-texte': '#EEF5F5',
  'couleur-texte-secondaire': '#A9BDBE',
  'couleur-texte-discret': '#97A9AB',
  'couleur-accent': '#3FD4C8',
  'couleur-accent-secondaire': '#FFB59E',
  'couleur-texte-sur-accent': '#04201E',
  'couleur-succes': '#7ADB9A',
  'couleur-erreur': '#FF7272',
  'couleur-attention': '#F2CF6B',
  'couleur-focus': '#FFE08A',
};

// Halos moyens (16/10/2026), lueur de survol à 20 % (18/10/2026) et voile bas qui finit en
// couleur-fond pleine (27/10/2026).
const REVISION = {
  'opacite-halo-accent': '20%',
  'opacite-halo-secondaire': '15%',
  'opacite-lueur-survol': '20%',
  'taille-lueur-survol': '380px',
  'lueur-survol':
    'radial-gradient(circle calc(var(--taille-lueur-survol) / 2), ' +
    'color-mix(in srgb, var(--couleur-accent) var(--opacite-lueur-survol), transparent), ' +
    'transparent)',
  'voile-bas':
    'linear-gradient(to bottom, transparent 65%, ' +
    'color-mix(in srgb, var(--couleur-fond) 50%, transparent) 90%, var(--couleur-fond))',
};

const normaliser = (valeur) =>
  valeur.replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')').trim().toLowerCase();

// Valeurs de toutes les déclarations d'un nom (--nom ou $nom), dans l'ordre du fichier.
const valeurs = (source, nom) =>
  [...source.matchAll(new RegExp(`(?:^|[\\s{;])${nom}\\s*:([^;]*);`, 'g'))].map(([, valeur]) =>
    normaliser(valeur),
  );

// Pour chaque nom attendu, sa première valeur déclarée : un écart nomme le jeton fautif.
const declarees = (source, prefixe, attendues) =>
  Object.fromEntries(
    Object.keys(attendues).map((nom) => [nom, valeurs(source, prefixe + nom)[0] ?? 'absent']),
  );
const normalisees = (attendues) =>
  Object.fromEntries(Object.entries(attendues).map(([nom, valeur]) => [nom, normaliser(valeur)]));

describe('jetons de la charte, sections 3 et 5', () => {
  it('reprend les 112 noms des tableaux de la charte', () => {
    expect(NOMS_SECTION_3).toHaveLength(102);
    expect(NOMS_SECTION_5.length + Object.keys(RUPTURES).length).toBe(10);
  });

  it('déclare chaque nom dans _jetons.scss, sous son nom exact', () => {
    const absents = [...NOMS_SECTION_3, ...NOMS_SECTION_5].filter(
      (nom) => valeurs(jetons, `--${nom}`).length === 0,
    );
    expect(absents).toEqual([]);
  });

  it('donne aux couleurs les valeurs de la palette PA-02 Lagune', () => {
    expect(declarees(jetons, '--', PA_02)).toEqual(normalisees(PA_02));
  });

  it('reprend les valeurs révisées des halos, de la lueur de survol et du voile bas', () => {
    expect(declarees(jetons, '--', REVISION)).toEqual(normalisees(REVISION));
  });

  it('change marge-page et gouttiere par tranche, de l’étroite à l’immense', () => {
    expect(valeurs(jetons, '--marge-page')).toEqual(['16px', '24px', '32px', '48px', '64px']);
    expect(valeurs(jetons, '--gouttiere')).toEqual(['16px', '20px', '24px', '32px']);
  });

  it('déclare les points de rupture dans _ruptures.scss, avec depuis() et jusqua()', () => {
    expect(declarees(ruptures, '\\$', RUPTURES)).toEqual(RUPTURES);
    expect(ruptures).toMatch(/@mixin depuis\(\$nom\)/);
    expect(ruptures).toMatch(/@mixin jusqua\(\$nom\)/);
  });

  it('ne déclare aucun thème clair', () => {
    expect(jetons + ruptures).not.toMatch(/prefers-color-scheme/);
  });
});
