import { Routes } from '@angular/router';
import { projetExiste } from './guards/projet-existe';
import type { VarianteErreur } from './pages/erreur/erreur';
import { Principale } from './pages/principale/principale';
import { Provisoire } from './pages/provisoire/provisoire';

// Les pages du site (PF-06) : la page principale provisoire, dont les sections sont des éléments à
// leurs ancres, jamais des routes, puis les pages à part : une page provisoire tant que la sienne
// n'est pas faite, chaque page faite dans son morceau de code, chargé à la demande (PF-02).
// data.section désigne l'entrée de navigation signalée ; la page principale n'en a pas (la section
// lue la donnera), les mentions légales et les routes d'erreur non plus. data.variante choisit la
// page introuvable.
const erreur = () => import('./pages/erreur/erreur').then((m) => m.Erreur);

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Principale },
  // Avant « projets/:id » : l'identifiant de projet « 404 » est réservé (PF-02).
  {
    path: 'projets/404',
    loadComponent: erreur,
    data: { variante: 'projet-inexistant' satisfies VarianteErreur },
  },
  // Un identifiant inconnu des fichiers de contenu ne correspond pas : il va jusqu'à « ** ».
  {
    path: 'projets/:id',
    component: Provisoire,
    canMatch: [projetExiste],
    data: { section: 'projets', ecran: "EC-07 Fiche d'un projet" },
  },
  { path: 'contact', component: Provisoire, data: { section: 'contact', ecran: 'EC-09 Contact' } },
  // Les mentions légales, sans data.section : aucune entrée signalée (PF-06).
  {
    path: 'mentions-legales',
    loadComponent: () =>
      import('./pages/mentions-legales/mentions-legales').then((m) => m.MentionsLegales),
  },
  {
    path: '404',
    loadComponent: erreur,
    data: { variante: 'adresse-inconnue' satisfies VarianteErreur },
  },
  // Toute autre adresse, rendue dans le navigateur : la variante vient de l'adresse.
  { path: '**', loadComponent: erreur },
];
