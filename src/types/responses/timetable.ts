import type { PronoteLabel } from "./user";

export type CommunPageEmploiDuTempsResponse = {
  ListeCours: PronoteCourse[];
  absences: {
    joursCycle: JourAbsence[];
  }
}

export type JourAbsence = {
  jourCycle: number,
  numeroSemaine: number,
  exclusionsEtab?: AbsenceExclusion
}

export type AbsenceExclusion = {
  placeDebut: number,
  placeFin: number
}

export type PronoteCourse = {
  estRetenue?:     string;
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
  listeVisios?:    PronoteVisio[];
  hintRealise?:    string;
}

export type PronoteVisio = {
  id:           string;
  commentaire?: string;
  libelleLien?: string;
  url:          string;
}

export type PronoteContent = PronoteLabel & {
  G: number;
}

export type PronoteCDT = PronoteLabel & {
  estEval: boolean;
}