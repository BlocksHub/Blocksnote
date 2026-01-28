import type { PronoteLabel } from "./user";

export type CommunPageEmploiDuTempsResponse = {
  ListeCours: PronoteCourse[];
}

export type PronoteCourse = {
  AvecCdT:         boolean;
  AvecTafPublie:   boolean;
  CouleurFond:     string;
  DateDuCours:     Date;
  duree:           number;
  place:           number;
  ListeContenus:   PronoteContent[];
  Statut?:         string;
  estAnnule?:      boolean;
  cahierDeTextes?: PronoteCDT;
}

export type PronoteContent = PronoteLabel & {
  G: number;
}

export type PronoteCDT = PronoteLabel & {
  estEval: boolean;
}