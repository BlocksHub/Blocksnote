import { CommonUserSettings } from "./Common";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import type { Settings } from "../Settings";
import type { EleveParametresUtilisateurResponse, PronoteClasse } from "../../types/responses/user";
import type { Base64, StudentClass, StudentPermissions } from "../../types/user";

export class StudentUserSettings extends CommonUserSettings<EleveParametresUtilisateurResponse> {
  constructor(
    session: Session,
    raw: Response<EleveParametresUtilisateurResponse>,
    ressource: EleveParametresUtilisateurResponse['ressource'],
    settings: Settings
  ){
    super(session, raw, ressource, settings)
  }

  private static toStudentClass(item?: PronoteClasse): StudentClass {
    return {
      withSectors: item?.AvecFiliere ?? false,
      withGrades:  item?.AvecNote ?? false,
      current: true,
      label: item?.label ?? ""
    }
  }
  
  public override get permissions(): StudentPermissions {
    const common = super.permissions
    const authorizations = this.raw.data.autorisations

    return {
      ...common,
      size: {
        ...common.sizes,
        studentHomeworkMaxSize: authorizations.tailleMaxRenduTafEleve
      }
    }
  }

  public get groups(): string[] {
    return this.ressource.listeGroupes.map(group => group.label);
  }

  public get class(): StudentClass {
    const c = this.ressource.listeClassesHistoriques.find(i => i.courant)
    return StudentUserSettings.toStudentClass(c);
  }

  public get classes(): StudentClass[] {
    return this.ressource.listeClassesHistoriques.map(c => StudentUserSettings.toStudentClass(c))
  }

  public get profilePicture(): Base64<'png'> | undefined {
    const key = this.ressource.photoBase64;
    const file = key !== undefined ? this.raw.ressources?.fichiers?.[key] : undefined;

    return ["data:image/png;base64", file].join(",") as Base64<'png'>
  }
}
