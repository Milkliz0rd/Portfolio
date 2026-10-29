import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Démonstration de l'étape 4 (maquette EC-05) : un cercle coché, puis trois barres. */
@Component({
  selector: 'app-demonstration-validation',
  templateUrl: './demonstration-validation.svg',
  styleUrl: '../illustration-methode.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemonstrationValidation {}
