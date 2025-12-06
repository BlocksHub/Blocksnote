import { Session } from "./Session";

export class Attachment {
    constructor(
        public url: string
    ) {}

    public static create(
        session: Session,
        fileName: string,
        fileType: FileTypeValue,
        fileId: string, 
        prefix = "FichiersExternes"
    ) {
        const encrypted = session.aes.encrypt(JSON.stringify({N: fileId, G: fileType}))
        return new Attachment(
            [session.source,prefix,encrypted,fileName].join("/") + "?" +
            new URLSearchParams({ Session: session.id }).toString()
        );
    }
}

export const FileType = {
    NONE: "Aucun",
    TEST_SUBJECT: "EvaluationSujet",
    TEST_CORRECTION: "EvaluationCorrige",
    ASSIGNMENT_SUBJECT: "DevoirSujet",
    ASSIGNMENT_CORRECTION: "DevoirCorrige",
    HOMEWORK_SUBMISSION: "TAFRenduEleve",
    HOMEWORK_CORRECTION: "TAFCorrigeRenduEleve",
    SCHOOL_RULES: "EtablissementReglement",
    SCHOOL_CHARTER: "EtablissementCharte",
    SIGNUP_ATTACHMENT: "DocJointInscription"
}
export type FileTypeValue = typeof FileType[keyof typeof FileType];
