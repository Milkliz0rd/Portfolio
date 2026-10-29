import { RenderMode, ServerRoute } from '@angular/ssr';
import { contenuProjets } from '../contenu/contenu-langue';

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
    // Une fiche par fichier de src/contenu/<langue>/projets/, lu dans l'index généré (PF-02).
    getPrerenderParams: () =>
      Promise.resolve(contenuProjets.map(({ identifiant }) => ({ id: identifiant }))),
  },
  { path: '**', renderMode: RenderMode.Client },
];
