// Contrôle du contenu (PF-02, TK-28) : la structure de chaque fichier de contenu lu, puis chaque
// règle ; une faute est une ligne (fichier, champ, règle). Un emplacement étiqueté est un
// avertissement en mode staging, une erreur en mode main.
import { emplacements, parcourir } from './structure.mjs';

/** Les règles, une par fonction : chacune reçoit le contenu lu et rend ses fautes. */
const REGLES = [emplacements];

const parFichier = (a, b) => (a.fichier < b.fichier ? -1 : a.fichier > b.fichier ? 1 : 0);

/**
 * Les fautes de documents lus ({ nom, fichier, forme, donnees }), rangées par fichier : leur
 * structure, puis chaque règle. contexte : { mode, racine }, racine étant le dossier de public/.
 */
export function controlerDocuments(documents, contexte) {
  const sortie = { fautes: [], feuilles: [] };
  for (const { fichier, donnees, forme } of documents) {
    parcourir(fichier, donnees, forme, '', sortie);
  }
  const lu = { ...contexte, documents, feuilles: sortie.feuilles };
  return [...sortie.fautes, ...REGLES.flatMap((regle) => regle(lu))].sort(parFichier);
}
