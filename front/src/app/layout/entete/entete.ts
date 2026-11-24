import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Bouton } from '../../components/bouton/bouton';
import { Lien } from '../../components/lien/lien';
import { LectureProfil } from '../../services/contenu/profil';
import { NavigationService } from '../../services/navigation/navigation';
import { MenuReplie } from '../menu-replie/menu-replie';
import { entreesNavigation } from './entrees';

/**
 * L'en-tête (CO-06), collant, sur toutes les pages : la marque, qui mène en haut de la page
 * principale ; la navigation complète à partir de 1200 px, une entrée par section, liens du
 * routeur vers / avec l'ancre de leur section ; « Contact », bouton primaire compact, toujours
 * visible, jamais dans un menu. L'entrée signalée et son aria-current viennent de
 * services/navigation (PF-06) ; seule l'entrée courante porte le repère, un élément propre. Depuis
 * la page principale, ses liens vers elle-même remplacent l'entrée d'historique (replaceUrl). Sous
 * 1200 px, le menu replié (CO-07) prend la place de la navigation complète, après « Contact », qui
 * reste hors du menu.
 */
@Component({
  selector: 'app-entete',
  imports: [RouterLink, Lien, Bouton, MenuReplie],
  templateUrl: './entete.html',
  styleUrl: './entete.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Entete {
  protected readonly entrees = entreesNavigation();

  protected readonly navigation = inject(NavigationService);
  protected readonly nom = inject(LectureProfil).profil.nom;
}
