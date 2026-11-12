import { Routes } from '@angular/router';
import { Principale } from './pages/principale/principale';
import { Provisoire } from './pages/provisoire/provisoire';

// La page principale provisoire, puis une page provisoire par adresse du parcours d'écrans,
// remplacée écran par écran. data.section désigne l'entrée de navigation signalée ; la page
// principale n'en a pas (la section lue la donnera), les routes d'erreur non plus (PF-06).
export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Principale },
  {
    path: 'parcours',
    component: Provisoire,
    data: { section: 'parcours', ecran: 'EC-02 Parcours' },
  },
  {
    path: 'competences',
    component: Provisoire,
    data: { section: 'competences', ecran: 'EC-03 Compétences' },
  },
  {
    path: 'experience',
    component: Provisoire,
    data: { section: 'experience', ecran: 'EC-04 Expérience' },
  },
  {
    path: 'methode',
    component: Provisoire,
    data: { section: 'methode', ecran: 'EC-05 Méthode de travail' },
  },
  {
    path: 'projets',
    component: Provisoire,
    data: { section: 'projets', ecran: 'EC-06 Liste des projets' },
  },
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
  { path: 'cv', component: Provisoire, data: { section: 'cv', ecran: 'EC-08 CV' } },
  {
    path: 'cv/404',
    component: Provisoire,
    data: { variante: 'cv-indisponible', ecran: 'EC-11 Page introuvable' },
  },
  { path: 'contact', component: Provisoire, data: { section: 'contact', ecran: 'EC-09 Contact' } },
  {
    path: 'mentions-legales',
    component: Provisoire,
    data: { section: null, ecran: 'EC-10 Mentions légales' },
  },
  {
    path: '404',
    component: Provisoire,
    data: { variante: 'adresse-inconnue', ecran: 'EC-11 Page introuvable' },
  },
  { path: '**', component: Provisoire, data: { ecran: 'EC-11 Page introuvable' } },
];
