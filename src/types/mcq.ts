import type { Base64 } from "./user";

export const ClosureState = {
  IN_PROGRESS:           0,
  FINISHED:              1,
  MAX_DURATION_EXCEEDED: 2,
  TO_REDO:               3
}

export type ClosureStateValue = typeof ClosureState[keyof typeof ClosureState];

export const DistributionMode = {
  NONE:            0,
  ON_COMPLETION:   1,
  SCHEDULED_DATE:  2
}

export type DistributionModeValue = typeof DistributionMode[keyof typeof DistributionMode];

export const QuestionType = {
  UNKNOWN:          0,
  SINGLE_CHOICE:    1,
  MULTI_CHOICE:     2,
  TRUE_FALSE:       3,
  NUMERICAL_ANSWER: 4,
  SHORT_ANSWER:     5,
  SPELL_ANSWER:     6,
  MATCHING:         7,
  CLOZE_FIELD:      8,
  CLOZE_FIXED:      9,
  CLOZE_VARIABLE:   10,
  ESSAY:            11,
  WORD_ORDER:       12
}

export type QuestionTypeValue = typeof QuestionType[keyof typeof QuestionType]

export type AudioFile = {
  label:  string;
  base64: Base64<"audio/mpeg">;
}