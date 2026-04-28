import { CommonUserSettings } from "@/routes/ParametresUtilisateurs/Common";
import type { Base64, AssistantPermissions, CommonPermissions } from "@/types/user";
import type { AssistantAutorisations, AssistantParametresUtilisateurResponse, EleveParametresUtilisateurResponse } from "@/types/responses/user";
import { StudentUserSettings } from "@/routes/ParametresUtilisateurs/Student";
import { Response } from "@/structures/network/Response";

export class AssistantUserSettings extends CommonUserSettings<AssistantParametresUtilisateurResponse> {
  public static toPermissions(
    common: CommonPermissions,
    authorizations: AssistantAutorisations
  ): AssistantPermissions {
    return {
      ...common,
      isChatRecipient:             authorizations.estDestinataireChat,
      canViewStudentIdentity:      authorizations.ConsulterIdentiteEleve,
      canViewGuardianFiles:        authorizations.ConsulterFichesResponsables,
      canViewStudentPhotos:        authorizations.ConsulterPhotosEleves,
      canChat:                     authorizations.AvecDiscussion,
      canChatWithStaff:            authorizations.AvecDiscussionPersonnels,
      canChatWithTeachers:         authorizations.AvecDiscussionProfesseurs,
      canChatWithParents:          authorizations.AvecDiscussionParents,
      canUseAdvancedDiscussion:    authorizations.AvecDiscussionAvancee,
      canUseInstantMessaging:      authorizations.avecMessageInstantane,
      canRecordParentObservations: authorizations.AvecSaisieObservationsParents,
      canDisconnectMessaging:      authorizations.avecDroitDeconnexionMessagerie,
      course:                      {
        canDisplayDetachedStudentsInCourse:     authorizations.cours.afficherElevesDetachesDansCours,
        canModifyDetachedStudentsOnMovedCourse: authorizations.cours.modifierElevesDetachesSurCoursDeplaceCreneauLibre,
        scheduleViewDomains:                    authorizations.cours.domaineConsultationEDT
      }
    }
  }

  public override get permissions(): AssistantPermissions {
    const common = super.permissions
    const authorizations = this.raw.data.autorisations
    return AssistantUserSettings.toPermissions(common, authorizations)
  }

  public get profilePicture(): Base64<"image/png"> | undefined {
    const key = this.ressource.photoBase64;
    const file = key !== undefined ? this.raw.ressources?.fichiers?.[key] : undefined;

    return ["data:image/png;base64", file].join(",") as Base64<"image/png">
  }

  public get childrens(): StudentUserSettings[] {
    return this.ressource.listeRessources.map((children) => new StudentUserSettings(
      this.session,
      {
        ...this.raw,
        data: { ressource: children }
      } as Response<EleveParametresUtilisateurResponse>,
      children,
      this.settings
    )
    )
  }
}
