import type { PronoteLabel } from "./user";

export type CommunPageEmploiDuTempsResponse = {
  ListeCours: PronoteCourse[];
}

export type PronoteCourse = {
  AvecCdT:       boolean;
  AvecTafPublie: boolean;
  CouleurFond:   string;
  DateDuCours:   Date;
  duree:         number;
  place:         number;
  ListeContenus: PronoteContent[];
}

export type PronoteContent = PronoteLabel & {
  G: number;
}