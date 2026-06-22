import { type GradeValue, type EvaluationStatusType, EvaluationStatus } from "@/types/grades";

export class GradeParser {
  public static parse(value: number | string, outOf: number): GradeValue {
    let status: EvaluationStatusType = EvaluationStatus.GRADED;
    let numericValue: number;

    if (typeof value === "string") {
      const cleanValue = Number(value.replace(/\|/g, ""));
      const isKnownStatus = Object.values(EvaluationStatus).includes(cleanValue as EvaluationStatusType);

      status = isKnownStatus ? (cleanValue as EvaluationStatusType) : EvaluationStatus.ERROR;
      numericValue = status === EvaluationStatus.GRADED ? cleanValue : -1;
    } else {
      numericValue = value;
    }

    return {
      value:    numericValue,
      outOf,
      status,
      disabled: status === EvaluationStatus.ABSENT_WITH_ZERO || status === EvaluationStatus.MISSING_WITH_ZERO
    };
  }
}