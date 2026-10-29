import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Démonstration de l'étape 1 (maquette EC-05) : quatre boîtes reliées par un schéma tracé. */
@Component({
  selector: 'app-demonstration-schema',
  templateUrl: './demonstration-schema.svg',
  styleUrl: '../illustration-methode.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemonstrationSchema {}
