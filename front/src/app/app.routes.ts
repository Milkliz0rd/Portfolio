import { Routes } from '@angular/router';
import { Principale } from './pages/principale/principale';
import { Provisoire } from './pages/provisoire/provisoire';

// Les pages du site (PF-06) : la page principale provisoire, dont les sections sont des éléments à
// leurs ancres, jamais des routes, puis les pages à part : une page provisoire tant que la sienne
// n'est pas faite, chaque page faite dans son morceau de code, chargé à la demande (PF-02).
// data.section désigne l'entrée de navigation signalée ; la page principale n'en a pas (la section
// lue la donnera), les mentions légales et les routes d'erreur non plus. data.variante choisit la
// page introuvable.
export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Principale },
  {
    path: 'projets/404',
    component: Provisoire,
    data: { variante: 'projet-inexistant', ecran: 'EC-11 Page introuvable' },
  },
  {
    path: 'projets/:id',
    component: Provisoire,
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
    component: Provisoire,
    data: { variante: 'adresse-inconnue', ecran: 'EC-11 Page introuvable' },
  },
  { path: '**', component: Provisoire, data: { ecran: 'EC-11 Page introuvable' } },
];
