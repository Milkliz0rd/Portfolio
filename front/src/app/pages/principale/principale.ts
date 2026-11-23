import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { NavigationService } from '../../services/navigation/navigation';

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
export class Principale {
  constructor() {
    // Après le premier rendu, dans le navigateur seulement, la page inscrit ses sections auprès de
    // services/navigation, qui suit la section lue ; elle les retire quand on la quitte.
    const navigation = inject(NavigationService);
    const page = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destruction = inject(DestroyRef);
    afterNextRender(() => {
      destruction.onDestroy(navigation.inscrire([...page.querySelectorAll('section')]));
    });
  }
}
