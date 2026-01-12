import { CommonUserSettings } from "./Common";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import type { VieScolaireAutorisations, VieScolaireParametresUtilisateurResponse } from "../../types/responses/user";
import type { CommonPermissions, SchoolLifeClass, SchoolLifePermissions } from "../../types/user";
import { TeacherUserSettings } from "./Teacher";

export class SchoolLifeUserSettings extends CommonUserSettings<VieScolaireParametresUtilisateurResponse> {
  constructor(
    session: Session,
    raw: Response<VieScolaireParametresUtilisateurResponse>,
    ressource: VieScolaireParametresUtilisateurResponse["ressource"],
    settings: Settings
  ){
    super(session, raw, ressource, settings)
  }

  public static toPermissions(
    common: CommonPermissions,
    authorizations: VieScolaireAutorisations
  ): SchoolLifePermissions {
    const teacherPermissions = TeacherUserSettings.toPermissions(common, authorizations)
    return {
      ...common,
      ...teacherPermissions,
      canRecordMealAbsence:                  authorizations.AvecSaisieAbsenceRepas,
      canRecordBoardingSchoolAbsencesOnGrid: authorizations.AvecSaisieAbsencesGrilleAbsencesInternat,
      canRecordAbsencesForAllStudyHalls:     authorizations.AvecSaisieAbsencesToutesPermanences,
      canRecordOnTeacherCallGrid:            authorizations.AvecSaisieSurGrilleAppelProf,
      absenceRecordingDates:                 authorizations.DateSaisieAbsence,
      canRecordStaffCaseDocuments:           authorizations.avecSaisieDocumentsCasiersIntervenant
    }
  }

  public override get permissions(): SchoolLifePermissions {
    const common = super.permissions
    const authorizations = this.raw.data.autorisations
    return SchoolLifeUserSettings.toPermissions(common, authorizations)
  }

  public get classes(): SchoolLifeClass[] {
    return this.raw.data.listeClasses.map((i) => ({
      label:         i.label,
      level:         i.niveau?.label,
      isResponsible: i.estResponsable ?? false
    }))
  }
}
