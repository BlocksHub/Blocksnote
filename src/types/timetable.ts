export type TimetableOptions = {
  withAbsences?:            boolean;
  weekNumber:               number;
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
  lessons: Lesson[];
}

export type Lesson = {
  withPublishedHomework: boolean;
  backgroundColor:       string;
  from:                  Date;
  to:                    Date;
  room?:                 string;
  subject?:              string;
  teacher?:              string;
}

export type Ressource = {
  G: number;
  N: string;
};