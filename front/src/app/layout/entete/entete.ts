import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Bouton } from '../../components/bouton/bouton';
import { Lien } from '../../components/lien/lien';
import { LectureProfil } from '../../services/contenu/profil';
import { type Entree, NavigationService } from '../../services/navigation/navigation';

/** Une entrée de la navigation : son nom, l'ancre de sa section, son libellé. */
interface EntreeNavigation {
  entree: Entree;
  ancre?: string;
  libelle: string;
}

/**
 * L'en-tête (CO-06), collant, sur toutes les pages : la marque, qui mène en haut de la page
 * principale ; la navigation complète à partir de 1200 px, une entrée par section, liens du
 * routeur vers / avec l'ancre de leur section ; « Contact », bouton primaire compact, toujours
 * visible, jamais dans un menu. L'entrée signalée et son aria-current viennent de
 * services/navigation (PF-06) ; seule l'entrée courante porte le repère, un élément propre. Depuis
 * la page principale, ses liens vers elle-même remplacent l'entrée d'historique (replaceUrl). Le
 * bouton de menu, sous 1200 px, vient avec le menu replié (TK-29).
 */
@Component({
  selector: 'app-entete',
  imports: [RouterLink, Lien, Bouton],
  templateUrl: './entete.html',
  styleUrl: './entete.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Entete {
  protected readonly entrees: readonly EntreeNavigation[] = [
    { entree: 'accueil', libelle: $localize`:@@entete.accueil:Accueil` },
    { entree: 'parcours', ancre: 'parcours', libelle: $localize`:@@entete.parcours:Parcours` },
    {
      entree: 'competences',
      ancre: 'competences',
      libelle: $localize`:@@entete.competences:Compétences`,
    },
    {
      entree: 'experience',
      ancre: 'experience',
      libelle: $localize`:@@entete.experience:Expérience`,
    },
    // « Méthode », et non « Méthode de travail » : choix C8.
    { entree: 'methode', ancre: 'methode', libelle: $localize`:@@entete.methode:Méthode` },
    { entree: 'projets', ancre: 'projets', libelle: $localize`:@@entete.projets:Projets` },
  ];

  protected readonly navigation = inject(NavigationService);
  protected readonly nom = inject(LectureProfil).profil.nom;
}
