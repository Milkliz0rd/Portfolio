import { ChangeDetectionStrategy, Component, inject, LOCALE_ID } from '@angular/core';
import { Carte } from '../../components/carte/carte';
import { Etiquette } from '../../components/etiquette/etiquette';
import { formaterPeriode } from '../../components/frise/frise';
import type { Experience } from '../../interfaces/contenu';
import { LectureAccueil } from '../../services/contenu/accueil';
import { LectureExperience } from '../../services/contenu/experience';
import { PRINCIPALE, type Section } from '../../services/navigation/navigation';

/** Une carte de l'accueil : l'ancre de sa section, son numéro d'en-tête de section, son titre. */
interface CarteSection {
  readonly ancre: Section;
  readonly numero: string;
  readonly titre: string;
}

/**
 * Les cartes, dans l'ordre du plan du site, numérotées comme les en-têtes de leurs sections
 * (CO-16). Une fonction : les titres se lisent à l'appel, une fois la traduction en place.
 */
const cartesSections = (): readonly CarteSection[] => [
  { ancre: 'parcours', numero: '01', titre: $localize`:@@cartes-sections.parcours:Parcours` },
  {
    ancre: 'competences',
    numero: '02',
    titre: $localize`:@@cartes-sections.competences:Compétences`,
  },
  {
    ancre: 'experience',
    numero: '03',
    titre: $localize`:@@cartes-sections.experience:Expérience`,
  },
  {
    ancre: 'methode',
    numero: '04',
    titre: $localize`:@@cartes-sections.methode:Méthode de travail`,
  },
  { ancre: 'projets', numero: '05', titre: $localize`:@@cartes-sections.projets:Projets` },
];

/** « Alternance chez <entreprise>, <période>. », de experience.json, à deux espaces réservés. */
function phraseAlternance({ entreprise, periode }: Experience, langue: string): string {
  const annees = formaterPeriode({ annee: periode.debut }, { annee: periode.fin }, langue);
  return $localize`:@@cartes-sections.alternance:Alternance chez ${entreprise}:entreprise:, ${annees}:periode:.`;
}

/**
 * Les cartes des sections de l'accueil (EC-01 : une entrée par section, avec sa phrase
 * d'orientation, C-10, lue dans accueil.json). Chacune est une carte interactive pleine (CO-05) :
 * un seul lien, porté par son titre, un lien du routeur vers la page principale avec l'ancre de sa
 * section et replaceUrl, qui fait défiler la page jusqu'à la section sans étape d'historique
 * (PF-06). La carte « Expérience » ouvre sur l'alternance, tirée de experience.json, jamais écrite
 * en dur. Pleines, elles se posent sur un fond uni, jamais sur un halo : la page s'en charge.
 */
@Component({
  selector: 'app-cartes-sections',
  imports: [Carte, Etiquette],
  templateUrl: './cartes-sections.html',
  styleUrl: './cartes-sections.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartesSections {
  /** La page principale : chaque carte y mène, à l'ancre de sa section. */
  protected readonly principale = PRINCIPALE;
  protected readonly cartes = cartesSections();
  protected readonly orientations = inject(LectureAccueil).accueil.orientations;
  protected readonly alternance = phraseAlternance(
    inject(LectureExperience).experience,
    inject(LOCALE_ID),
  );
}
