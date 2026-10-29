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
| `npm run test:outils`   | lance une fois les tests de `outils/tests/` (Vitest), dont ceux des jetons et des polices                        |
| `npm run lint`          | lance l'analyse statique : ESLint, Stylelint, puis Prettier en vérification                                      |
| `npm run i18n:verifier` | extrait les libellés dans `tmp/i18n/` (non versionné) et échoue si l'un d'eux n'a pas d'identifiant personnalisé |

## Styles

Les jetons de la charte graphique sont des propriétés personnalisées CSS, déclarées dans
`src/styles/_jetons.scss`, seul fichier qui porte des couleurs. Les points de rupture sont des
variables SCSS de `src/styles/_ruptures.scss` : `src/styles/` étant dans les chemins de Sass
d'`angular.json`, un composant écrit `@use 'ruptures';`, puis
`@include ruptures.depuis(large) { … }` à partir de 900 px, ou `ruptures.jusqua(large)` en dessous.

`src/styles.scss` charge ensuite, dans cet ordre :

| Fichier             | Contenu                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `_polices.scss`     | une règle de police par fichier de `public/polices/`, avec `font-display: swap`                                                           |
| `_base.scss`        | boîtes, fond de la page, anneau de focus sur `:focus-visible`, cibles de 44 px pour les contrôles natifs                                  |
| `_typographie.scss` | les dix tailles de texte (`--taille-affiche` à `--taille-etiquette`), appliquées à `body`, `h1` à `h4` et `code` ; classe `affiche`       |
| `_utilitaires.scss` | `masque-visuellement`, `conteneur-standard` et `conteneur-large` (plus la marge de page de chaque côté), `grille` (4, 8 puis 12 colonnes) |

## Polices

Bricolage Grotesque (700, 800), Hanken Grotesk (400 à 700) et JetBrains Mono (400, 500) sont
servies par le site depuis `public/polices/` : aucune police n'est demandée à un tiers.
`src/index.html` précharge les deux fichiers du premier écran, Bricolage Grotesque 800 et Hanken
Grotesk 400. Le dossier ne contient qu'un fichier WOFF2 par graisse et la licence SIL Open Font
License 1.1 de chaque famille, ce que vérifie `outils/tests/polices.test.mjs`. Les sources sont les
fichiers variables du dossier `ofl/` de
[google/fonts](https://github.com/google/fonts/tree/58466038e19d5a14053e0c9f863715e74af0fe0e/ofl) :

| Famille             | Fichier source                           | Version | Licence                       |
| ------------------- | ---------------------------------------- | ------- | ----------------------------- |
| Bricolage Grotesque | `BricolageGrotesque[opsz,wdth,wght].ttf` | 1.001   | `bricolage-grotesque-ofl.txt` |
| Hanken Grotesk      | `HankenGrotesk[wght].ttf`                | 3.013   | `hanken-grotesk-ofl.txt`      |
| JetBrains Mono      | `JetBrainsMono[wght].ttf`                | 2.211   | `jetbrains-mono-ofl.txt`      |

Chaque fichier se produit une fois avec fontTools et brotli (`pip install fonttools brotli`) :
fixer la graisse, puis réduire aux caractères utiles et compresser. La version de la police entre
dans le nom du fichier. Par exemple, pour Hanken Grotesk 400 :

```sh
fonttools varLib.instancer "HankenGrotesk[wght].ttf" wght=400 --update-name-table -o hanken-grotesk-400.ttf
pyftsubset hanken-grotesk-400.ttf \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,U+2013-2014,U+2018-201E,U+2026,U+202F" \
  --name-IDs=0,1,2,3,4,5,6,13,14 --flavor=woff2 \
  --output-file=public/polices/hanken-grotesk-400-v3.013.woff2
```

Bricolage Grotesque se fixe par `wght=700 wdth=100` ou `wght=800 wdth=100` : son axe de taille
optique (`opsz`) reste, accordé par le navigateur à la taille du texte. Les noms 13 et 14 gardent
la licence dans chaque fichier. Manquent aux sources, et viennent donc de la police de repli :
U+202F (espace fine insécable) chez Hanken Grotesk et JetBrains Mono, U+00A4 et U+00AD chez
Bricolage Grotesque, U+201B chez les trois.

## Sortie du build

`dist/front/browser/` contient un `index.html` par adresse (`parcours/index.html`,
`projets/portfolio/index.html`…) et trois pages d'erreur, placées par
`outils/finaliser-build.mjs` : `404.html`, `projets/404.html` et `cv/404.html`.

## Langue

Internationalisation intégrée d'Angular : langue source française (`i18n.sourceLocale` « fr »
dans `angular.json`), aucune autre langue. Chaque libellé d'interface porte l'attribut `i18n`
avec un identifiant personnalisé, de la forme `@@zone.element`.
