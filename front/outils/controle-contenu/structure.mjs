// Structure du contenu (PF-02) : chaque fichier parcouru selon sa forme (modele.mjs), pour les
// champs obligatoires présents et non vides, aucun champ hors du modèle et des valeurs fermées
// connues. Le parcours rend aussi chaque texte lu, avec son genre, aux règles des textes.

/**
 * Un contenu encore à fournir, où qu'il soit dans le texte : « [C-xx — description] », ou toute
 * autre marque entre crochets autour d'un tiret cadratin (« [texte à valider — D-10] »).
 */
export const EMPLACEMENT = /\[(?:C-\d+[^\]]*|[^\][]*\s—\s[^\][]*)\]/;

export const etiquete = (valeur) => typeof valeur === 'string' && EMPLACEMENT.test(valeur);

/** Une faute : une ligne de la sortie (fichier, champ, règle), en erreur sauf mention contraire. */
export const faute = (fichier, champ, regle, detail = '') => ({
  gravite: 'erreur',
  fichier,
  champ,
  regle,
  detail,
});

const sousChamp = (champ, nom) => (champ ? `${champ}.${nom}` : nom);
const estObjet = (valeur) =>
  typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur);

/**
 * Parcourt une valeur selon sa forme : rend ses fautes de structure, et ses textes et ses nombres
 * en feuilles ({ fichier, champ, valeur, genre }). Un champ étiqueté devient une feuille
 * « emplacement » et n'est soumis qu'à la règle des emplacements, quelle que soit sa forme.
 */
export function parcourir(fichier, valeur, forme, champ, sortie) {
  const signaler = (regle, detail) => sortie.fautes.push(faute(fichier, champ, regle, detail));
  if (etiquete(valeur)) {
    sortie.feuilles.push({ fichier, champ, valeur, genre: 'emplacement' });
  } else if (forme.ouVide) {
    if (!Array.isArray(valeur) || valeur.length > 0) {
      parcourir(fichier, valeur, forme.ouVide, champ, sortie);
    }
  } else if (Array.isArray(forme)) {
    if (!Array.isArray(valeur)) signaler('type de champ', 'liste attendue');
    else if (valeur.length === 0) signaler('champ vide', 'liste vide');
    else valeur.forEach((v, i) => parcourir(fichier, v, forme[0], `${champ}[${i}]`, sortie));
  } else if (forme instanceof Set) {
    if (!forme.has(valeur)) {
      signaler('valeur inconnue', `« ${valeur} », attendu ${[...forme].join(', ')}`);
    }
  } else if (typeof forme === 'object') {
    if (estObjet(valeur)) parcourirObjet(fichier, valeur, forme, champ, sortie);
    else signaler('type de champ', 'objet attendu');
  } else if (forme === 'nombre') {
    if (typeof valeur === 'number') sortie.feuilles.push({ fichier, champ, valeur, genre: forme });
    else signaler('type de champ', 'nombre attendu');
  } else if (typeof valeur !== 'string') {
    signaler('type de champ', 'texte attendu');
  } else if (valeur.trim() === '') {
    signaler('champ vide');
  } else {
    sortie.feuilles.push({ fichier, champ, valeur, genre: forme });
  }
}

/** Les champs de la forme, obligatoires sauf « ? », puis ceux de la valeur que la forme ignore. */
function parcourirObjet(fichier, valeur, forme, champ, sortie) {
  for (const [cle, sousForme] of Object.entries(forme)) {
    const nom = cle.replace(/\?$/, '');
    if (Object.hasOwn(valeur, nom)) {
      parcourir(fichier, valeur[nom], sousForme, sousChamp(champ, nom), sortie);
    } else if (!cle.endsWith('?')) {
      sortie.fautes.push(faute(fichier, sousChamp(champ, nom), 'champ obligatoire absent'));
    }
  }
  for (const nom of Object.keys(valeur)) {
    if (!Object.hasOwn(forme, nom) && !Object.hasOwn(forme, `${nom}?`)) {
      sortie.fautes.push(faute(fichier, sousChamp(champ, nom), 'champ hors du modèle'));
    }
  }
}

/** Règle des emplacements : un avertissement en mode staging, une erreur en mode main. */
export function emplacements({ feuilles, mode }) {
  return feuilles
    .filter(({ genre }) => genre === 'emplacement')
    .map(({ fichier, champ, valeur }) => ({
      ...faute(fichier, champ, 'emplacement étiqueté', `« ${valeur.match(EMPLACEMENT)[0]} »`),
      gravite: mode === 'main' ? 'erreur' : 'avertissement',
    }));
}
