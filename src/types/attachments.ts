export const FileType = {
  NONE:                  "Aucun",
  TEST_SUBJECT:          "EvaluationSujet",
  TEST_CORRECTION:       "EvaluationCorrige",
  ASSIGNMENT_SUBJECT:    "DevoirSujet",
  ASSIGNMENT_CORRECTION: "DevoirCorrige",
  HOMEWORK_SUBMISSION:   "TAFRenduEleve",
  HOMEWORK_CORRECTION:   "TAFCorrigeRenduEleve",
  SCHOOL_RULES:          "EtablissementReglement",
  SCHOOL_CHARTER:        "EtablissementCharte",
  SIGNUP_ATTACHMENT:     "DocJointInscription"
}
export type FileTypeValue = typeof FileType[keyof typeof FileType];
