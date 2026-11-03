import { DOCUMENT, Injectable, inject } from '@angular/core';

type Abonne = () => void;

/**
 * Un seul écouteur passif de défilement et de redimensionnement pour tout le site (PF-04), posé au
 * premier abonné et retiré au dernier : chaque abonné est appelé au plus une fois par image. Pour
 * MV-01 (rattrapage), MV-02 et MV-08 ; à n'appeler que dans le navigateur (afterNextRender).
 */
@Injectable({ providedIn: 'root' })
export class DefilementService {
  private readonly vue = inject(DOCUMENT).defaultView;
  private readonly abonnes = new Set<{ appel: Abonne }>();
  private image: number | undefined;
  private readonly surMouvement = () => {
    if (this.image !== undefined || !this.vue) return;
    this.image = this.vue.requestAnimationFrame(() => {
      this.image = undefined;
      for (const { appel } of [...this.abonnes]) appel();
    });
  };

  /** Appelle `appel` à chaque image où la page a défilé ou changé de taille ; rend le désabonnement. */
  abonner(appel: Abonne): () => void {
    const abonne = { appel };
    if (this.abonnes.size === 0) {
      this.vue?.addEventListener('scroll', this.surMouvement, { passive: true });
      this.vue?.addEventListener('resize', this.surMouvement, { passive: true });
    }
    this.abonnes.add(abonne);
    return () => {
      if (!this.abonnes.delete(abonne) || this.abonnes.size > 0) return;
      this.vue?.removeEventListener('scroll', this.surMouvement);
      this.vue?.removeEventListener('resize', this.surMouvement);
      if (this.image !== undefined) this.vue?.cancelAnimationFrame(this.image);
      this.image = undefined;
    };
  }
}
