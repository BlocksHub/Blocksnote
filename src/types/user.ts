import type { Attachment } from "../structures/Attachment"
import type { Period } from "./instance"

export type Class = {
  current: boolean,
  withGrades?: boolean,
  withFiliere?: boolean,
  shortLabel: string,
  longLabel?: string
}

export type Tab = {
  periods?: Period[]
}

export type HarassmentPolicy = {
  referents: HarassmentReferent[];
  supportNumber?: PhoneNumber;
}

export type HarassmentReferent = {
  canChatWith: boolean;
  name: string;
  role?: string;
}

export type Establishment = {
  name: string;
  id: string;
  logo: string;
  website: string;
  location: Coordinates;
  mails: Mail[];
  phoneNumbers: PhoneNumber[];
  rules?: Attachment;
  charter?: Attachment;
  harassmentPolicy: HarassmentPolicy;
}

export type Mail = {
  mail: string;
  label: string;
}

export type PhoneNumber = {
  number: string;
  label: string;
}

export type Coordinates = {
  address: string;
  postalCode: string;
  city: string;
  province: string;
}
