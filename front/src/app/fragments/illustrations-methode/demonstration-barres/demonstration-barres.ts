import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Démonstration de l'étape 2 (maquette EC-05) : quatre barres, deux en accent et deux neutres. */
@Component({
  selector: 'app-demonstration-barres',
  templateUrl: './demonstration-barres.svg',
  styleUrl: '../illustration-methode.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemonstrationBarres {}
