import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { Icone, NomIcone } from '../icone/icone';
import { IndicateurActivite } from '../indicateur-activite/indicateur-activite';

export type VarianteMessageEtat = 'information' | 'envoi' | 'succes' | 'echec' | 'attention';

const ICONES: Record<VarianteMessageEtat, NomIcone | null> = {
  information: 'info',
  envoi: null,
  succes: 'valide',
  echec: 'erreur',
  attention: 'attention',
};

/**
 * Message d'état de la charte (CO-11) : dit ce qui se passe et ce qu'on peut faire, toujours avec
 * une icône (l'indicateur d'activité pour l'envoi en cours), un titre et un texte : la couleur ne
 * porte jamais seule l'information. La page projette le texte, en ligne, et un bouton projeté
 * devient l'action, placée sous le texte ; un lien reste dans le texte. L'échec s'annonce aussitôt
 * (role="alert"), les autres messages poliment (role="status"). Le message ne disparaît jamais de
 * lui-même : la page le remplace ou le retire à la prochaine action du visiteur.
 */
@Component({
  selector: 'app-message-etat',
  imports: [Icone, IndicateurActivite],
  templateUrl: './message-etat.html',
  styleUrl: './message-etat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'message-etat',
    '[class.message-etat--information]': "variante() === 'information'",
    '[class.message-etat--envoi]': "variante() === 'envoi'",
    '[class.message-etat--succes]': "variante() === 'succes'",
    '[class.message-etat--echec]': "variante() === 'echec'",
    '[class.message-etat--attention]': "variante() === 'attention'",
    '[attr.role]': "variante() === 'echec' ? 'alert' : 'status'",
  },
})
export class MessageEtat implements AfterViewInit {
  readonly variante = input<VarianteMessageEtat>('information');
  /** Le titre, écrit et marqué pour la traduction par la page. */
  readonly titre = input.required<string>();

  protected readonly icone = computed(() => ICONES[this.variante()]);

  private readonly texte = viewChild.required<ElementRef<HTMLElement>>('texte');

  // Le texte projeté est écrit quand la vue est prête : au pré-rendu, un message sans titre ni texte
  // fait échouer le build (app.config.server.ts).
  ngAfterViewInit(): void {
    if (!this.titre().trim() || !this.texte().nativeElement.textContent?.trim()) {
      throw new Error('Un message d’état porte toujours un titre et un texte (CO-11).');
    }
  }
}
