import { CommonUserSettings } from "@/routes/ParametresUtilisateurs/Common";
import type { Base64, CompanyPermissions } from "@/types/user";
import type { CompanyParametresUtilisateurResponse, EleveParametresUtilisateurResponse } from "@/types/responses/user";
import { StudentUserSettings } from "@/routes/ParametresUtilisateurs/Student";
import { Response } from "@/structures/network/Response";

export class CompanyUserSettings extends CommonUserSettings<CompanyParametresUtilisateurResponse> {
  public override get permissions(): CompanyPermissions {
    const common = super.permissions
    const authorizations = this.raw.data.autorisations
    return {
      ...common,
      canEditTraineeshipOffers: authorizations.autoriserEditionToutesOffresStages
    }
  }

  public get profilePicture(): Base64<"png"> | undefined {
    const key = this.ressource.photoBase64;
    const file = key !== undefined ? this.raw.ressources?.fichiers?.[key] : undefined;

    return ["data:image/png;base64", file].join(",") as Base64<"png">
  }

  public get students(): StudentUserSettings[] {
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
