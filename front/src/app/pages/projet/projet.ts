import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Ambiance } from '../../components/ambiance/ambiance';
import { Bouton } from '../../components/bouton/bouton';
import { EnteteSection } from '../../components/entete-section/entete-section';
import { Fenetre } from '../../components/fenetre/fenetre';
import { Lien } from '../../components/lien/lien';
import type { Capture, Projet as ProjetDuContenu } from '../../interfaces/contenu';
import { LectureProjets } from '../../services/contenu/projets';

// Un emplacement étiqueté, par l'expression même du contrôle du contenu (EMPLACEMENT,
// outils/controle-contenu/structure.mjs) : « [C-xx …] », ou toute marque « [… — …] ».
const EMPLACEMENT = /\[(?:C-\d+[^\]]*|[^\][]*\s—\s[^\][]*)\]/;

/** Une capture telle que la fenêtre l'affiche ; son titre, le nom du fichier sans extension. */
export interface CaptureAffichee {
  readonly source: string;
  readonly largeur: number;
  readonly hauteur: number;
  readonly alternatif: string;
  readonly titre: string;
}

// Un fichier en emplacement porte la marque ; une dimension, si elle n'est pas un nombre : le
// modèle n'y admet qu'un nombre ou l'emplacement (NombreOuEmplacement).
const fournie = (capture: Capture): capture is Capture & { largeur: number; hauteur: number } =>
  !EMPLACEMENT.test(capture.fichier) &&
  typeof capture.largeur === 'number' &&
  typeof capture.hauteur === 'number';

/**
 * Les captures affichées, dans l'ordre du fichier, servies depuis /images/projets/<identifiant>/
 * (PF-02). Choix 1 de W22 : une capture encore en emplacement, par son fichier, sa largeur ou sa
 * hauteur, ne s'affiche pas, comme s'il n'y en avait aucune : ni image cassée, ni requête vers une
 * marque, ni cadre étiqueté ; le contrôle du contenu continue de la signaler.
 */
export function capturesAffichees({ identifiant, captures }: ProjetDuContenu): CaptureAffichee[] {
  return captures.filter(fournie).map(({ fichier, alternatif, largeur, hauteur }) => ({
    source: `/images/projets/${identifiant}/${fichier}`,
    largeur,
    hauteur,
    alternatif,
    titre: fichier.replace(/\.[^.]+$/, ''),
  }));
}

/**
 * La fiche d'un projet (EC-07, MF-13, MF-22), page à part pré-rendue pour chaque identifiant de
 * l'index des projets. L'en-tête sans numéro, sur l'ambiance d'une section : « Projets », puis le
 * titre du projet, seul titre de niveau 1, à taille-titre-1 (choix 4 et 5). Dans l'ordre : la
 * description ; les captures, seulement s'il y en a, en fenêtres capture (WebP, dimensions
 * déclarées, texte alternatif, chargement à la demande) ; « Voir le code source », seulement si
 * lienCode existe, bouton primaire externe ; « ← Retour à la liste des projets », lien d'action
 * retour du routeur vers / et l'ancre projets : une navigation ordinaire, qui ajoute une étape
 * (PF-06). Sans capture, aucune zone vide ; sans lien, ni lien ni bouton. « Projets » est signalé
 * par data.section de la route. Statique : cascade, tracé et fondu viennent avec le mouvement.
 */
@Component({
  selector: 'app-projet',
  imports: [Ambiance, Bouton, EnteteSection, Fenetre, Lien, RouterLink],
  templateUrl: './projet.html',
  styleUrl: './projet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projet {
  // Le routeur garde la fiche d'un projet à l'autre : elle suit l'identifiant de l'adresse.
  private readonly identifiant = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((parametres) => parametres.get('id') ?? '')),
    { requireSync: true },
  );

  /** Le projet de l'adresse : la garde projetExiste n'en laisse passer aucun autre. */
  protected readonly projet = computed(() => {
    const projet = this.lecture.trouver(this.identifiant());
    if (!projet)
      throw new Error(`Aucun projet « ${this.identifiant()} » dans l’index des projets.`);
    return projet;
  });
  protected readonly captures = computed(() => capturesAffichees(this.projet()));

  private readonly lecture = inject(LectureProjets);
}
