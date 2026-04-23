import type { DifficultyLevel } from "../homework";
import type { PronoteKind, PronoteLabel } from "./user";

export type PronoteId = {
  id: string;
}

export type CommunDevoirResponse = {
  ListeTravauxAFaire: Array<Devoir>;
}

export type Devoir = PronoteId & {
  descriptif:       string;
  avecMiseEnForme:  boolean;
  PourLe:           Date;
  avecRendu:        boolean;
  genreRendu:       number;
  peuRendre:        boolean;
  TAFFait:          boolean;
  niveauDifficulte: DifficultyLevel;
  duree:            number;
  cahierDeTextes:   PronoteId;
  cours:            PronoteId;
  DonneLe:          Date;
  Matiere:          PronoteLabel;
  CouleurFond:      string;
  nomPublic:        string;
  libelleCBTheme:   string;
  documentRendu?:   PronoteLabel & PronoteKind;
}

export type FileUploadReponse = {
  numeroOrdre: string;
  etat:        number;
}