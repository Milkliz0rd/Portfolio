import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-provisoire',
  styleUrl: './provisoire.scss',
  templateUrl: './provisoire.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'conteneur-standard' },
})
export class Provisoire {
  private readonly donnees = inject(ActivatedRoute).snapshot.data;
  // L'étiquette de la route, « EC-02 Parcours » : l'identifiant de l'écran, puis son nom.
  private readonly ecran = this.donnees['ecran'] as string;
  protected readonly identifiant = this.ecran.slice(0, this.ecran.indexOf(' '));
  protected readonly nom = this.ecran.slice(this.ecran.indexOf(' ') + 1);
  // La variante de la page introuvable, telle que la route la donne (PF-06) : affichée, elle
  // distingue 404.html de projets/404.html, que la spécification de conformité compare.
  protected readonly variante = this.donnees['variante'] as string | undefined;
}
