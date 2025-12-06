export type SchoolInfo = {
  longName: string;
  shortName: string;
  logoUrl?: string;
}

export type PublicationSettings = {
  defaultDelayDays: number;
  parentDelayDays: number;
  hasDelayedGradePublication: boolean;
  hasDelayedEvalPublication: boolean;
}

export type GradingSettings = {
  scale: number;
  maxGrade: number;
}

export type EnvironmentSettings = {
  serverDate: Date;
  isShowedInENT: boolean;
  isAccessibilityCompliant: boolean;
  isForNewCaledonia: boolean;
  isHostedInFrance: boolean;
}

export type Permissions = {
  parentCanChangePassword: boolean;
  allowConnectionInfoRecovery: boolean;
  isForumEnabled: boolean;
  isParentMessagingEnabled: boolean;
  isBlogEnabled: boolean;
  isExcellencePathwayManagementEnabled: boolean;
}

export type ScheduleSettings = {
  seatsPerDay: number;
  seatsPerHour: number;
  sequenceDuration: number;
  hasFullAfternoonHours: boolean;
  nextOpenDay: Date;
  openDaysPerCycle: number;
  firstWeek: number;
  firstMonday: Date;
  firstDate: Date;
  lastDate: Date;
  recreations: Recreation[];
  publicHolidays: PublicHoliday[];
}

export type PublicHoliday = {
  label: string,
  from: Date,
  to: Date
}

export type Recreation = {
  seat: number,
  label: string
}

export type EvaluationSettings = {
  acquisitionLevels: AcquisitionLevel[];
  hasEvaluationHistory: boolean;
  qcm: QCMSettings;
}

export type QCMSettings = {
  minScore: number;
  maxScore: number;
  maxPoints: number;
  maxLevel: number;
}

export type Language = {
  id: number;
  label: string;
}

export type Period = {
  label: string;
  startDate: Date;
  endDate: Date;
  id: string;
}

export type AcquisitionLevel = {
  label: string;
  abbreviation?: string;
  color?: string;
  weight?: number;
  isAcquired?: boolean;
  countForSuccessRateCalculation?: boolean;
  pointsForBrevet?: number;
}

export type Ressources = {
  confidentialityPolicy?: string;
  indexEducationWebsite?: string;
  hostingInfo?: string;
  support?: string;
  faqTwoFactorRegistration?: string;
  securityTutorialVideo?: string;
  registerDevicesTutorial?: string;
  canope?: string;
  accessibilityDeclaration?: string;
}