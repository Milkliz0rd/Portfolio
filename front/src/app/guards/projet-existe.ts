import { inject } from '@angular/core';
import type { CanMatchFn } from '@angular/router';
import { LectureProjets } from '../services/contenu/projets';

/**
 * La garde de la fiche d'un projet (PF-06), sur « projets/:id » : la route ne correspond qu'à un
 * identifiant des fichiers de contenu, lu par LectureProjets dans l'index généré, jamais dans une
 * liste écrite ici. Pour un identifiant inconnu, le routeur passe aux routes suivantes, jusqu'à
 * « ** », la page introuvable, variante « projet-inexistant » : ni redirection ni étape
 * d'historique, l'adresse demandée reste affichée, et sans data.section, aucune entrée n'est
 * signalée, même une fois l'application démarrée.
 */
export const projetExiste: CanMatchFn = (_route, segments) => {
  const identifiant = segments[1]?.path;
  return identifiant !== undefined && inject(LectureProjets).trouver(identifiant) !== undefined;
};
