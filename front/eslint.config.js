// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

// Analyse statique du front (PF-10). Toutes les règles sont en erreur, et « ng lint » refuse
// aussi le moindre avertissement (maxWarnings à 0 dans angular.json).

const dateDuJour = 'Aucune valeur calculée depuis la date du jour (MF-18).';

// Imports interdits partout : les appels réseau passent par services/http, avec fetch (PF-07) ;
// l'état local est en signaux ; entrées, sorties et liaisons d'hôte par input(), output() et host.
const importsInterdits = [
  {
    name: '@angular/common/http',
    importNames: ['HttpClient'],
    message: 'Les appels passent par services/http, avec fetch (PF-07).',
  },
  { name: 'rxjs', importNames: ['BehaviorSubject'], message: "L'état local est un signal." },
  {
    name: '@angular/core',
    importNames: ['Input', 'Output', 'EventEmitter', 'HostListener', 'HostBinding'],
    message: 'Employer input(), output() et la propriété host du décorateur.',
  },
];

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        [
          { type: 'element', prefix: 'app', style: 'kebab-case' },
          // Les composants d'action se posent sur l'élément natif : button[appBouton] (PF-01).
          { type: 'attribute', prefix: 'app', style: 'camelCase' },
        ],
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-signals': 'error',
      'no-restricted-imports': ['error', { paths: importsInterdits }],
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: "fetch ne s'emploie que dans services/http (PF-07)." },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: "NewExpression[callee.name='Date'][arguments.length=0]", message: dateDuJour },
        {
          selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message: dateDuJour,
        },
      ],
    },
  },
  {
    // Les composants et les directives de la charte ne dépendent d'aucun contenu ni d'aucun
    // service du portfolio (PF-01), pour être réutilisables hors du portfolio.
    files: ['src/app/components/**/*.ts', 'src/app/directives/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: importsInterdits,
          patterns: [
            {
              regex: '(^|/)contenu(/|$)',
              message: 'Un composant de la charte ne dépend pas du contenu (PF-01).',
            },
            {
              regex: '(^|/)services/(contact-api|envoi-contact|http|navigation|referencement)(/|$)',
              message: 'Un composant de la charte ne dépend pas des services du portfolio (PF-01).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/services/http/**/*.ts'],
    rules: { 'no-restricted-globals': 'off' },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      // Chaque libellé est marqué, avec un identifiant personnalisé « @@zone.element » (PF-03).
      // nom, variante et taille, entrées des composants de la charte, portent une clé, jamais un
      // libellé.
      '@angular-eslint/template/i18n': [
        'error',
        { checkId: true, checkText: true, ignoreAttributes: ['nom', 'variante', 'taille'] },
      ],
    },
  },
  {
    // Les modèles d'essai des tests ne portent aucun libellé d'interface.
    files: ['**/*.spec.ts/*.html'],
    rules: { '@angular-eslint/template/i18n': 'off' },
  },
  {
    // index.html n'est pas un modèle de composant : Angular n'en extrait aucun libellé.
    files: ['src/index.html'],
    rules: { '@angular-eslint/template/i18n': 'off' },
  },
]);
