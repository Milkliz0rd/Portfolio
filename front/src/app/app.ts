import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Entete } from './layout/entete/entete';
import { LienEvitement } from './layout/lien-evitement/lien-evitement';
import { MouvementService } from './services/mouvement/mouvement';
import { NavigationService } from './services/navigation/navigation';

@Component({
  imports: [RouterOutlet, LienEvitement, Entete],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    // Le mouvement (PF-04) et ce qui attend la fin du chargement dans la navigation (PF-06)
    // démarrent après le premier rendu dans le navigateur, jamais au pré-rendu.
    const mouvement = inject(MouvementService);
    const navigation = inject(NavigationService);
    afterNextRender(() => {
      mouvement.demarrer();
      navigation.demarrer();
    });
  }
}
