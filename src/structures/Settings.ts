import { randomBytes } from "@noble/hashes/utils.js";
import type { 
  EnvironmentSettings, 
  EvaluationSettings, 
  GradingSettings, 
  Language, 
  Period, 
  Permissions, 
  PublicationSettings, 
  Ressources, 
  ScheduleSettings, 
  SchoolInfo
} from "../types/instance";
import type { Session } from "./Session";
import { RSA } from "./crypto/RSA";
import { Request } from "./network/Request";
import type { FonctionsParametresRawResponse } from "../types/responses/instance";

export class Settings {
  constructor(
    public productName: string,
    public version: number[],
    public isDemo: boolean,
    public school: SchoolInfo,
    public schoolYear: number[],
    public publication: PublicationSettings,
    public grading: GradingSettings,
    public availableLanguages: Language[],
    public currentLanguage: Language,
    public environment: EnvironmentSettings,
    public schedule: ScheduleSettings,
    public evaluation: EvaluationSettings,
    public permissions: Permissions,
    public ressources?: Ressources,
    public periods?: Period[]
  ) {}

  public static async load(session: Session): Promise<Settings> {
    const nextIv = randomBytes(16);
    const uuid = session.useHttps ? Buffer.from(nextIv).toString('base64') : RSA.encrypt1024(nextIv);
  
    const request = new Request()
      .setPronotePayload(session, "FonctionParametres", {
        Uuid: uuid,
        identifiantNav: null
      });
    session.aes.updateIv(nextIv);
  
    const response = (await session.manager.enqueueRequest<FonctionsParametresRawResponse>(request))
      .data;
  
    const g = response.General;
    const languages: Language[] = g.listeLangues.map(l => ({ id: l.langID, label: l.description }));
    const currentLang = languages.find(l => l.id === +g.langID) ?? languages[0];
  
    return new Settings(
      g.nomProduit,
      response.tableauVersion,
      !!response.DateDemo,
      {
        longName: g.NomEtablissementConnexion,
        shortName: g.NomEtablissement,
        logoUrl: g.urlLogo
      },
      g.AnneeScolaire.split("-").map(Number),
      {
        defaultDelayDays: g.NbJDecalageDatePublicationParDefaut,
        parentDelayDays: g.NbJDecalagePublicationAuxParents,
        hasDelayedEvalPublication: g.AvecAffichageDecalagePublicationEvalsAuxParents,
        hasDelayedGradePublication: g.AvecAffichageDecalagePublicationNotesAuxParents
      },
      {
        scale: g.BaremeNotation,
        maxGrade: g.BaremeMaxDevoirs
      },
      languages,
      currentLang!,
      {
        serverDate: new Date(response.DateServeurHttp),
        isShowedInENT: response.estAfficheDansENT,
        isAccessibilityCompliant: !!g.accessibiliteNonConforme,
        isForNewCaledonia: response.pourNouvelleCaledonie,
        isHostedInFrance: g.estHebergeEnFrance
      },
      {
        seatsPerDay: g.PlacesParJour,
        seatsPerHour: g.PlacesParHeure,
        sequenceDuration: g.DureeSequence,
        hasFullAfternoonHours: g.AvecHeuresPleinesApresMidi,
        nextOpenDay: new Date(g.JourOuvre),
        openDaysPerCycle: g.joursOuvresParCycle,
        firstWeek: g.premierJourSemaine,
        firstMonday: new Date(g.PremierLundi),
        firstDate: new Date(g.PremiereDate),
        lastDate: new Date(g.DerniereDate),
        recreations: g.recreations.map(r => ({ seat: r.place, label: r.label })),
        publicHolidays: g.listeJoursFeries.map(j => ({
          label: j.label,
          from: new Date(j.dateDebut),
          to: new Date(j.dateFin)
        }))
      },
      {
        acquisitionLevels: g.ListeNiveauxDAcquisitions.map(l => ({
          label: l.label,
          abbreviation: l.abbreviation,
          color: l.couleur,
          weight: l.positionJauge,
          isAcquired: l.estAcqui,
          countForSuccessRateCalculation: l.estNotantPourTxReussite,
          pointsForBrevet: l.nombrePointsBrevet
        })),
        hasEvaluationHistory: g.AvecEvaluationHistorique,
        qcm: {
          minScore: g.minBaremeQuestionQCM,
          maxScore: g.maxBaremeQuestionQCM,
          maxPoints: g.maxNbPointQCM,
          maxLevel: g.maxNiveauQCM
        }
      },
      {
        parentCanChangePassword: g.parentAutoriseChangerMDP,
        allowConnectionInfoRecovery: g.AvecRecuperationInfosConnexion,
        isBlogEnabled: g.activerBlog,
        isForumEnabled: g.avecForum,
        isParentMessagingEnabled: g.ActivationMessagerieEntreParents,
        isExcellencePathwayManagementEnabled: g.GestionParcoursExcellence
      },
      {
        confidentialityPolicy: response.urlConfidentialite,
        indexEducationWebsite: g.urlSiteIndexEducation,
        hostingInfo: g.urlSiteInfosHebergement,
        support: g.UrlAide,
        faqTwoFactorRegistration: g.urlFAQEnregistrementDoubleAuth,
        securityTutorialVideo: g.urlTutoVideoSecurite,
        registerDevicesTutorial: g.urlTutoEnregistrerAppareils,
        canope: g.urlCanope,
        accessibilityDeclaration: session.source + g.urlDeclarationAccessibilite
      },
      g.ListePeriodes.map(period => ({
        label: period.label,
        startDate: period.dateDebut,
        endDate: period.dateFin,
        id: period.id
      }))
    )
  }
}
