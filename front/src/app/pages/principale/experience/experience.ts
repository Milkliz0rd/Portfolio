import { ChangeDetectionStrategy, Component, inject, LOCALE_ID } from '@angular/core';
import { Ambiance } from '../../../components/ambiance/ambiance';
import { Carte } from '../../../components/carte/carte';
import { EnteteSection } from '../../../components/entete-section/entete-section';
import { Etiquette } from '../../../components/etiquette/etiquette';
import {
  ListeCleValeur,
  type PaireCleValeur,
} from '../../../components/liste-cle-valeur/liste-cle-valeur';
import { MessageEtat } from '../../../components/message-etat/message-etat';
import type { Experience as ContenuExperience } from '../../../interfaces/contenu';
import { LectureExperience } from '../../../services/contenu/experience';
import { formaterPeriode } from '../../../services/contenu/lecture/periode';

/**
 * Les faits de l'alternance, sous le titre (choix C6) : l'entreprise et la période, telles que
 * experience.json les donne, jamais écrites en dur ; la période mise en forme par formaterPeriode
 * dans la langue de l'application, jamais calculée depuis la date du jour (MF-18), en chasse fixe.
 */
function faitsDeLAlternance(
  { entreprise, periode }: ContenuExperience,
  langue: string,
): PaireCleValeur[] {
  const annees = formaterPeriode({ annee: periode.debut }, { annee: periode.fin }, langue);
  return [
    { cle: $localize`:@@experience.alternance:Alternance`, valeur: entreprise },
    { cle: $localize`:@@experience.periode:Période`, valeur: annees, date: true },
  ];
}

/**
 * La section Expérience de la page principale (EC-04 ; MF-11, MF-18), posée par la page dans son
 * élément section#experience. Dans l'ordre de lecture : l'en-tête de section numéroté 03, titre
 * « Expérience » seul, de niveau 2, sans chapô (choix C5), et dans son complément, sous le titre,
 * la liste clé-valeur en ligne de l'alternance (choix C6) ; le rôle en trois volets, une carte
 * pleine par volet, dans l'ordre du contenu, numérotés 01 à 03, chacun avec son texte (C-08) ;
 * puis la mention que les projets menés en entreprise ne sont pas partageables, en message
 * d'information (CO-11). Tout texte vient de experience.json, hors des libellés de la maquette,
 * marqués pour la traduction : aucun projet, client, outil interne, dépôt ni collègue n'y est
 * nommé. L'en-tête ouvre la section sur l'arrière-plan d'ambiance d'une section (CO-13) ; les
 * cartes suivent sur le fond uni, hors du halo, en grille sur le conteneur large. Statique : la
 * cascade et la respiration du halo viendront avec le mouvement (TK-48, MV-04).
 */
@Component({
  selector: 'app-experience',
  imports: [Ambiance, Carte, EnteteSection, Etiquette, ListeCleValeur, MessageEtat],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience {
  protected readonly experience = inject(LectureExperience).experience;
  protected readonly faits = faitsDeLAlternance(this.experience, inject(LOCALE_ID));
  /** Chaque volet et le numéro de son étiquette, « 01 » à « 03 », dans l'ordre du contenu. */
  protected readonly volets = this.experience.volets.map((volet, rang) => ({
    ...volet,
    numero: String(rang + 1).padStart(2, '0'),
  }));
}
