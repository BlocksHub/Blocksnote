import type { Period } from "../types/instance";
import type { ClasseHistorique, CoordonneesEtablissement, InformationsEtablissements, Label, ListeOngletItem, ListePeriode, NumeroUtile, ParametresUtilisateurResponse, ParametresUtilisateurRessource } from "../types/responses/user";
import type { Class, Coordinates, Establishment, HarassmentPolicy, Mail, PhoneNumber } from "../types/user";
import type { TabType } from "../utils/constants";
import { Attachment, FileType } from "./Attachment";
import { Request } from "./network/Request";
import type { Session } from "./Session";

export class UserSettings {
  constructor(
    public establishment: Establishment,
    public groups: Label[] = [],
    public classes: Class[] = [],
    public profilePicture?: string,
    public hasBrevetExam: boolean = false,
    public availableTabs: Set<TabType | number> = new Set(),
    public tabPeriods: Map<TabType, Period[]> = new Map()
  ) {}

  public static async load(session: Session): Promise<UserSettings> {
    const request = new Request().setPronotePayload(session, "ParametresUtilisateur", {})
    const response = (await session.manager.enqueueRequest<ParametresUtilisateurResponse>(request))

    const ressource = response.data.ressource
    const establishment = response.data.listeInformationsEtablissements[0]!
    const { availableTabs, tabPeriods } = this.buildTabs(
      session, 
      response.data.listeOnglets, 
      ressource.listeOngletsPourPeriodes ?? []
    );

    return new UserSettings(
      this.buildEstablishment(session, establishment, ressource),
      ressource.listeGroupes,
      this.buildClasses(ressource.listeClassesHistoriques),
      ressource.avecPhoto ? response.ressources!.fichiers![ressource.photoBase64] : undefined,
      ressource.passeLeBrevet,
      availableTabs,
      tabPeriods
    )
  }

  public hasTab(tabId: TabType | number): boolean {
    return this.availableTabs.has(tabId);
  }

  public getTabPeriods(tabId: TabType | number): Period[] | undefined {
    return this.tabPeriods.get(tabId);
  }

  private static buildTabs(
    session: Session,
    activeTabs: ListeOngletItem[],
    periods: ListePeriode[]
  ): { availableTabs: Set<TabType | number>, tabPeriods: Map<TabType, Period[]> } {
    const availableTabs = new Set<TabType | number>();
    const tabPeriods = new Map<TabType | number, Period[]>();

    for (const tab of activeTabs) {
      availableTabs.add(tab.G);

      const hasPeriods = periods.some(period => period.G === tab.G);
      if (hasPeriods) {
        const builtPeriods = this.buildPeriods(session, periods, tab.G);
        if (builtPeriods.length > 0) {
          tabPeriods.set(tab.G, builtPeriods);
        }
      }

      if (tab.Onglet) {
        const nested = this.buildTabs(session, tab.Onglet, periods);
        nested.availableTabs.forEach(id => availableTabs.add(id));
        nested.tabPeriods.forEach((periods, id) => tabPeriods.set(id, periods));
      }
    }

    return { availableTabs, tabPeriods };
  }

  private static buildPeriods(
    session: Session,
    periods: ListePeriode[],
    tab: TabType | number
  ): Period[] {
    const matchingTab = periods.find(period => period.G === tab);
    if (!matchingTab?.listePeriodes || !session.instance) {
      return [];
    }

    return matchingTab.listePeriodes
      .map(period => session.instance!.periods?.find(p => p.id === period.id))
      .filter((period): period is Period => period !== undefined);
  }

  private static buildClasses(history: ClasseHistorique[] = []) {
    return history.map(item => ({
      current: item.courant,
      withGrades: item.AvecNote,
      withFiliere: item.AvecFiliere,
      label: item.label
    }))
  }

  private static buildEstablishment(session: Session, establishment: InformationsEtablissements, ressource: ParametresUtilisateurRessource): Establishment {
    return {
      name: establishment.label,
      id: establishment.id,
      logo: session.source + establishment.urlLogo,
      website: establishment.Coordonnees.SiteInternet,
      location: this.buildLocation(establishment.Coordonnees),
      mails: this.buildMails(establishment.Coordonnees),
      phoneNumbers: this.buildPhoneNumbers(establishment.Coordonnees),
      rules: establishment.avecFichierRI ? Attachment.create(session, establishment.LibelleFichierRI, FileType.SCHOOL_RULES, establishment.id) : undefined,
      charter: establishment.avecFichierCU ? Attachment.create(session, establishment.LibelleFichierCU, FileType.SCHOOL_CHARTER, establishment.id) : undefined,
      harassmentPolicy: this.buildHarassmentPolicy(
        establishment,
        ressource.listeNumerosUtiles?.find(item => item.estNrHarcelement)
      )
    };
  }

  private static buildLocation(coordinates: CoordonneesEtablissement): Coordinates {
    return {
      address: [
        coordinates.Adresse1, 
        coordinates.Adresse2, 
        coordinates.Adresse3, 
        coordinates.Adresse4
      ].filter(line => line).join(", "),
      postalCode: coordinates.CodePostal,
      city: coordinates.LibelleVille,
      province: coordinates.Province
    }
  }

  private static buildMails(coordinates: CoordonneesEtablissement): Mail[] {
    return [coordinates.EMailPersonnalise1, coordinates.EMailPersonnalise2]
    .filter(item => item?.Mail)
    .map(item => ({
      label: item?.NomPersonnalise ?? "",
      mail: item?.Mail ?? ""
    }))
  }

  private static buildPhoneNumbers(coordinates: CoordonneesEtablissement): PhoneNumber[] {
    return [coordinates.NumPersonnalise1, coordinates.NumPersonnalise2, coordinates.NumPersonnalise3]
    .filter(item => item?.Numero)
    .map(item => ({
      label: item?.NomPersonnalise ?? "",
      number: item?.Numero ?? ""
    }))
  }

  private static buildHarassmentPolicy(establishment: InformationsEtablissements, phoneNumber?: NumeroUtile): HarassmentPolicy {
    return {
      referents: establishment.listeReferentsHarcelement.map(item => {
        const parts = item.label.split(" ");
        return {
          canChatWith: item.avecDiscussion,
          name: parts[0] ?? "",
          role: parts.slice(1).join(" ").replace(/[()]/g, "")
        };
      }),
      supportNumber: phoneNumber ? {
        label: phoneNumber.label,
        number: phoneNumber.numeroTelBrut
      } : undefined
    }
  }
}
