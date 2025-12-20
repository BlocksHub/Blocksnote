import { CommonUserSettings } from "./Common";
import { Response } from "../network/Response";
import type { Base64, EleveParametresUtilisateurResponse, PronoteClasse, StudentClass } from "./Common";
import type { Session } from "../Session";
import type { Settings } from "../Settings";

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
    const ressource = this.raw.data.ressource;
    const key = ressource.photoBase64;
    const file = key !== undefined ? this.raw.ressources?.fichiers?.[key] : undefined;

    return ["data:image/png;base64", file].join(",") as Base64<'png'>
  }
}
