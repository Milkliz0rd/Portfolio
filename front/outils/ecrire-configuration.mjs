// Écrit src/configuration/configuration.genere.ts (PF-07), non versionné, avant chaque build, test,
// analyse, extraction des libellés et serveur de développement : l'environnement, la base de l'API
// du back, sans barre finale, et l'origine canonique du site. Les adresses publiques viennent de
// src/configuration/adresses-publiques.json ; ce qui ne s'écrit pas dans le dépôt vient des
// variables d'environnement, complétées sur le poste par front/.env.local (non versionné).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseEnv } from 'node:util';

export const ENVIRONNEMENTS = ['developpement', 'test', 'preproduction', 'production'];
// En test, le site et le back simulé sont servis sur une seule origine, celle du serveur local
// (PF-08) : l'adresse par défaut de wrangler dev.
export const ORIGINE_LOCALE_TEST = 'http://localhost:8787';

const hote = '[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*';
// Une origine HTTPS : le schéma et l'hôte, rien d'autre (ni port, ni chemin, ni barre finale).
const originesHttps = new RegExp(`^https://${hote}$`);
// Sur le poste, le back local peut être en HTTP et sur un port.
const originesLocales = new RegExp(`^https?://${hote}(:\\d{1,5})?$`);

function verifier(valeur, motif, nom) {
  if (!motif.test(valeur)) {
    const attendu = motif === originesHttps ? 'une origine HTTPS (schéma et hôte)' : 'une origine';
    throw new Error(`${nom} doit être ${attendu}, sans barre finale : « ${valeur} »`);
  }
  return valeur;
}

/**
 * PORTFOLIO_ENVIRONNEMENT d'abord ; chez l'hébergeur, qui pose la branche construite
 * (WORKERS_CI_BRANCH) en plus de CI, production pour main et préproduction sinon ; test dans la CI
 * et pour les tests ; développement sur le poste.
 */
export function deduireEnvironnement(variables, pourLesTests = false) {
  const choisi = variables.PORTFOLIO_ENVIRONNEMENT;
  if (choisi) {
    if (!ENVIRONNEMENTS.includes(choisi)) {
      throw new Error(`PORTFOLIO_ENVIRONNEMENT inconnu : « ${choisi} » (${ENVIRONNEMENTS})`);
    }
    return choisi;
  }
  if (variables.WORKERS_CI_BRANCH) {
    return variables.WORKERS_CI_BRANCH === 'main' ? 'production' : 'preproduction';
  }
  return (variables.CI && variables.CI !== 'false') || pourLesTests ? 'test' : 'developpement';
}

/** Les trois valeurs de l'environnement, et les avertissements à écrire dans le journal. */
export function deduireConfiguration(variables, adresses, pourLesTests = false) {
  const environnement = deduireEnvironnement(variables, pourLesTests);
  const origineSite = verifier(adresses.origineSite, originesHttps, 'origineSite');
  const baseApiProduction = verifier(
    adresses.baseApiProduction,
    originesHttps,
    'baseApiProduction',
  );
  const avertissements = [];
  if (environnement === 'test') {
    return {
      environnement,
      baseApi: ORIGINE_LOCALE_TEST,
      origineSite: ORIGINE_LOCALE_TEST,
      avertissements,
    };
  }
  let baseApi = '';
  if (environnement === 'production') {
    baseApi = baseApiProduction;
  } else if (environnement === 'preproduction') {
    const valeur = variables.PORTFOLIO_BASE_API_PREPRODUCTION;
    if (valeur) {
      baseApi = verifier(valeur, originesHttps, 'PORTFOLIO_BASE_API_PREPRODUCTION');
    } else {
      // Facultative jusqu'au client du contrat d'API (TK-42), qui la rendra obligatoire.
      avertissements.push(
        "PORTFOLIO_BASE_API_PREPRODUCTION absente : build de préproduction sans adresse du back (baseApi vide, connect-src réduit à 'self').",
      );
    }
  } else if (variables.PORTFOLIO_BASE_API) {
    baseApi = verifier(variables.PORTFOLIO_BASE_API, originesLocales, 'PORTFOLIO_BASE_API');
  }
  return { environnement, baseApi, origineSite, avertissements };
}

/** Le texte du fichier généré, déjà dans la forme de Prettier ; les valeurs sont typées larges. */
export function texteConfiguration({ environnement, baseApi, origineSite }) {
  return [
    '// Écrit par outils/ecrire-configuration.mjs (PF-07) : ni à modifier, ni à versionner.',
    `export type Environnement = ${ENVIRONNEMENTS.map((e) => `'${e}'`).join(' | ')};`,
    `export const environnement = '${environnement}' as Environnement;`,
    `export const baseApi = '${baseApi}' as string;`,
    `export const origineSite = '${origineSite}' as string;`,
    '',
  ].join('\n');
}

/** La configuration de <racine> (front/), sans rien écrire : finaliser-build.mjs la relit. */
export function lireConfiguration(racine, variablesRecues, pourLesTests = false) {
  const fichierLocal = join(racine, '.env.local');
  const locales = existsSync(fichierLocal) ? parseEnv(readFileSync(fichierLocal, 'utf8')) : {};
  const variables = { ...locales, ...variablesRecues };
  const chemin = join(racine, 'src', 'configuration', 'adresses-publiques.json');
  return deduireConfiguration(variables, JSON.parse(readFileSync(chemin, 'utf8')), pourLesTests);
}

/** Écrit configuration.genere.ts dans <racine>/src/configuration/ ; rend la configuration. */
export function ecrireConfiguration(racine, variables, pourLesTests = false) {
  const configuration = lireConfiguration(racine, variables, pourLesTests);
  const fichier = join(racine, 'src', 'configuration', 'configuration.genere.ts');
  writeFileSync(fichier, texteConfiguration(configuration));
  return { ...configuration, fichier };
}

if (import.meta.main) {
  const racine = join(import.meta.dirname, '..');
  const pourLesTests = process.argv.includes('--tests');
  const { environnement, baseApi, avertissements, fichier } = ecrireConfiguration(
    racine,
    process.env,
    pourLesTests,
  );
  avertissements.forEach((texte) => console.warn(`Avertissement : ${texte}`));
  console.log(
    `Configuration écrite : ${relative(racine, fichier)} (${environnement}, baseApi « ${baseApi} »)`,
  );
}
