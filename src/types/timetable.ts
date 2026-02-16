import type { Detention } from "@/routes/PageEmploiDuTemps/Detention";
import type { Lesson } from "@/routes/PageEmploiDuTemps/Lesson";

export type TimetableOptions = {
  withAbsences?:            boolean;
  weekNumber?:              string;
  from?:                    Date;
  to?:                      Date;
  withClassCouncil?:        boolean;
  withFieldTrips?:          boolean;
  withAvailabilities?:      boolean;
  withGridPreferences?:     boolean;
  withFreeResourcesFooter?: boolean;
  withStudentDetentions?:   boolean;
  isPermanenceTimetable?:   boolean;
}

export type TimetableDay = {
  date:    Date;
  lessons: Lesson[] | Detention[];
}

export type Ressource = {
  G: number;
  N: string;
};

export type Videoconference = {
  comment?: string;
  label?:   string;
  url:      URL;
}