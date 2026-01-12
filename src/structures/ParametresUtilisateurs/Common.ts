import { FileType, type FileTypeValue } from "../../types/attachments";
import type { Period } from "../../types/instance";
import type { InformationsEtablissement, MailEtablissement, NumeroEtablissement, ParametresUtilisateurResponse, PronoteOnglet } from "../../types/responses/user";
import type { CommonPermissions, Cycle, Establishment, EstablishmentContact, HarassmentPolicy, Location, Tab, TabType } from "../../types/user";
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
    protected readonly ressource: T["ressource"],
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
    labelKey: "LibelleFichierRI" | "LibelleFichierCU",
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
      (p) => p.G === pronoteTab.G
    );

    const periods: Period[] = tabPeriods
      ? tabPeriods.listePeriodes
        .map((p) => this.settings.periods?.find((s) => s.id === p.id))
        .filter((p): p is Period => Boolean(p))
      : [];

    const tabCycle = this.ressource.listeOngletsPourPiliers?.find(
      (p) => p.G === pronoteTab.G
    );

    const cycle: Cycle[] = tabCycle?.listePaliers.map((palier) => ({
      label:  palier.label,
      skills: palier.listePiliers.map((pilier) => ({
        label:             pilier.label,
        position:          pilier.G,
        inCommonBase:      pilier.estSocleCommun,
        isForeignLanguage: pilier.estPilierLVE
      }))
    })) ?? [];

    return { periods, cycle };
  }

  public get permissions(): CommonPermissions {
    const authorizations = this.raw.data.autorisations

    return {
      canChat:                               authorizations.AvecDiscussion,
      canChatWithStaff:                      authorizations.AvecDiscussionPersonnels,
      canChatWithTeachers:                   authorizations.AvecDiscussionProfesseurs,
      canPrintGradesReport:                  authorizations.autoriserImpressionBulletinReleveBrevet,
      canViewAdministrativeDataFromStudents: authorizations.consulterDonneesAdministrativesAutresEleves,
      sizes:                                 {
        circumstancesMaxSize:           authorizations.tailleCirconstance,
        commentMaxSize:                 authorizations.tailleCommentaire,
        establishmentAttachmentMaxSize: authorizations.tailleMaxDocJointEtablissement,
        homeworkMaxSize:                authorizations.tailleTravailAFaire
      },
      canViewPersonnalData:          authorizations.compte.avecInformationsPersonnelles,
      isChatDisabledBySchedule:              authorizations.discussionDesactiveeSelonHoraire,
      chatDisabledByScheduleMessage:         authorizations.messageDiscussionDesactiveeSelonHoraire
    }
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

    this.ressource.listeOngletsPourPiliers?.forEach((item) => {
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
    const harassmentSupport = this.ressource.listeNumerosUtiles?.find(
      (s) => s.estNrHarcelement
    );

    const location: Location | undefined = coords ? {
      postalCode: coords.CodePostal,
      city:       coords.LibelleVille,
      province:   coords.Province,
      address:    [
        coords.Adresse1,
        coords.Adresse2,
        coords.Adresse3,
        coords.Adresse4
      ]
        .filter(Boolean)
        .join(" ")
    } : undefined;

    const contacts: EstablishmentContact = {
      mails: [coords?.EMailPersonnalise1, coords?.EMailPersonnalise2]
        .filter((m): m is MailEtablissement => Boolean(m))
        .map((m) => ({ label: m.NomPersonnalise, address: m.Mail })),
      phoneNumbers: [
        coords?.NumPersonnalise1,
        coords?.NumPersonnalise2,
        coords?.NumPersonnalise3
      ]
        .filter((n): n is NumeroEtablissement => Boolean(n))
        .map((n) => ({ label: n.NomPersonnalise, number: n.Numero }))
    };

    const harassmentPolicy: HarassmentPolicy = {
      supportWebsite: harassmentSupport ? new URL(harassmentSupport.url) : undefined,
      supportNumber:  harassmentSupport
        ? { label: harassmentSupport.label, number: harassmentSupport.numeroTelBrut }
        : undefined,
      referents: info?.avecReferentsHarcelementPublie
        ? info.listeReferentsHarcelement.map((referent) => ({
          name:        referent.label,
          role:        this.getReferentRole(referent.label),
          canChatWith: referent.avecDiscussion
        }))
        : []
    };

    this._establishment = {
      label,
      shortLabel: label,
      rules:      this.createAttachment(info, "LibelleFichierRI", FileType.SCHOOL_RULES),
      charter:    this.createAttachment(info, "LibelleFichierCU", FileType.SCHOOL_CHARTER),
      location,
      contacts,
      harassmentPolicy
    };

    return this._establishment;
  }
}
