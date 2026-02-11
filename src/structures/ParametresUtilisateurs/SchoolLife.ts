import { CommonUserSettings } from "./Common";
import type { VieScolaireAutorisations, VieScolaireParametresUtilisateurResponse } from "../../types/responses/user";
import type { CommonPermissions, SchoolLifeClass, SchoolLifePermissions } from "../../types/user";
import { TeacherUserSettings } from "./Teacher";

export class SchoolLifeUserSettings extends CommonUserSettings<VieScolaireParametresUtilisateurResponse> {
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
      kind:          i.G,
      id:            i.id,
      label:         i.label,
      level:         i.niveau?.label,
      isResponsible: i.estResponsable ?? false
    }))
  }
}
