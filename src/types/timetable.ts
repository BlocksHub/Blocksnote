import type { Lesson } from "../structures/PageEmploiDuTemps/Lesson";

export type TimetableOptions = {
  withAbsences?:            boolean;
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

export type TimetableRange = TimetableOptions & {
  from: Date;
  to:   Date;
};

export type TimetableDay = {
  date:    Date;
  lessons: Lesson[];
}

export type Ressource = {
  G: number;
  N: string;
};