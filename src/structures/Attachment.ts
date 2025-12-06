import type { FileTypeValue } from "../types/attachments";
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
