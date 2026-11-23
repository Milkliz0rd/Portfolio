import { ChangeDetectionStrategy, Component, DOCUMENT, inject, input } from '@angular/core';

/**
 * Lien d'évitement (CO-14), premier élément focalisable de chaque page : il mène au contenu
 * principal, dont l'id est sa cible. Sans script, c'est un lien d'ancre ordinaire. Une fois
 * l'application démarrée, son clic est intercepté (PF-06) : le contenu principal défile sous
 * l'en-tête et reçoit le focus, sans changer l'adresse ni l'historique, car une ancre suivie par le
 * navigateur ajouterait une entrée sans l'état du routeur, qu'il prendrait pour un retour arrière.
 */
@Component({
  selector: 'app-lien-evitement',
  templateUrl: './lien-evitement.html',
  styleUrl: './lien-evitement.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LienEvitement {
  /** L'id du contenu principal. */
  readonly cible = input.required<string>();

  private readonly document = inject(DOCUMENT);

  // Un clic avec une touche de modification reste au navigateur, comme pour un lien du routeur.
  protected aller(evenement: MouseEvent): void {
    const { ctrlKey, metaKey, shiftKey, altKey } = evenement;
    const contenu = this.document.getElementById(this.cible());
    if (!contenu || ctrlKey || metaKey || shiftKey || altKey) return;
    evenement.preventDefault();
    contenu.scrollIntoView({ block: 'start' });
    contenu.focus({ preventScroll: true });
  }
}
