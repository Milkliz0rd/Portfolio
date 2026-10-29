// Outils communs des services de lecture du contenu (PF-02).

/**
 * Ramène une valeur fermée du contenu à son type. Une valeur inconnue lève une erreur, qui fait
 * échouer le pré-rendu de la page qui la lit, donc le build.
 */
export function valeurFermee<T extends string>(
  valeurs: readonly T[],
  valeur: string,
  champ: string,
) {
  const connue = valeurs.find((permise) => permise === valeur);
  if (connue === undefined) {
    throw new Error(`${champ} : « ${valeur} » inconnu, attendu ${valeurs.join(', ')}`);
  }
  return connue;
}

/** Une copie de la liste, par rang croissant. */
export function parRang<T extends { readonly rang: number }>(elements: readonly T[]): T[] {
  return [...elements].sort((a, b) => a.rang - b.rang);
}
