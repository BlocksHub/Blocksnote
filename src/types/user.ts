import type { Attachment } from "../structures/Attachment"
import type { Period } from "./instance"

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

export type CommonSizeLimits = {
  circumstancesMaxSize: number,
  commentMaxSize: number,
  establishmentAttachmentMaxSize: number,
  homeworkMaxSize: number
}

export type StudentSizeLimits = CommonSizeLimits & {
  studentHomeworkMaxSize: number
}

export type SizeLimites = CommonSizeLimits | StudentSizeLimits;

export type CommonPermissions = {
 canChat: boolean,
 canChatWithStaff: boolean,
 canChatWithTeachers: boolean,
 canPrintGradesReport: boolean,
 canViewAdministrativeDataFromStudents: boolean,
 canViewPersonnalData: boolean,
 sizes: CommonSizeLimits
}

export type StudentPermissions = CommonPermissions & {
  size: StudentSizeLimits
}

export type ParentPermissions = CommonPermissions & {
  canEditPersonalInfoAuthorizations: boolean,
  canEditPersonalInfoCoordinates: boolean,
  canChatWithParents: boolean
}

export type UserPermissions = CommonPermissions | StudentPermissions | ParentPermissions;