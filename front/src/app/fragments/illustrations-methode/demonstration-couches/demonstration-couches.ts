import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Démonstration de l'étape 3 (maquette EC-05) : trois couches reliées par un tracé. */
@Component({
  selector: 'app-demonstration-couches',
  templateUrl: './demonstration-couches.svg',
  styleUrl: '../illustration-methode.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemonstrationCouches {}
