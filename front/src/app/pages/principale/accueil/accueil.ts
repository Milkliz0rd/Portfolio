import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ambiance } from '../../../components/ambiance/ambiance';
import { Bouton } from '../../../components/bouton/bouton';
import { Etiquette } from '../../../components/etiquette/etiquette';
import { Icone } from '../../../components/icone/icone';
import { CartesSections } from '../../../fragments/cartes-sections/cartes-sections';
import { ProfilCode } from '../../../fragments/profil-code/profil-code';
import { LectureAccueil } from '../../../services/contenu/accueil';
import { LectureProfil } from '../../../services/contenu/profil';

/**
 * La section accueil, en haut de la page principale, sans ancre ni numéro (MF-01, MF-02). Dans
 * l'ordre de lecture : le nom (profil.json), seul titre de niveau 1 de la page, en affiche ;
 * l'intitulé ; la courte présentation (accueil.json, C-06) ; un seul bouton mis en avant, vers le
 * contact ; puis les cartes des cinq sections. L'ouverture est posée sur l'arrière-plan d'ambiance
 * d'accueil (CO-13), avec la fenêtre « profil.ts » à côté du texte à partir de 1200 px, dessous en
 * deçà, absente sous 600 px (choix C3). Les cartes sont hors de l'ambiance, sur le fond uni : une
 * carte interactive ne se pose jamais sur un halo (CO-05). Statique : la cascade, l'écriture et le
 * titre révélé viendront avec le mouvement (TK-48, TK-54).
 */
@Component({
  selector: 'app-accueil',
  imports: [Ambiance, Bouton, CartesSections, Etiquette, Icone, ProfilCode, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accueil {
  protected readonly profil = inject(LectureProfil).profil;
  protected readonly presentation = inject(LectureAccueil).accueil.presentation;
}
