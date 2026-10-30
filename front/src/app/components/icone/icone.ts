import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

interface Dessin {
  /** Le cercle de rayon 9, au centre, que trois symboles des maquettes partagent. */
  readonly cercle?: true;
  readonly traces: readonly string[];
}

// Les treize icônes de la charte : tracés repris tels quels des symboles i-… des maquettes signées.
const DESSINS = {
  fleche: { traces: ['M5 12h14M13 6l6 6-6 6'] },
  'fleche-gauche': { traces: ['M19 12H5M11 6l-6 6 6 6'] },
  externe: { traces: ['M9 5h10v10M19 5 6 18'] },
  telecharger: { traces: ['M12 4v11M7 10l5 5 5-5M5 20h14'] },
  menu: { traces: ['M4 7h16M4 12h16M4 17h16'] },
  fermer: { traces: ['M6 6l12 12M18 6 6 18'] },
  valide: { cercle: true, traces: ['M8 12.5l2.5 2.5L16 9.5'] },
  erreur: { cercle: true, traces: ['M12 7.5v5.5M12 16.5v.01'] },
  attention: { traces: ['M12 3.5 2.8 19.5h18.4z', 'M12 10v4.5M12 17v.01'] },
  info: { cercle: true, traces: ['M12 11v5.5M12 7.8v.01'] },
  reessayer: { traces: ['M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5'] },
  pause: { traces: ['M9 6v12M15 6v12'] },
  lecture: { traces: ['M8 5.5v13l10.5-6.5z'] },
} as const satisfies Record<string, Dessin>;

export type NomIcone = keyof typeof DESSINS;
export const NOMS_ICONE = Object.keys(DESSINS) as NomIcone[];

/**
 * Icône en trait, dessinée en SVG dans la page (PF-01). Toujours décorative : le sens est porté par
 * le texte voisin. Chaque tracé porte pathLength="1", pour que MV-05 le dessine sans mesure (PF-04).
 * Elle prend la couleur du texte et mesure 1,25 fois sa taille.
 */
@Component({
  selector: 'app-icone',
  templateUrl: './icone.html',
  styleUrl: './icone.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icone {
  readonly nom = input.required<NomIcone>();

  protected readonly dessin = computed((): Dessin => DESSINS[this.nom()]);
}
