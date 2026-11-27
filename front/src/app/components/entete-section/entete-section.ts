import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  TemplateRef,
} from '@angular/core';
import { Etiquette } from '../etiquette/etiquette';

export type NiveauEnteteSection = 1 | 2 | 3;

/**
 * En-tête de section de la charte (CO-16) : l'étiquette (CO-04), hors du titre, numérotée sur une
 * section de la page principale, sans numéro ni filet ailleurs ; le titre, vrai titre h1, h2 ou h3
 * de la hiérarchie de la page ; un chapô facultatif, plafonné à conteneur-texte. La taille du
 * titre suit son rôle, pas son niveau : taille-titre-1 pour une section ou une page à part,
 * taille-titre-2 pour un bloc. La page projette le titre en contenu, le chapô dans un modèle
 * #chapo, et dans un modèle #complement ce qui suit le titre et le chapô : une action, comme le
 * spécimen centré du catalogue, ou une liste, comme la liste clé-valeur de la section Expérience
 * (EC-04). Sans l'un ou l'autre, rien n'est rendu à sa place. titreId pose l'id du titre sur le
 * h1, le h2 ou le h3 lui-même : celui que nomme l'aria-labelledby de la section, et la cible d'une
 * ancre vers le titre. Centré pour une fin de page. Statique : la cascade (MV-01) et le filet qui
 * s'étire (MV-05) viennent avec le mouvement.
 *
 *   <app-entete-section numero="02" etiquette="Section" [niveau]="2" [titreId]="'titre-section'">
 *     Le titre
 *     <ng-template #chapo>Le chapô, en une ou deux phrases.</ng-template>
 *     <ng-template #complement><a appBouton routerLink="/contact">Une action</a></ng-template>
 *   </app-entete-section>
 */
@Component({
  selector: 'app-entete-section',
  imports: [Etiquette, NgTemplateOutlet],
  templateUrl: './entete-section.html',
  styleUrl: './entete-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'entete-section',
    '[class.entete-section--bloc]': 'bloc()',
    '[class.entete-section--centre]': 'centre()',
  },
})
export class EnteteSection {
  /** Le numéro d'une section de la page principale, « 02 » ; sans lui, ni numéro ni filet. */
  readonly numero = input<string>();
  /** Le texte de l'étiquette, écrit et marqué pour la traduction par la page. */
  readonly etiquette = input.required<string>();
  /** Le niveau du titre dans la hiérarchie de la page : 1 pour une page à part. */
  readonly niveau = input.required<NiveauEnteteSection>();
  /** Le titre d'un bloc, à l'intérieur d'une section : taille-titre-2 au lieu de taille-titre-1. */
  readonly bloc = input(false, { transform: booleanAttribute });
  /** Centré, pour une fin de page, avec une action. */
  readonly centre = input(false, { transform: booleanAttribute });
  /** L'id du titre, posé sur le h1, le h2 ou le h3 lui-même ; sans lui, le titre n'en a pas. */
  readonly titreId = input<string>();

  protected readonly chapo = contentChild<TemplateRef<unknown>>('chapo');
  /** Ce qui suit le titre et le chapô : une action ou une liste. */
  protected readonly complement = contentChild<TemplateRef<unknown>>('complement');
}
