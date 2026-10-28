import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-provisoire',
  styleUrl: './provisoire.scss',
  templateUrl: './provisoire.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Provisoire {
  protected readonly ecran: string = inject(ActivatedRoute).snapshot.data['ecran'];
}
