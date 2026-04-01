export const DifficultyLevels = {
  UNKNOWN: 0,
  EASY:    1,
  MEDIUM:  2,
  HARD:    3
}

export type DifficultyLevel = typeof DifficultyLevels[keyof typeof DifficultyLevels];

export const SubmissionTypes = {
  NONE:    0,
  PAPER:   1,
  PRONOTE: 2,
  KIOSQUE: 3,
  AUDIO:   4
}

export type SubmissionType = typeof SubmissionTypes[keyof typeof SubmissionTypes];