
export type FonctionsParametresRawResponse = {
  identifiantNav:        string;
  estAfficheDansENT:     boolean;
  pourNouvelleCaledonie: boolean;
  tableauVersion:        number[];
  urlConfidentialite:    string;
  DateServeurHttp:       string;
  DateDemo:              string;
  General: {
    urlSiteIndexEducation:                           string;
    urlSiteInfosHebergement:                         string;
    nomProduit:                                      string;
    langue:                                          string;
    langID:                                          string;
    listeLangues:                                    Array<{ langID: number; description: string }>;
    estHebergeEnFrance:                              boolean;
    avecForum:                                       boolean;
    UrlAide:                                         string;
    urlAccesVideos:                                  string;
    urlAccesTwitter:                                 string;
    urlFAQEnregistrementDoubleAuth:                  string;
    urlTutoVideoSecurite:                            string;
    urlTutoEnregistrerAppareils:                     string;
    urlCanope:                                       string;
    accessibiliteNonConforme:                        boolean;
    urlDeclarationAccessibilite:                     string;
    NomEtablissement:                                string;
    NomEtablissementConnexion:                       string;
    numeroPremiereSemaine:                           number;
    AnneeScolaire:                                   string;
    dateDebutPremierCycle:                           string;
    PremierLundi:                                    string;
    PremiereDate:                                    string;
    DerniereDate:                                    string;
    PlacesParJour:                                   number;
    PlacesParHeure:                                  number;
    DureeSequence:                                   number;
    PlaceDemiJourneeAbsence:                         number;
    valeurDefautPresenceDispense:                    boolean;
    activationDemiPension:                           boolean;
    JourOuvre:                                       string;
    JoursOuvres:                                     number[];
    ActivationMessagerieEntreParents:                boolean;
    GestionParcoursExcellence:                       boolean;
    activerBlog:                                     boolean;
    joursOuvresParCycle:                             number;
    premierJourSemaine:                              number;
    DomainesFrequences:                              number[];
    LibellesFrequences:                              string[];
    BaremeNotation:                                  number;
    BaremeMaxDevoirs:                                number;
    AvecHeuresPleinesApresMidi:                      boolean;
    NbJDecalageDatePublicationParDefaut:             number;
    NbJDecalagePublicationAuxParents:                number;
    AvecAffichageDecalagePublicationNotesAuxParents: boolean;
    AvecAffichageDecalagePublicationEvalsAuxParents: boolean;
    ListeNiveauxDAcquisitions:                       rawSkillLevel[];
    AvecEvaluationHistorique:                        boolean;
    minBaremeQuestionQCM:                            number;
    maxBaremeQuestionQCM:                            number;
    maxNbPointQCM:                                   number;
    maxNiveauQCM:                                    number;
    AvecRecuperationInfosConnexion:                  boolean;
    parentAutoriseChangerMDP:                        boolean;
    listeJoursFeries: Array<{
      label:     string;
      dateDebut: Date;
      dateFin:   Date;
    }>;
    ListePeriodes: Array<{
      periodeNotation: number;
      dateDebut:       Date;
      dateFin:         Date;
      label:           string;
      id:              string;
    }>;
    urlLogo:                              string;
    recreations:                          Array<{ place: number; label: string }>;
    tailleMaxEnregistrementAudioRenduTAF: number;
  };
}

interface rawSkillLevel {
  G:                    number;
  P:                    number;
  listePositionnements: Array<{
    G:                        number;
    abbreviation:             string;
    abbreviationAvecPrefixe?: string;
    label:                    string;
  }>;
  positionJauge:            number;
  actifPour:                number[];
  abbreviation:             string;
  raccourci:                string;
  raccourciPositionnement:  string;
  label:                    string;
  id:                       number;
  couleur?:                 string;
  ponderation?:             string;
  nombrePointsBrevet?:      number;
  estAcqui?:                boolean;
  estNonAcqui?:             boolean;
  estNotantPourTxReussite?: boolean;
}
