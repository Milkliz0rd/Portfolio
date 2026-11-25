import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { NavigationService } from '../../services/navigation/navigation';
import { Accueil } from './accueil/accueil';
import { Parcours } from './parcours/parcours';

/**
 * La page principale (PF-06) : la section accueil en haut, sans ancre, porteuse du seul titre de
 * niveau 1, puis les cinq sections, chacune dans un élément section, enfant direct de la page, dont
 * l'id est son ancre, nommée par son titre. Aucune n'est différée : chaque ancre est dans le
 * document pré-rendu. Les cinq sections sont encore des emplacements étiquetés, sans contenu, que
 * les sections réelles remplacent une à une.
 */
@Component({
  imports: [Accueil, Parcours],
  selector: 'app-principale',
  styleUrl: './principale.scss',
  templateUrl: './principale.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Principale {
  constructor() {
    // Après le premier rendu, dans le navigateur seulement, la page inscrit ses sections auprès de
    // services/navigation, qui suit la section lue ; elle les retire quand on la quitte. Ses seuls
    // enfants directs : les régions de l'accueil, qui le précèdent, n'en sont pas.
    const navigation = inject(NavigationService);
    const page = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destruction = inject(DestroyRef);
    afterNextRender(() => {
      destruction.onDestroy(
        navigation.inscrire([...page.querySelectorAll<HTMLElement>(':scope > section')]),
      );
    });
  }
}
