export interface SchoolInfo {
  longName: string;
  shortName: string;
  logoUrl?: string;
}

export interface PublicationSettings {
  defaultDelayDays: number;
  parentDelayDays: number;
  hasDelayedGradePublication: boolean;
  hasDelayedEvalPublication: boolean;
}

export interface GradingSettings {
  scale: number;
  maxGrade: number;
}

export interface EnvironmentSettings {
  serverDate: Date;
  isShowedInENT: boolean;
  isAccessibilityCompliant: boolean;
  isForNewCaledonia: boolean;
  isHostedInFrance: boolean;
}

export interface Permissions {
  parentCanChangePassword: boolean;
  allowConnectionInfoRecovery: boolean;
  isForumEnabled: boolean;
  isParentMessagingEnabled: boolean;
  isBlogEnabled: boolean;
  isExcellencePathwayManagementEnabled: boolean;
}

export interface ScheduleSettings {
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

export interface PublicHoliday {
  label: string,
  from: Date,
  to: Date
}

export interface Recreation {
  seat: number,
  label: string
}

export interface EvaluationSettings {
  acquisitionLevels: AcquisitionLevel[];
  hasEvaluationHistory: boolean;
  qcm: QCMSettings;
}

export interface QCMSettings {
  minScore: number;
  maxScore: number;
  maxPoints: number;
  maxLevel: number;
}

export interface Language {
  id: number;
  label: string;
}

export interface Period {
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface AcquisitionLevel {
  label: string;
  abbreviation?: string;
  color?: string;
  weight?: number;
  isAcquired?: boolean;
  countForSuccessRateCalculation?: boolean;
  pointsForBrevet?: number;
}

export interface Ressources {
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