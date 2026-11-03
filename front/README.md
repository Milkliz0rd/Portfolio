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
| `npm run build`         | construit le site pré-rendu dans `dist/front/browser/`, place les pages d'erreur et écrit `_headers`             |
| `npm test`              | lance `test:outils`, puis les tests unitaires (Vitest, par `ng test`) ; avec `CI=true`, un seul passage          |
| `npm run test:outils`   | lance une fois les tests de `outils/tests/` (Vitest), dont ceux des jetons et des polices                        |
| `npm run lint`          | lance l'analyse statique : ESLint, les types du banc de bout en bout (`tsc`), Stylelint, puis Prettier           |
| `npm run i18n:verifier` | extrait les libellés dans `tmp/i18n/` (non versionné) et échoue si l'un d'eux n'a pas d'identifiant personnalisé |
| `npm run serveur-local` | sert `dist/front/browser/` avec les règles de l'hébergeur, sur `http://localhost:8787` (voir « Hébergement »)    |
| `npm run e2e`           | construit le build de test, puis lance le banc de bout en bout (voir « Tests de bout en bout »)                  |

`npm start`, `npm run build`, `npm test`, `npm run lint` et `npm run i18n:verifier` écrivent
d'abord la configuration de l'environnement (voir « Environnements ») et l'index des projets (voir
« Contenu »).

Une erreur au rendu d'une page fait échouer `npm run build` : en production, le rendu serveur la
relance (`src/app/app.config.server.ts`). Le build n'écrit alors aucune page, et son journal donne
en général l'erreur sous l'adresse de la page en cause. Levée dans le constructeur d'une page, elle
peut manquer au journal ou y être rapportée sous une autre page, et la page en cause ne reçoit que
« The content returned was empty. » : ouverte sous `npm start`, elle écrit le vrai message dans le
journal du serveur de développement. Le serveur de développement (`npm start`) et la configuration
de développement (`npm run watch`) gardent le gestionnaire d'erreurs par défaut : l'erreur s'écrit
dans le journal et la page part incomplète. Le navigateur le garde aussi, et écrit l'erreur dans la
console.

## Environnements

`outils/ecrire-configuration.mjs` écrit `src/configuration/configuration.genere.ts`, non versionné,
le seul fichier que le code lit pour connaître son environnement : `environnement`, `baseApi` (la
base de l'API du back, sans barre finale) et `origineSite` (l'origine canonique du site). Les
adresses publiques sont versionnées dans `src/configuration/adresses-publiques.json` ; l'adresse
technique du back de préproduction n'entre jamais dans le dépôt.

| Environnement   | Choisi quand                                     | `baseApi`                                         | `origineSite`         |
| --------------- | ------------------------------------------------ | ------------------------------------------------- | --------------------- |
| `developpement` | sur le poste, par défaut                         | `PORTFOLIO_BASE_API`, sinon vide                  | `origineSite` du JSON |
| `test`          | `CI` posée (la CI), ou `npm test`                | `http://localhost:8787`, le serveur local de test | la même               |
| `preproduction` | chez l'hébergeur, toute branche autre que `main` | `PORTFOLIO_BASE_API_PREPRODUCTION`, sinon vide    | `origineSite` du JSON |
| `production`    | chez l'hébergeur, branche `main`                 | `baseApiProduction` du JSON                       | `origineSite` du JSON |

- `PORTFOLIO_ENVIRONNEMENT` l'emporte sur tout, par exemple
  `PORTFOLIO_ENVIRONNEMENT=production npm run build`. Chez l'hébergeur, la branche construite
  (`WORKERS_CI_BRANCH`) l'emporte sur `CI`, que l'hébergeur pose aussi.
- `PORTFOLIO_BASE_API_PREPRODUCTION` est une variable de build de l'hébergeur, posée une fois le
  service de préproduction du back créé. Absente, le build réussit avec un avertissement dans son
  journal : elle reste facultative jusqu'au client du contrat d'API (TK-42).
- `PORTFOLIO_BASE_API`, la base du back local, se pose dans `front/.env.local` (non versionné), par
  exemple `PORTFOLIO_BASE_API=http://localhost:8080`, ou dans l'environnement, qui l'emporte.
- En préproduction et en production, une valeur qui n'est pas une origine HTTPS (schéma et hôte en
  minuscules, sans port, chemin ni barre finale) fait échouer la commande ; en développement, une
  origine HTTP ou HTTPS, avec un port si besoin.

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

`src/styles.scss` charge ensuite, dans cet ordre :

| Fichier             | Contenu                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `_polices.scss`     | une règle de police par fichier de `public/polices/`, avec `font-display: swap`                                                           |
| `_base.scss`        | boîtes, fond de la page, anneau de focus sur `:focus-visible`, cibles de 44 px pour les contrôles natifs                                  |
| `_typographie.scss` | les dix tailles de texte (`--taille-affiche` à `--taille-etiquette`), appliquées à `body`, `h1` à `h4` et `code` ; classe `affiche`       |
| `_utilitaires.scss` | `masque-visuellement`, `conteneur-standard` et `conteneur-large` (plus la marge de page de chaque côté), `grille` (4, 8 puis 12 colonnes) |
| `_mouvement.scss`   | toutes les règles du mouvement, sur des classes `mv-*` (voir « Mouvement »)                                                               |

Les mélanges de couleur et les valeurs propres à un composant, que la charte donne sans les
nommer, sont des jetons de rôle, en fin de `_jetons.scss` (`--fond-bouton-survol`…).

## Composants

Les composants de la charte vivent dans `src/app/components/`, un dossier par composant. Ils
n'emploient que des jetons et ne dépendent d'aucun contenu ni d'aucun service du portfolio. Le
bouton et le lien se posent sur l'élément natif, qui garde sa sémantique, son clavier et le lien du
routeur :

| Composant      | Se pose                                                                | Entrées                                                                                                                       |
| -------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Icône          | `<app-icone nom="fleche" />`                                           | `nom`, l'une des 13 icônes ; décorative, à la couleur et à 1,25 fois la taille du texte                                       |
| Bouton (CO-01) | `<button appBouton>` pour une action, `<a appBouton>` pour une page    | `variante` (`primaire`, par défaut, `secondaire`, `discret`, `icone`), `compact`, `libelle` (texte masqué, exigé par `icone`) |
| Lien (CO-02)   | `<a appLien routerLink="/parcours">`, `<a appLien href="…">` hors site | `variante` (`texte`, par défaut, `discret`, `action`, `navigation`, `externe`), `courant` (`aria-current="page"`)             |

Un `button` sans `type` reçoit `type="button"`. Le lien externe s'ouvre dans un nouvel onglet
(`target="_blank"`, `rel="noopener noreferrer"`) et l'annonce par sa flèche et le texte masqué
« (nouvel onglet) ».

Les composants de texte sont statiques, sans survol ni focus. Ils n'ajoutent aucun texte : tout
vient de la page, qui le marque pour la traduction (`i18n`, `i18n-etiquette`, `$localize`).

| Composant                  | Se pose                                                                   | Entrées                                                                                                                                |
| -------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Pastille (CO-03)           | `<app-pastille variante="succes">Validé</app-pastille>`                   | `variante` (`neutre`, par défaut, `accent`, `secondaire`, `succes`, `attention`, `erreur`, `contour`), `lumineuse` (point qui rayonne) |
| Étiquette (CO-04)          | `<app-etiquette variante="numerotee" numero="02">Section</app-etiquette>` | `variante` (`discrete`, par défaut, `accent`, `numerotee`, `puce`), `numero` (exigé par `numerotee`)                                   |
| En-tête de section (CO-16) | voir ci-dessous                                                           | `numero`, `etiquette`, `niveau` (`2` ou `3` : le titre est un `h2` ou un `h3`), `centre` (fin de page)                                 |
| Liste clé-valeur (CO-17)   | `<app-liste-cle-valeur [paires]="paires" />`                              | `variante` (`en-ligne`, par défaut, `tableau`), `paires`                                                                               |

**Pastille sur le verre.** Sur du verre (carte CO-05) et sur le halo d'un arrière-plan d'ambiance
(CO-13), seule la variante `contour` est permise ; la neutre et les teintées se posent sur un fond
uni, `couleur-fond` ou `couleur-surface` (sur le verre, une teintée tomberait à 3.60:1). Le trait
de l'étiquette numérotée est un élément à part, `etiquette__trait`, que le mouvement étirera
(MV-05).

**Gardes au rendu.** Une pastille sans mot, une étiquette numérotée sans numéro et un bouton à
icône seule sans libellé lèvent une erreur au rendu : au pré-rendu, le build échoue (voir
« Commandes »).

**En-tête de section.** Le titre est le contenu, rendu dans le `h2` ou le `h3` du niveau ;
l'étiquette numérotée reste hors du titre. Le chapô, facultatif, est un modèle `#chapo` : absent,
rien n'est rendu à sa place ; présent, il tient sur 68 caractères au plus par ligne.

```html
<app-entete-section
  numero="02"
  etiquette="Compétences"
  i18n-etiquette="@@competences.etiquette"
  [niveau]="2"
>
  <ng-container i18n="@@competences.titre">Compétences techniques</ng-container>
  <ng-template #chapo>
    <ng-container i18n="@@competences.chapo">Le chapô.</ng-container>
  </ng-template>
</app-entete-section>
```

**Liste clé-valeur.** Chaque paire est un `PaireCleValeur` : `cle`, `valeur` (texte déjà mis en
forme par la page) et `date`, vrai pour une date ou une période, écrite en police-mono. Une paire
dont la valeur manque, est nulle ou vide une fois les espaces retirés disparaît entière ; sans
aucune paire, aucune liste n'est rendue.

Les composants de formulaire et d'état servent au formulaire de contact et au CV indisponible. Leurs
seuls textes propres sont ceux que la charte leur donne, marqués pour la traduction : « Envoi en
cours… » (`@@commun.envoi-en-cours`), « Votre adresse e-mail » (`@@champ.indicatif-email`), « Ce
champ est obligatoire. » (`@@champ.erreur-obligatoire`) et « L’adresse e-mail n’est pas valide. »
(`@@champ.erreur-email`). Le reste vient de la page (`i18n-libelle`, `i18n-titre`, `i18n`).

| Composant                     | Se pose                                                                            | Entrées                                                                                                                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Champ (CO-10)                 | `<app-champ [champ]="formulaire.nom" libelle="Nom" [envoiTente]="envoiTente()" />` | `champ` (un champ de Signal Forms), `libelle`, `type` (`texte`, par défaut, `email`, `zone`), `aide`, `autocomplete` (`email` pour `email`), `envoiTente` (faux par défaut, vrai dès la première tentative d'envoi) |
| Message d'état (CO-11)        | voir ci-dessous                                                                    | `variante` (`information`, par défaut, `envoi`, `succes`, `echec`, `attention`), `titre`                                                                                                                            |
| Indicateur d'activité (CO-15) | `<app-indicateur-activite taille="grand" />`                                       | `taille` (`texte`, par défaut, `bouton`, `grand` : 32 px)                                                                                                                                                           |
| Bouton en cours (CO-01)       | `<button appBouton type="submit" [enCours]="envoi()">`                             | `enCours`                                                                                                                                                                                                           |

**Champ.** Il se lie au champ de Signal Forms par la directive `FormField` : la valeur, `required`
(règle `required()`) et `disabled` (règle `disabled()`, pendant l'envoi) viennent de l'état du
champ. Le formulaire porte `novalidate`, ou `[formRoot]`, qui le pose : les bulles du navigateur ne
remplacent jamais les messages. Le champ désactivé garde sa saisie, lisible, sur un bord pointillé.

**Quand une erreur s'affiche.** À l'envoi seulement (CO-01) : quand `envoiTente` est vrai et que le
champ est invalide pour Signal Forms. La page passe `envoiTente` à vrai à la première tentative
d'envoi (TK-41) ; si elle vide le formulaire, après un succès, elle le remet à faux, sans quoi les
champs vidés montreraient leur erreur. Quitter un champ ne suffit pas : Signal Forms le touche, mais
« touché » ne compte pas. Après une tentative, l'erreur suit l'état du champ : elle disparaît dès
qu'il devient valide. Un champ désactivé n'est pas validé et ne montre aucune erreur. Le message est
celui de la première erreur : la charte donne ceux de `required` et `email`, toute autre erreur
apporte le sien (`message`), sans quoi le rendu échoue. Le champ en faute porte
`aria-invalid="true"` et `aria-describedby` vers l'aide, puis vers l'erreur, affichée sous le champ
avec son icône. Mettre le focus sur le premier champ à corriger revient à la page
(`focusBoundControl()` de Signal Forms).

**Message d'état.** Il dit toujours ce qui se passe par une icône (l'indicateur pendant l'envoi), un
titre et un texte ; sans titre ou sans texte, il lève une erreur au rendu. Le texte est projeté, en
ligne ; un `button` projeté devient l'action, placée sous le texte ; un lien reste dans le texte.
L'échec s'annonce aussitôt (`role="alert"`) ; l'information, l'envoi en cours, le succès et
l'attention, poliment (`role="status"`). Le message ne disparaît jamais de lui-même : la page le
remplace (l'envoi en cours par le succès ou l'échec) ou le retire à la prochaine action.

```html
<app-message-etat variante="echec" titre="L’envoi a échoué" i18n-titre="@@contact.echec-titre">
  <ng-container i18n="@@contact.echec-texte">Votre saisie est conservée.</ng-container>
  <button appBouton variante="secondaire" (click)="reessayer()">
    <app-icone nom="reessayer" /><ng-container i18n="@@contact.reessayer">Réessayer</ng-container>
  </button>
</app-message-etat>
```

**Bouton en cours.** `enCours` garde l'aspect et le focus du bouton, sans l'attribut `disabled` :
l'indicateur et « Envoi en cours… » remplacent son contenu, il porte `aria-disabled="true"` et
annule tout clic, si bien que ni un clic, ni Entrée, ni Espace, ni l'envoi implicite du formulaire
ne relancent l'envoi. L'indicateur, décoratif, tourne en `duree-rotation` et reste fixe quand le
visiteur réduit les animations : le texte voisin dit toujours ce qu'on attend.

## Mouvement

Le socle du mouvement garantit qu'aucune animation ne cache jamais le contenu, ni sans script, ni
avec les animations réduites ; les motifs (MV-01 à MV-10) s'y branchent. Quatre classes sur `html` :

| Classe        | Posée par                                                                                            | Effet                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `mv-actif`    | le petit script de tête, si `(prefers-reduced-motion: no-preference)`                                | les états cachés des motifs existent                  |
| `mv-pret`     | `MouvementService`, une fois démarré                                                                 | l'application tourne : un motif peut révéler          |
| `mv-pause`    | le script de tête, si le stockage local `mv-pause` vaut `1` ; `MouvementService.basculerPause()`     | ce qui tourne en boucle est figé (MV-04)              |
| `mv-immediat` | `MouvementService`, deux images, au retour arrière (`back_forward`, `popstate`, cache du navigateur) | les transitions sont coupées : tout se pose d'un coup |

**Le petit script de tête**, dans le `head` de `src/index.html`, synchrone, avant toute feuille de
style, est le seul script en ligne du site. Son empreinte SHA-256 entre dans `script-src` de
`_headers` à chaque build (voir « Hébergement ») : une retouche n'exige qu'un nouveau build. **Le
repli des 3 s** : si `mv-pret` manque 3 s après lui (script principal bloqué, lent ou en erreur), il
retire `mv-actif` et tout s'affiche.

**La règle** : un état caché (opacité 0, translation de départ, trait non tracé…) ne s'écrit que
dans `src/styles/_mouvement.scss`, sous `.mv-actif`, dans le bloc
`@media (prefers-reduced-motion: no-preference)`, comme le défilement doux vers une ancre. Sous
`reduce`, toute transition et toute animation sont instantanées.

**Brancher un motif.** Sa directive injecte `MouvementService` (`src/app/services/mouvement/`) et
n'agit que dans `afterNextRender`, jamais au pré-rendu, et seulement si `actif()` est vrai. Elle lit
`modeArrivee()` (`immediat` : poser l'état final sans jouer), `enPause()` et `duree('delai-cascade')`
(jeton lu au démarrage, en ms ou en s ; un autre jeton s'ajoute à `JETONS_DUREE` de `reglages.ts`) ;
ses délais viennent des fonctions pures de `calculs.ts` (`delaiCascade` : 120 ms, puis 70 ms
d'écart, six au plus). Pour suivre le défilement, `DefilementService.abonner(appel)` (un seul
écouteur passif pour tout le site, un appel au plus par image) rend le désabonnement, à appeler à la
destruction.

**Les tests de bout en bout**, `e2e/mouvement.spec.ts`, dans les six profils : « sans JavaScript »
et « animations réduites » sur chaque page du build et chaque page d'erreur (`mv-actif` jamais
posé ; avec `reduce`, `scroll-behavior` à `auto`) ; « script principal bloqué » (`route.abort`) et
« script principal en erreur » sur `/` (`mv-actif` posé, puis retiré au plus 3 s après l'arrivée,
une seconde de marge comprise, jamais `mv-pret`) ; « animations permises » sur `/` (`mv-actif` et
`mv-pret`, gardés après le repli, défilement doux, aucune violation), aussi avec une pause mémorisée
et avec un stockage local indisponible. Les cinq cas vérifient que **tout le contenu est visible** par
`contenuCache(page)` (`e2e/support/contenu-visible.ts`), qui rend chaque élément de contenu caché
avec sa raison (opacité, `visibility`, `display`, boîte rognée à zéro, translation hors de sa
boîte) ; chaque écran l'emploie : `expect(await contenuCache(page)).toEqual([])`.

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

Chaque fichier se produit une fois avec fontTools et brotli, dans les versions qui ont produit ceux
du dépôt (`pip install fonttools==4.68.0 brotli==1.2.1`) :
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
`outils/finaliser-build.mjs` : `404.html`, `projets/404.html` et `cv/404.html`. Ce script y écrit
ensuite le fichier d'en-têtes de l'hébergeur, `_headers` (voir « Hébergement »).

## Hébergement

Le front est servi par les ressources statiques des Workers de Cloudflare, sans script Worker.
`wrangler.jsonc` ne déclare que le dossier `dist/front/browser/`, la page 404 la plus proche
(`not_found_handling` « 404-page », avec le statut 404) et les adresses sans barre finale
(`html_handling` « drop-trailing-slash » : `/parcours/` redirige en 307 vers `/parcours`). Wrangler,
l'outil de l'hébergeur, est une dépendance de développement à version fixe, télémétrie coupée
(`send_metrics`). Rien de propre à l'hébergeur n'entre dans `src/`.

**Réglages chez Cloudflare**, posés une fois par Alexandre en raccordant le dépôt :

| Réglage                    | Valeur                                                                      |
| -------------------------- | --------------------------------------------------------------------------- |
| Nom du Worker              | `portfolio-front`, le `name` de `wrangler.jsonc`, sans quoi le build échoue |
| Dossier racine             | `front/`                                                                    |
| Commande de build          | `npm run build`                                                             |
| Commande de déploiement    | celle par défaut, `npx wrangler deploy`                                     |
| Branche de production      | `main`                                                                      |
| Builds des autres branches | activés, avec la commande de préversion par défaut, `npx wrangler preview`  |
| Variable de build          | `PORTFOLIO_BASE_API_PREPRODUCTION`, une fois le back de préproduction créé  |

L'hébergeur installe lui-même les dépendances et construit sous Node 24.22.1, sa version par
défaut et celle de `.nvmrc`. Chaque branche a sa préversion, construite en préproduction ; celle de
`staging` est la préproduction du front. Son adresse, sur le domaine technique de l'hébergeur,
n'entre pas dans le dépôt.

**Le fichier d'en-têtes.** `outils/en-tetes.mjs` écrit `_headers` depuis
`hebergement/en-tetes.modele`, pour l'environnement du build :

- la politique de sécurité du contenu, dont `script-src` porte l'empreinte SHA-256 de chaque
  script en ligne exécutable des pages produites, calculée à chaque build, et `connect-src` la base
  de l'API, ou `'self'` seul quand elle est vide ;
- les autres en-têtes : `nosniff`, politique de référent, politique des permissions, interdiction
  du cadre et HTTPS obligatoire (HSTS) ; `X-Robots-Tag: noindex` hors production ; ni
  `upgrade-insecure-requests` ni HSTS en test et en développement, servis en HTTP ;
- un an de cache immuable pour `/*.js`, `/*.css` et `/polices/*` ; la politique retirée du seul
  fichier du CV, quand il est présent.

Le build échoue si une page porte un attribut de gestionnaire d'événement (`onload`, `onclick`…)
ou une adresse `javascript:`, qu'aucune empreinte n'autorise, ou si une ligne de `_headers` dépasse
2 000 caractères, la limite de l'hébergeur.

**Servir le build en local**, avec les règles de l'hébergeur :

```sh
PORTFOLIO_ENVIRONNEMENT=test npm run build
npm run serveur-local
```

Le site répond sur `http://localhost:8787`, avec la page 404 la plus proche, les redirections de
barre finale et les en-têtes de `_headers`, appliqués aussi aux réponses 404 : la spécification de
conformité du banc le vérifie (voir « Tests de bout en bout »). `serveur-local` lance `wrangler dev`
sans télémétrie (`WRANGLER_SEND_METRICS=false`) ni bandeau, dont la recherche de mise à jour
appellerait le registre de npm. L'état local de `wrangler dev` va dans `.wrangler/`, non versionné.

## Tests de bout en bout

Playwright contrôle le build de test pré-rendu, servi par `npm run serveur-local` sur
`http://localhost:8787`, l'origine que le build de test donne au site et au back (voir
« Environnements »). La configuration (`e2e/playwright.config.ts`) et les tests sont dans `e2e/`.

**Installer les navigateurs** de la version de Playwright du lockfile, à chaque montée de version :
`npx playwright install chromium firefox webkit`, avec `--with-deps` sur Linux pour les
bibliothèques système.

**Lancer le banc.** `npm run e2e` construit le build en environnement test, puis lance Playwright,
qui démarre et arrête lui-même le serveur local, sans jamais construire. Le port 8787 doit être
libre : un serveur déjà présent fait échouer le banc, au lieu de lui faire tester un autre build.
Les options de Playwright suivent `--`, par exemple `npm run e2e -- --project chromium-ordinateur`
ou `npm run e2e -- --grep "contrôle commun /parcours"` ; sur un build de test déjà fait,
`npx playwright test -c e2e/playwright.config.ts` suffit. Aucune nouvelle tentative : un test
instable est un défaut. Le rapport va dans `playwright-report/` (`npx playwright show-report`), les
traces des échecs dans `test-results/`, non versionnés.

| Profil                | Navigateur et appareil                                       | Fenêtre    |
| --------------------- | ------------------------------------------------------------ | ---------- |
| `chromium-ordinateur` | Chromium, Desktop Chrome                                     | 1280 × 720 |
| `firefox-ordinateur`  | Firefox, Desktop Firefox                                     | 1280 × 720 |
| `webkit-ordinateur`   | WebKit, Desktop Safari                                       | 1280 × 720 |
| `chromium-telephone`  | Chromium, émulation du Pixel 7                               | 412 × 839  |
| `webkit-telephone`    | WebKit, émulation de l'iPhone 15                             | 393 × 659  |
| `firefox-telephone`   | Firefox, taille de fenêtre seule : il n'émule pas l'appareil | 390 × 844  |

**Ce qui fait échouer le banc** :

- `conformite.spec.ts`, la spécification de conformité du serveur local : `/parcours` en 200 sans
  redirection, `/parcours/` en 307 vers `/parcours`, une adresse inconnue, un projet inconnu et le
  fichier du CV absent en 404 avec le contenu de leur `404.html`, et les en-têtes de la règle `/*`
  de `_headers`, politique de sécurité comprise, sur une page en 200 comme sur une 404. Elle passe
  sous Wrangler 4.155.0 : le serveur de repli prévu par le plan n'a pas lieu d'être.
- `controle-commun.spec.ts`, un test par adresse : chaque `index.html` du build, relevé à
  l'exécution (une page ajoutée est contrôlée sans rien écrire), et les trois pages d'erreur. Toute
  violation axe-core des règles A et AA (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`),
  nommée par sa règle et ses cibles ; tout défilement horizontal du document à 320, 600, 900, 1200,
  1600 ou 2560 px, dans chaque profil.
- La surveillance de `e2e/support/banc.ts`, sur chaque test qui ouvre une page : toute requête hors
  de `http://localhost:8787` (bloquée : aucun test ne sort sur le réseau), toute erreur de console,
  toute erreur non rattrapée, toute violation de la politique de sécurité. Seules excuses, chacune
  déclarée par le test avant la navigation : le « Failed to load resource » que Chromium et WebKit
  écrivent pour une réponse que le test attend en erreur, à son adresse exacte et avec ce code
  (`surveillance.attendreReponseEnErreur`), comme le document d'une page d'erreur en 404 ; une
  fois, la ligne « Failed to load resource: net::ERR_FAILED » de Chromium rattachée à l'adresse
  exacte d'une requête que le test abandonne (`attendreRequeteAbandonnee` ; Firefox et WebKit n'en
  font pas une erreur) ; une fois, l'erreur non rattrapée `Error` d'un message exact que le test
  fait lever (`attendreErreurDePage`).
- `mouvement.spec.ts`, le socle du mouvement (voir « Mouvement »).
- Un build qui n'est pas un build de test complet : sans build, `wrangler dev` ne démarre pas et le
  banc échoue sur son message ; sur un build sans aucune page, `/` répond 404 et le banc échoue au
  bout des 60 s d'attente du serveur ; sur le build d'un autre environnement que test, il échoue au
  chargement des fichiers de test (`exigerBuildDeTest`, dans `e2e/support/site.ts`).

**Le back simulé** (`e2e/support/back-simule.ts`) intercepte dans le navigateur
`POST /api/v1/form-tokens` (E-01) et `POST /api/v1/contact-messages` (E-02), et répond selon le
contrat d'API, en-têtes et corps compris ; aucune requête n'atteint un serveur. Scénarios :
`jeton-a-l-heure`, `jeton-en-retard` (réglage `retardJetonMs`, 2 000 ms par défaut),
`refus-de-validation` (réglage `validationErrors`), `indisponible` (503) et `absence-de-reponse`
(E-02 ne répond jamais : la page borne l'attente). `back-simule.spec.ts` éprouve chacun par un
appel depuis une page du site.

**Les scénarios d'un écran** vont dans `e2e/<écran>.spec.ts`. Ils importent `test` et `expect` de
`./support/banc`, pour hériter de la surveillance, et posent le back simulé avant la navigation :

```ts
import { expect, test } from './support/banc';

test('contact : envoi réussi', async ({ page, backSimule }) => {
  const recues = await backSimule('jeton-a-l-heure');
  await page.goto('/contact');
  // Remplir, envoyer, puis vérifier l'état affiché et les requêtes reçues (recues).
});
```

**Dans la CI**, le travail `e2e` de `.github/workflows/ci.yml` lance le banc sur chaque PR, sans
filtre de chemins, comme `front` et `back` : `npm ci`, les navigateurs, `npm run e2e` ; sur échec,
le rapport de Playwright est gardé en artefact (`playwright-report`, 14 jours). Il est à rendre
exigé dans la protection de `staging`, réglage de GitHub, après la fusion de la PR qui le crée.

## Langue

Internationalisation intégrée d'Angular : langue source française (`i18n.sourceLocale` « fr »
dans `angular.json`), aucune autre langue. Chaque libellé d'interface porte l'attribut `i18n`
avec un identifiant personnalisé, de la forme `@@zone.element`.
