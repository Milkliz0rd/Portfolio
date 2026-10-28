import { RenderMode, ServerRoute } from '@angular/ssr';

// Toutes les adresses sont pré-rendues ; seule « ** » est rendue dans le navigateur (PF-06).
const prerendues = [
  '',
  'parcours',
  'competences',
  'experience',
  'methode',
  'projets',
  'projets/404',
  'cv',
  'cv/404',
  'contact',
  'mentions-legales',
  '404',
];

export const serverRoutes: ServerRoute[] = [
  ...prerendues.map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
  {
    path: 'projets/:id',
    renderMode: RenderMode.Prerender,
    // Le seul projet tant que l'index des projets n'existe pas (étape 7 du plan front).
    getPrerenderParams: () => Promise.resolve([{ id: 'portfolio' }]),
  },
  { path: '**', renderMode: RenderMode.Client },
];
