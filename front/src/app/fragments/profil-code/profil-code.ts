import { ChangeDetectionStrategy, Component, inject, LOCALE_ID } from '@angular/core';
import { Fenetre, type LigneCode, type SegmentCode } from '../../components/fenetre/fenetre';
import type { Experience, Profil } from '../../interfaces/contenu';
import { LectureExperience } from '../../services/contenu/experience';
import { formaterPeriode } from '../../services/contenu/lecture/periode';
import { LectureProfil } from '../../services/contenu/profil';

/** Le titre de la barre : le nom d'un fichier, pas un libellé à traduire. */
const TITRE = 'profil.ts';

const motCle = (code: string): SegmentCode => ({ texte: code, genre: 'mot-cle' });
const ordinaire = (code: string): SegmentCode => ({ texte: code, genre: 'texte' });
// Une valeur du contenu, écrite comme une chaîne du langage : entre guillemets, échappée par JSON.
const chaine = (valeur: string): SegmentCode => ({
  texte: JSON.stringify(valeur),
  genre: 'chaine',
});
const champ = (retrait: number, nom: string, valeur: string): LigneCode => [
  ordinaire(`${'  '.repeat(retrait)}${nom}: `),
  chaine(valeur),
  ordinaire(','),
];

/** L'extrait, comme sur la maquette : le nom, l'intitulé, puis l'alternance, sans bloc « liens ». */
function lignesDuProfil(profil: Profil, experience: Experience, langue: string): LigneCode[] {
  const { debut, fin } = experience.periode;
  return [
    [motCle('export const'), ordinaire(' profil = {')],
    champ(1, 'nom', profil.nom),
    champ(1, 'intitule', profil.intitule),
    [ordinaire('  alternance: {')],
    champ(2, 'entreprise', experience.entreprise),
    champ(2, 'periode', formaterPeriode({ annee: debut }, { annee: fin }, langue)),
    [ordinaire('  },')],
    [ordinaire('} '), motCle('as const'), ordinaire(';')],
  ];
}

/**
 * La fenêtre « profil.ts » de l'accueil (PF-05) : un extrait de code (CO-12, variante code) qui
 * reprend le nom et l'intitulé (profil.json), l'entreprise et la période de l'alternance
 * (experience.json, la période mise en forme par formaterPeriode), sans bloc « liens ». Rien n'y
 * est écrit en dur : chaque valeur vient du contenu. Un décor : l'accueil affiche déjà chacune de
 * ces valeurs (le nom dans le titre de niveau 1, l'intitulé dessous, l'alternance en tête de la
 * carte « Expérience ») ; la fenêtre est donc décorative, aria-hidden sur son cadre, sans élément
 * focalisable, et la page la retire sous 600 px. Statique : l'écriture viendra avec le mouvement
 * (MV-03, TK-54).
 */
@Component({
  selector: 'app-profil-code',
  imports: [Fenetre],
  templateUrl: './profil-code.html',
  styleUrl: './profil-code.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilCode {
  protected readonly titre = TITRE;
  protected readonly lignes = lignesDuProfil(
    inject(LectureProfil).profil,
    inject(LectureExperience).experience,
    inject(LOCALE_ID),
  );
}
