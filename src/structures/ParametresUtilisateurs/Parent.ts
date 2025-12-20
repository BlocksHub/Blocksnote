import { CommonUserSettings } from "./Common";
import { Response } from "../network/Response";
import type { Base64, ParametresUtilisateurResponse } from "./Common";
import type { Session } from "../Session";

export class TeacherUserSettings extends CommonUserSettings {
  constructor(
    session: Session,
    raw: Response<ParametresUtilisateurResponse>
  ){
    super(session, raw)
  }
  
  public get profilePicture(): Base64<'png'> | undefined {
    const ressource = this.raw.data.ressource;
    const key = ressource.photoBase64;
    const file = key !== undefined ? this.raw.ressources?.fichiers?.[key] : undefined;

    return ["data:image/png;base64", file].join(",") as Base64<'png'>
  }
}
