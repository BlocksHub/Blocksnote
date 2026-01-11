import { CommonUserSettings } from "./Common";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import { StudentUserSettings } from "./Student";
import type { EleveParametresUtilisateurResponse, ParentParametresUtilisateurResponse } from "../../types/responses/user";
import type { CommonClass, ParentPermissions } from "../../types/user";

export class ParentUserSettings extends CommonUserSettings<ParentParametresUtilisateurResponse> {
  constructor(
    session: Session,
    raw: Response<ParentParametresUtilisateurResponse>,
    ressource: ParentParametresUtilisateurResponse["ressource"],
    settings: Settings
  ){
    super(session, raw, ressource, settings)
  }

  public override get permissions(): ParentPermissions {
    const common = super.permissions
    const authorizations = this.raw.data.autorisations as ParentParametresUtilisateurResponse["autorisations"]

    return {
      ...common,
      canEditPersonalInfoAuthorizations: authorizations.compte.avecSaisieInfosPersoAutorisations,
      canEditPersonalInfoCoordinates:    authorizations.compte.avecSaisieInfosPersoCoordonnees,
      canChatWithParents:                authorizations.AvecDiscussionParents
    }
  }

  public get classes(): CommonClass[] {
    return this.ressource.listeClassesDelegue.map((i) => ({
      label: i.label
    }))
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
