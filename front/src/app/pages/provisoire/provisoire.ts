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
  // L'étiquette de la route, « EC-02 Parcours » : l'identifiant de l'écran, puis son nom.
  private readonly ecran = inject(ActivatedRoute).snapshot.data['ecran'] as string;
  protected readonly identifiant = this.ecran.slice(0, this.ecran.indexOf(' '));
  protected readonly nom = this.ecran.slice(this.ecran.indexOf(' ') + 1);
}
