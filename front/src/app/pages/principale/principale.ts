import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { Ambiance } from '../../components/ambiance/ambiance';
import { NavigationService } from '../../services/navigation/navigation';
import { Accueil } from './accueil/accueil';
import { Competences } from './competences/competences';
import { Experience } from './experience/experience';
import { Parcours } from './parcours/parcours';

/**
 * La page principale (PF-06) : la section accueil en haut, sans ancre, porteuse du seul titre de
 * niveau 1, puis les cinq sections, chacune dans un élément section, enfant direct de la page, dont
 * l'id est son ancre, nommée par son titre. Aucune n'est différée : chaque ancre est dans le
 * document pré-rendu. Parcours (TK-34), Compétences (TK-35) et Expérience (TK-36) sont posées
 * dans leur élément section ; les deux autres sont encore des emplacements étiquetés, que les
 * sections réelles remplacent une à une. Chaque section s'ouvre sur l'arrière-plan d'ambiance d'une section, à
 * l'intérieur de son élément section : le halo s'étend sur toute la largeur de la page, le
 * contenu se range dans le conteneur large (charte, section 5).
 */
@Component({
  imports: [Ambiance, Accueil, Parcours, Competences, Experience],
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
