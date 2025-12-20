import { FileType, type FileTypeValue } from "../../types/attachments";
import type { Period } from "../../types/instance";
import { Attachment } from "../Attachment";
import { Request } from "../network/Request";
import { Response } from "../network/Response";
import type { Session } from "../Session";
import { Settings } from "../Settings";

export class CommonUserSettings<T extends ParametresUtilisateurResponse = ParametresUtilisateurResponse> {
  private _tabs?: Partial<Record<TabType, Tab>>;
  private _establishment?: Establishment;
  private _firstName?: string;
  private _lastName?: string;

  constructor(
    protected readonly session: Session,
    protected readonly raw: Response<T>,
    protected readonly ressource: T['ressource'],
    protected readonly settings: Settings
  ) {}

  public static async load<T extends CommonUserSettings>(
    session: Session,
    settings: Settings
  ): Promise<T> {
    const request = new Request().setPronotePayload(session, "ParametresUtilisateur", {});
    const response = await session.manager.enqueueRequest<ParametresUtilisateurResponse>(request);
    return new this(session, response, response.data.ressource, settings) as T;
  }

  protected getIdentity(str: string): { firstName: string; lastName: string } {
    const trimmed = str.trim();
    const match = trimmed.match(/[A-Z]{2,}(?:\s[A-Z]{2,})*/);
    
    if (!match) {
      return { firstName: trimmed, lastName: "" };
    }
    
    const { index } = match;
    const lastName = match[0];
    const firstName = (
      trimmed.slice(0, index) + 
      trimmed.slice(index! + lastName.length)
    ).trim();
    
    return { firstName, lastName };
  }

  protected createAttachment(
    info: InformationsEtablissement | undefined,
    labelKey: 'LibelleFichierRI' | 'LibelleFichierCU',
    fileType: FileTypeValue
  ): Attachment | undefined {
    const label = info?.[labelKey];
    return label ? Attachment.create(this.session, label, fileType, info.id) : undefined;
  }

  protected getReferentRole(name: string): string {
    const match = name.match(/\(([^)]+)\)/);
    return match?.[0] ?? "Unknown";
  }

  protected toTab(pronoteTab: PronoteOnglet): Tab {
    const tabPeriods = this.ressource.listeOngletsPourPeriodes?.find(
      p => p.G === pronoteTab.G
    );
    
    const periods: Period[] = tabPeriods
      ? tabPeriods.listePeriodes
          .map(p => this.settings.periods?.find(s => s.id === p.id))
          .filter((p): p is Period => Boolean(p))
      : [];

    const tabCycle = this.ressource.listeOngletsPourPiliers?.find(
      p => p.G === pronoteTab.G
    );
    
    const cycle: Cycle[] = tabCycle?.listePaliers.map(palier => ({
      label: palier.label,
      skills: palier.listePiliers.map(pilier => ({
        label: pilier.label,
        position: pilier.G,
        inCommonBase: pilier.estSocleCommun,
        isForeignLanguage: pilier.estPilierLVE
      }))
    })) ?? [];

    return { periods, cycle };
  }

  public get firstName(): string {
    if (this._firstName === undefined) {
      this._firstName = this.getIdentity(this.ressource.label).firstName;
    }
    return this._firstName;
  }

  public get lastName(): string {
    if (this._lastName === undefined) {
      this._lastName = this.getIdentity(this.ressource.label).lastName;
    }
    return this._lastName;
  }

  public tab(tabType: TabType): Tab | undefined {
    return this.tabs[tabType];
  }

  public get tabs(): Partial<Record<TabType, Tab>> {
    if (this._tabs !== undefined) {
      return this._tabs;
    }

    const result: Partial<Record<TabType, Tab>> = {};
    
    const processTab = (pronoteTab: PronoteOnglet): void => {
      if (pronoteTab.G) {
        result[pronoteTab.G] = this.toTab(pronoteTab);
      }

      if (Array.isArray(pronoteTab.Onglet)) {
        pronoteTab.Onglet.forEach(processTab);
      }
    };

    this.raw.data.listeOnglets?.forEach(processTab);
    
    this.ressource.listeOngletsPourPiliers?.forEach(item => {
      processTab(item as unknown as PronoteOnglet);
    });

    this._tabs = result;
    return result;
  }

  public get establishment(): Establishment {
    if (this._establishment !== undefined) {
      return this._establishment;
    }

    const { listeInformationsEtablissements } = this.raw.data;
    const info = listeInformationsEtablissements?.[0];
    const { label } = this.ressource.Etablissement;
    const coords = info?.Coordonnees;
    const harassmentSupport = this.ressource.listeNumerosUtiles.find(
      s => s.estNrHarcelement
    );

    const location: Location | undefined = coords ? {
      postalCode: coords.CodePostal,
      city: coords.LibelleVille,
      province: coords.Province,
      address: [
        coords.Adresse1,
        coords.Adresse2,
        coords.Adresse3,
        coords.Adresse4,
      ]
        .filter(Boolean)
        .join(" ")
    } : undefined;

    const contacts: EstablishmentContact = {
      mails: [coords?.EMailPersonnalise1, coords?.EMailPersonnalise2]
        .filter((m): m is MailEtablissement => Boolean(m))
        .map(m => ({ label: m.NomPersonnalise, address: m.Mail })),
      phoneNumbers: [
        coords?.NumPersonnalise1,
        coords?.NumPersonnalise2,
        coords?.NumPersonnalise3
      ]
        .filter((n): n is NumeroEtablissement => Boolean(n))
        .map(n => ({ label: n.NomPersonnalise, number: n.Numero })),
    };

    const harassmentPolicy: HarassmentPolicy = {
      supportWebsite: harassmentSupport ? new URL(harassmentSupport.url) : undefined,
      supportNumber: harassmentSupport
        ? { label: harassmentSupport.label, number: harassmentSupport.numeroTelBrut }
        : undefined,
      referents: info?.avecReferentsHarcelementPublie
        ? info.listeReferentsHarcelement.map(referent => ({
            name: referent.label,
            role: this.getReferentRole(referent.label),
            canChatWith: referent.avecDiscussion
          }))
        : []
    };

    this._establishment = {
      label,
      shortLabel: label,
      rules: this.createAttachment(info, 'LibelleFichierRI', FileType.SCHOOL_RULES),
      charter: this.createAttachment(info, 'LibelleFichierCU', FileType.SCHOOL_CHARTER),
      location,
      contacts,
      harassmentPolicy,
    };

    return this._establishment;
  }
}

export type Establishment = {
  label: string,
  shortLabel: string,
  rules?: Attachment,
  charter?: Attachment,
  location?: Location,
  contacts: EstablishmentContact,
  harassmentPolicy?: HarassmentPolicy,
}

export type HarassmentPolicy = {
  supportWebsite?: URL,
  supportNumber?: PhoneNumber,
  referents: HarassmentReferent[]
}

export type HarassmentReferent = {
  name: string,
  role: string,
  canChatWith: boolean
}

export type EstablishmentContact = {
  mails: Mail[],
  phoneNumbers: PhoneNumber[]
}

export type Mail = {
  label: string,
  address: string
}

export type PhoneNumber = {
  label: string,
  number: string
}

export type Location = {
  postalCode: string,
  city: string,
  province: string,
  address: string
}

export type Base64<imageType extends string> = `data:image/${imageType};base64,${string}`

export type CommonClass = {
  label: string
}

export type StudentClass = CommonClass & {
  withGrades: boolean,
  withSectors: boolean,
  current: boolean
}

export type Class = CommonClass | StudentClass

export type Tab = {
  periods: Period[],
  cycle: Cycle[]
}

export type Cycle = {
  label: string,
  skills: Skill[]
}

export type Skill = {
  label: string,
  position: number,
  inCommonBase: boolean,
  isForeignLanguage: boolean
}

export const TabsType = {
  SUMMARY: 12,
  REPORT_CARD: 13,
  GRADES: 198,
  NOTEBOOK: 19,
  PERIOD_REPORT: 100,
  CLASS_PERIOD_SUMMARY: 219,
  CLASS_REPORT: 41,
  PROFILE: 111,
  PEDAGOGICAL_RESOURCES: 99,
  ASSESSMENTS: 201,
  DIFFICULTIES: 277,
  SUBJECT_SKILL_REPORT: 278
}

export type TabType = typeof TabsType[keyof typeof TabsType]

// Raw Pronote Types, only dev, not included in production build

export type CommunParametresUtilisateurResponse = {
  ressource: CommunParametresUtilisateurRessource,
  listeInformationsEtablissements?: InformationsEtablissement[],
  listeOnglets: PronoteOnglet[]
}

export type EleveParametresUtilisateurResponse = CommunParametresUtilisateurResponse & {
  ressource: EleveParametresUtilisateurRessource
}

export type ParametresUtilisateurResponse = CommunParametresUtilisateurResponse | EleveParametresUtilisateurResponse

export type CommunParametresUtilisateurRessource = PronoteLabel & {
  Etablissement: PronoteLabel
  listeNumerosUtiles: (PronoteLabel & NumeroUtile)[]
  avecPhoto: boolean
  photoBase64?: number,
  listeOngletsPourPeriodes?: PeriodeOnglet[]
  listeOngletsPourPiliers?: PilierOnglet[]
}

export type EleveParametresUtilisateurRessource = CommunParametresUtilisateurRessource & {
  classeDEleve: PronoteLabel
  listeClassesHistoriques: PronoteClasse[]
  listeGroupes: PronoteLabel[]
}

export type PronoteOnglet = PronoteType & {
  Onglet?: PronoteType[]
}

export type PronoteType = {
  G: number
}

export type PilierOnglet =  PronoteType & {
  listePaliers: PronotePalier[]
}

export type PronotePalier = PronoteLabel & {
  listePiliers: PronotePilier[]
}

export type PronotePilier = PronoteLabel & PronoteType & {
  estPilierLVE: boolean,
  estSocleCommun: boolean
}

export type PeriodeOnglet = PronoteType & {
  listePeriodes: PronotePeriode[],
  periodeParDefaut: PronoteLabel
}

export type PronotePeriode = PronoteLabel & {
  A: boolean,
  GenreNotation: number
}

export type PronoteClasse = PronoteLabel & {
  AvecFiliere: boolean,
  AvecNote: boolean,
  courant: boolean
}

export type ParametresUtilisateurRessource = CommunParametresUtilisateurRessource | EleveParametresUtilisateurRessource

export type NumeroUtile = {
  commentaire: string,
  estNrHarcelement: boolean,
  numeroTelBrut: string,
  numeroTelFormate: string,
  url: string
}

export type PronoteLabel = {
  label: string,
  id: string
}

export type InformationsEtablissement = PronoteLabel & {
  Coordonnees?: Coordonnees
  LibelleFichierCU?: string,
  LibelleFichierRI?: string,
  avecFichierCU?: boolean,
  avecFichierRI?: boolean,
  avecInformations?: boolean,
  avecReferentsHarcelementPublie?: boolean,
  listeReferentsHarcelement: ReferentHarcelement[]
}

export type Coordonnees = {
  Adresse1: string,
  Adresse2: string,
  Adresse3: string,
  Adresse4: string,
  CodePostal: string,
  EMailPersonnalise1?: MailEtablissement,
  EMailPersonnalise2?: MailEtablissement,
  LibellePostal: string,
  LibelleVille: string,
  NumPersonnalise1?: NumeroEtablissement,
  NumPersonnalise2?: NumeroEtablissement,
  NumPersonnalise3?: NumeroEtablissement,
  Pays: string,
  Province: string,
  SiteInternet: string
}

export type NumeroEtablissement = {
  NomPersonnalise: string,
  Numero: string
}

export type MailEtablissement = {
  Mail: string,
  NomPersonnalise: string
}

export type ReferentHarcelement = PronoteLabel & {
  avecDiscussion: boolean
}