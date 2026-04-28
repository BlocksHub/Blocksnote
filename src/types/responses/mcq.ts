import type { ClosureStateValue, DistributionModeValue, QuestionTypeValue } from "@/types/mcq";
import type { PronoteId } from "@/types/responses/notebook";
import type { PronoteKind, PronoteLabel } from "@/types/responses/user";

export type ListeQuestionsQCMResponse = {
  QCM: PronoteLabel & {
    nbQuestion:     number;
    listeQuestions: PronoteQuestion[];
    etatCloture:    number;
    secEcoulees:    number;
    decalage:       number;
    dtServeur:      Date;
    dtDemarrage:    Date;
  };
}

export type PronoteQuestion = PronoteLabel & {
  P:                          number;
  G:                          QuestionTypeValue;
  enonce:                     string;
  note:                       number;
  casesensitive:              boolean;
  estObligatoire:             boolean;
  image?:                     number;
  mp3name?:                   string;
  mp3?:                       number;
  url?:                       string;
  utiliseFractionsPourSaisie: boolean;
  listeReponses?:             PronoteReponse[];
}

export type PronoteReponse = {
  label?:         string;
  P:              number;
  editionAvancee: boolean;
  libelleHtml:    string;
  associationA?:  PronoteAssociation;
  associationB?:  PronoteAssociation;
  listeChoix?:    string[];
}

export type PronoteAssociation = PronoteKind & {
  hashContenu:      string;
  strImage?:        number;
  strLibelleImage?: string;
  strSon?:          number;
  strLibelleSon?:   string;
  strTexte?:        string;
}

export type CommunValidationQCMResponse = {
  etatCloture: ClosureStateValue;
}

export type CommunExecutionQCMResponse = PronoteKind & PronoteId & {
  QCM:                             PronoteQCM;
  ListeThemes:                     PronoteLabel[];
  fichierDispo:                    boolean;
  estEnPublication:                boolean;
  dateDebutPublication:            Date;
  dateFinPublication:              Date;
  consigne:                        string;
  estLieADevoir:                   boolean;
  estLieAEvaluation:               boolean;
  estUnTAF:                        boolean;
  estUneActivite:                  boolean;
  estSupprimable:                  boolean;
  estDemarre?:                     boolean;
  existeExecutionEleve?:           boolean;
  estFini?:                        boolean;
  etatCloture?:                    ClosureStateValue;
  nbQuestRepondues?:               number;
  nbQuestBonnes?:                  number;
  autoriserLaNavigation:           boolean;
  homogeneiserNbQuestParNiveau:    boolean;
  jeuQuestionFixe:                 boolean;
  melangerLesQuestionsGlobalement: boolean;
  melangerLesQuestionsParNiveau:   boolean;
  melangerLesReponses:             boolean;
  ressentiRepondant:               boolean;
  publierCorrige:                  boolean;
  tolererFausses:                  boolean;
  acceptIncomplet:                 boolean;
  pointsSelonPourcentage:          boolean;
  afficherResultatNote:            boolean;
  afficherResultatNiveauMaitrise:  boolean;
  modeDiffusionCorrige:            DistributionModeValue;
  dateCorrige:                     Date;
  nombreQuestionsSoumises:         number;
  dureeMaxQCM:                     number;
  nbMaxTentative:                  number;
  nombreDePoints:                  number;
  listeProfesseurs:                PronoteLabel[];
  matiere:                         PronoteLabel;
  nomPublic:                       string;
}

export type PronoteQCM = PronoteLabel & PronoteKind & {
  nbQuestionsTotal:        number;
  nombreDePointsTotal:     number;
  avecQuestionsSoumises:   number;
  nombreQuestObligatoires: number;
  nbCompetencesTotal:      number;
}