import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { origineSite } from '../../../configuration/configuration.genere';
import { Etiquette } from '../../components/etiquette/etiquette';
import { Lien } from '../../components/lien/lien';
import { LectureProfil } from '../../services/contenu/profil';
import { cheminDe } from '../../services/navigation/navigation';

/** Le chemin des mentions légales, que désigne le lien du pied. */
const MENTIONS_LEGALES = '/mentions-legales';

/** Le nom de domaine d'une origine, sans « www. » : celui que signe le pied de page. */
export function domaineDe(origine: string): string {
  return new URL(origine).hostname.replace(/^www\./, '');
}

/**
 * Le pied de page (CO-08), sur toutes les pages, après le contenu principal ; jamais dans une
 * animation d'arrivée (MV-01) : aucune classe ni directive du mouvement. Rangée haute : la marque,
 * puis les profils GitHub et LinkedIn lus dans le profil (MF-17), liens discrets et externes,
 * aucun lien vers X. Rangée basse : la signature, le nom de domaine tiré d'origineSite (PF-07),
 * sans année (MF-18) ; le lien des mentions légales, lien du routeur (MF-19), que suivra le bouton
 * de pause des animations (TK-50).
 */
@Component({
  selector: 'app-pied',
  imports: [RouterLink, Lien, Etiquette],
  templateUrl: './pied.html',
  styleUrl: './pied.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pied {
  protected readonly profil = inject(LectureProfil).profil;
  protected readonly domaine = domaineDe(origineSite);

  private readonly routeur = inject(Router);

  /**
   * Sur /mentions-legales, le lien du pied désigne la page affichée (aria-current="page",
   * annotation de la maquette EC-10), dès le pré-rendu, d'après la dernière navigation finie.
   */
  protected readonly surMentionsLegales = toSignal(
    this.routeur.events.pipe(
      filter((evenement) => evenement instanceof NavigationEnd),
      map((evenement) => cheminDe(evenement.urlAfterRedirects) === MENTIONS_LEGALES),
    ),
    { initialValue: cheminDe(this.routeur.url) === MENTIONS_LEGALES },
  );
}
