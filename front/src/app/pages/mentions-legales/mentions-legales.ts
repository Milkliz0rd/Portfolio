import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { mentionsLegalesDuBanc } from '../../../configuration/configuration.genere';
import { Ambiance } from '../../components/ambiance/ambiance';
import { EnteteSection } from '../../components/entete-section/entete-section';
import {
  ListeCleValeur,
  type PaireCleValeur,
  type SegmentValeur,
} from '../../components/liste-cle-valeur/liste-cle-valeur';
import type { Segment } from '../../interfaces/contenu';
import { LectureTextesLegaux } from '../../services/contenu/textes-legaux';

/**
 * Un segment des textes légaux dans la liste : une adresse du site (« /contact », « /#projets »)
 * devient un lien du routeur, routerLink et fragment, avec son ancre s'il en a une, jamais une
 * navigation native vers une ancre (PF-06) ; une adresse HTTPS, un lien externe.
 */
export function segmentDeLaListe({ texte, lien }: Segment): SegmentValeur {
  if (!lien) return { texte };
  if (!lien.startsWith('/')) return { texte, lien, externe: true };
  const [chemin, ...ancre] = lien.split('#');
  return ancre.length ? { texte, lien: chemin, fragment: ancre.join('#') } : { texte, lien };
}

/**
 * Les mentions légales (EC-10, MF-19), page à part : l'en-tête sans numéro, titre de niveau 1, sur
 * l'ambiance d'une section, puis une liste clé-valeur en tableau, une paire par bloc de
 * textes-legaux.json, dans l'ordre du fichier : l'éditeur, le contact par le formulaire, les
 * hébergeurs. Les textes sont rendus tels quels, emplacements étiquetés compris, jusqu'à TK-45.
 * Le build de test seul y ajoute son contenu de test (configuration.genere.ts). Aucune entrée de
 * navigation n'est signalée : la route n'a pas de data.section.
 */
@Component({
  selector: 'app-mentions-legales',
  imports: [Ambiance, EnteteSection, ListeCleValeur],
  templateUrl: './mentions-legales.html',
  styleUrl: './mentions-legales.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MentionsLegales {
  protected readonly paires: readonly PaireCleValeur[] = [
    ...inject(LectureTextesLegaux).textesLegaux.mentionsLegales,
    ...mentionsLegalesDuBanc,
  ].map(({ intitule, paragraphes }) => ({
    cle: intitule,
    valeur: paragraphes.map((paragraphe) => paragraphe.map(segmentDeLaListe)),
  }));
}
