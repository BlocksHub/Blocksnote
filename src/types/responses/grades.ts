import type { PronoteId } from "./notebook";
import type { PronoteKind, PronoteLabel } from "./user";

export type CommonDernieresNotesReponses = {
  moyGenerale?:               number | string;
  moyGeneraleClasse?:         number | string;
  baremeMoyGenerale:          number;
  baremeMoyGeneraleParDefaut: number;
  avecDetailDevoir:           boolean;
  avecDetailService:          boolean;
  listeServices:              PronoteService[];
  listeDevoirs:               PronoteNote[];
}

export type PronoteService = PronoteLabel & PronoteKind & {
  ordre:                   number;
  estServiceEnGroupe:      boolean;
  moyEleve:                number | string;
  baremeMoyEleve?:         number;
  baremeMoyEleveParDefaut: number;
  moyClasse:               number | string;
  moyMin:                  number | string;
  moyMax:                  number | string;
  couleur:                 string;
}

export type PronoteNote = PronoteId & PronoteKind & {
  note:            number | string;
  bareme:          number;
  baremeParDefaut: number;
  date:            Date;
  service:         PronoteLabel & PronoteKind;
  periode:         PronoteLabel;
  ListeThemes:     string[];
  moyenne:         number | string;
  estEnGroupe:     boolean;
  noteMax:         number | string;
  noteMin:         number | string;
  commentaire?:    string;
  coefficient:     number;
  estFacultatif:   boolean;
  estBonus:        boolean;
  estRamenerSur20: boolean;
}