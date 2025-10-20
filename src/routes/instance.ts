import { randomBytes } from "@noble/hashes/utils.js";
import { RSA } from "../structures/crypto/RSA";
import { Request } from "../structures/network/Request";
import { Session } from "../structures/Session";
import type { FonctionsParametresRawResponse } from "../types/responses/instance";
import { Instance } from "../structures/Instance";
import type { Language } from "../types/instance";

export async function fetchInstanceInformations(session: Session): Promise<Instance> {
  const nextIv = randomBytes(16);
  const uuid = session.useHttps ? nextIv.toBase64() : RSA.encrypt1024(nextIv);

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

  return new Instance(
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
      accessibilityDeclaration: g.urlDeclarationAccessibilite
    }
  );
}