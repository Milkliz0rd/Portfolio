# Front

Le site du portfolio, en Angular 22 : composants autonomes, détection de changement sans zone,
signaux. Le build produit des pages statiques pré-rendues, une par adresse du site.

## Prérequis

- **Node 24.22.1**, la version fixée dans `.nvmrc` ; avec nvm, `nvm install` puis `nvm use` dans
  ce dossier.
- **npm**, livré avec Node. `.npmrc` active `engine-strict` : une installation sous une autre
  version de Node que celle du champ `engines` de `package.json` échoue.

## Commandes

Toutes se lancent depuis `front/`.

| Commande                | Effet                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm ci`                | installe les dépendances exactes de `package-lock.json`                                                          |
| `npm start`             | lance le serveur de développement sur `http://localhost:4200/`                                                   |
| `npm run build`         | construit le site pré-rendu dans `dist/front/browser/`, puis place les pages d'erreur                            |
| `npm test`              | lance `test:outils`, puis les tests unitaires (Vitest, par `ng test`) ; avec `CI=true`, un seul passage          |
| `npm run test:outils`   | lance une fois les tests de `outils/tests/` (Vitest), dont celui des jetons de la charte                         |
| `npm run lint`          | lance l'analyse statique : ESLint, Stylelint, puis Prettier en vérification                                      |
| `npm run i18n:verifier` | extrait les libellés dans `tmp/i18n/` (non versionné) et échoue si l'un d'eux n'a pas d'identifiant personnalisé |

`npm start`, `npm run build`, `npm test`, `npm run lint` et `npm run i18n:verifier` écrivent
d'abord l'index des projets (voir « Contenu »).

## Contenu

Le contenu vit en JSON dans `src/contenu/fr/`, décrit par `src/app/interfaces/contenu.ts` : du
texte brut, jamais de HTML ; un contenu encore à fournir est un emplacement étiqueté
`[C-xx — description]`. Il est lu au build, jamais depuis le back, par les services de
`src/app/services/contenu/`, un par fichier.

**Ajouter un projet**, c'est ajouter un fichier JSON et un dossier d'images, rien d'autre :

- `src/contenu/fr/projets/<identifiant>.json`, nommé par son identifiant (minuscules, chiffres
  et tirets, jamais `404`) : titre, description, description courte, rang, captures ; vignette
  et lien vers le code source facultatifs ;
- `public/images/projets/<identifiant>/`, sa vignette et ses captures.

`outils/generer-index-contenu.mjs` en tire `src/contenu/fr/projets/index.genere.ts`, non
versionné : un import par projet, vérifié par `satisfies Projet` (un champ obligatoire manquant
fait échouer la compilation), et `cvPresent`. La fiche `/projets/<identifiant>` est pré-rendue
depuis cet index.

## Styles

Les jetons de la charte graphique sont des propriétés personnalisées CSS, déclarées dans
`src/styles/_jetons.scss`, seul fichier qui porte des couleurs. Les points de rupture sont des
variables SCSS de `src/styles/_ruptures.scss` : `src/styles/` étant dans les chemins de Sass
d'`angular.json`, un composant écrit `@use 'ruptures';`, puis
`@include ruptures.depuis(large) { … }` à partir de 900 px, ou `ruptures.jusqua(large)` en dessous.

## Sortie du build

`dist/front/browser/` contient un `index.html` par adresse (`parcours/index.html`,
`projets/portfolio/index.html`…) et trois pages d'erreur, placées par
`outils/finaliser-build.mjs` : `404.html`, `projets/404.html` et `cv/404.html`.

## Langue

Internationalisation intégrée d'Angular : langue source française (`i18n.sourceLocale` « fr »
dans `angular.json`), aucune autre langue. Chaque libellé d'interface porte l'attribut `i18n`
avec un identifiant personnalisé, de la forme `@@zone.element`.
