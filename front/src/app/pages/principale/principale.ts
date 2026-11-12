import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * La page principale provisoire (PF-06) : l'accueil en haut, sans ancre, porteur du seul titre de
 * niveau 1, puis les cinq sections, chacune dans un élément section dont l'id est son ancre, nommée
 * par son titre. Aucune n'est différée : chaque ancre est dans le document pré-rendu. Des
 * emplacements étiquetés, sans contenu, que les sections réelles remplacent une à une.
 */
@Component({
  imports: [],
  selector: 'app-principale',
  styleUrl: './principale.scss',
  templateUrl: './principale.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'conteneur-standard' },
})
export class Principale {}
