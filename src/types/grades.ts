export type GradeValue = {
  value:     number;
  outOf:     number;
  disabled?: boolean;
  status:    EvaluationStatusType;
}

export const EvaluationStatus = {
  ERROR:             -1,
  GRADED:             0,
  ABSENT:             1,
  DISABLED:           2,
  UNGRADED:           3,
  EXCUSED:            4,
  INCOMPLETE:         5,
  ABSENT_WITH_ZERO:   6,
  MISSING_WITH_ZERO:  7,
  DISTINCTION:        8
};

export type EvaluationStatusType = typeof EvaluationStatus[keyof typeof EvaluationStatus];