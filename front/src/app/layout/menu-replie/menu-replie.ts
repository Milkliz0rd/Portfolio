import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icone } from '../../components/icone/icone';
import { Lien } from '../../components/lien/lien';
import { NavigationService } from '../../services/navigation/navigation';
import { entreesNavigation } from '../entete/entrees';

/**
 * Le menu replié (CO-07), sur details et summary : il s'ouvre et se ferme par son bouton avant le
 * démarrage de l'application et sans script, et ses entrées sont de vrais liens. Le résumé est le
 * bouton icône (trois traits, croix une fois ouvert), au libellé masqué « Menu » ; le navigateur
 * annonce son état, et aria-controls nomme le panneau qu'il commande. Le panneau liste les entrées
 * de la navigation complète (la même liste), mêmes liens du routeur, même replaceUrl sur la page
 * principale, même entrée signalée, qui porte son propre repère (fond et barre), sans nom de
 * transition de vue (PF-04). Ce n'est pas une fenêtre modale : la page reste accessible.
 * L'attribut open n'est jamais lié : un panneau ouvert avant le démarrage le reste après.
 */
@Component({
  selector: 'app-menu-replie',
  imports: [RouterLink, Lien, Icone],
  templateUrl: './menu-replie.html',
  styleUrl: './menu-replie.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuReplie {
  protected readonly entrees = entreesNavigation();
  /** L'id du panneau, que nomme l'aria-controls du bouton : un seul menu par page. */
  protected readonly idPanneau = 'menu-replie-panneau';

  protected readonly navigation = inject(NavigationService);
}
