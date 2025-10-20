import type { 
  EnvironmentSettings, 
  EvaluationSettings, 
  GradingSettings, 
  Language, 
  Permissions, 
  PublicationSettings, 
  Ressources, 
  ScheduleSettings, 
  SchoolInfo
} from "../types/instance";

export class Instance {
  constructor(
    public productName: string,
    public version: number[],
    public isDemo: boolean,
    public school: SchoolInfo,
    public schoolYear: number[],
    public publication: PublicationSettings,
    public grading: GradingSettings,
    public availableLanguages: Language[],
    public currentLanguage: Language,
    public environment: EnvironmentSettings,
    public schedule: ScheduleSettings,
    public evaluation: EvaluationSettings,
    public permissions: Permissions,
    public ressources?: Ressources
  ) {}
}
