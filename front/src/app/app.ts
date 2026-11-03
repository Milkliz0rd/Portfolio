import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MouvementService } from './services/mouvement/mouvement';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    // Le mouvement démarre après le premier rendu dans le navigateur, jamais au pré-rendu (PF-04).
    const mouvement = inject(MouvementService);
    afterNextRender(() => mouvement.demarrer());
  }
}
