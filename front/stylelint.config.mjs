// Analyse des styles (PF-10) : un composant n'emploie que les jetons de la charte, déclarés dans
// _jetons.scss, aucune transition ne vise « all », et les classes suivent bloc__element--variante.
const transitionSurTout = /(?:^|,)\s*all(?:\s|,|$)/i;
const motCle = '[a-z0-9]+(?:-[a-z0-9]+)*';

export default {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    // Chaque composant a sa feuille de style, vide tant qu'il n'a rien à styler.
    'no-empty-source': null,
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      ['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix'],
      { message: (nom) => `Couleur ${nom}() : employer un jeton de _jetons.scss` },
    ],
    'declaration-property-value-disallowed-list': {
      transition: [transitionSurTout],
      'transition-property': [transitionSurTout],
    },
    'selector-class-pattern': [
      `^${motCle}(?:__${motCle})?(?:--${motCle})?$`,
      { message: (classe) => `Classe ${classe} : motif bloc__element--variante` },
    ],
  },
  overrides: [
    {
      files: ['**/_jetons.scss'],
      rules: { 'color-no-hex': null, 'color-named': null, 'function-disallowed-list': null },
    },
  ],
};
