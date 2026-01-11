import { ParsingError } from "../errors/ParsingError";

export class DateParser {
  private static readonly shortDateRegex = /^\w+\s\d{2}h\d{2}/;

  private static readonly shortPreciseDateRegex = /^\w+\s\d{2}\/\d{2}/;

  private static readonly frenchDays: Record<string, number> = {
    lundi:    1,
    mardi:    2,
    mercredi: 3,
    jeudi:    4,
    vendredi: 5,
    samedi:   6,
    dimanche: 0
  };

  static parse(v: string) {
    if (DateParser.shortDateRegex.test(v)) {
      return DateParser.shortDate(v)
    }

    if (DateParser.shortPreciseDateRegex.test(v)) {
      return DateParser.shortPreciseDate(v)
    }

    return DateParser.fullDate(v);
  }

  static shortPreciseDate(v: string) {
    const now = new Date();
    const segments = v.split(" ")[1]?.split("/");

    if (!segments || !segments[0] || !segments[1]) throw new ParsingError(7, v);

    const day = Number(segments[0]);
    const month = Number(segments[1]) - 1;
    const year = month <= 8 ? now.getFullYear() + 1 : now.getFullYear();

    return new Date(year, month, day);
  }

  static shortDate(v: string) {
    const now = new Date();
    const segments = v.split(" ")

    if (!segments || !segments[0] || !segments[1]) throw new ParsingError(7, v);

    const hourSegment = segments[1].split("h");
    const day = DateParser.frenchDays[String(segments[0])];
    const hour = Number(hourSegment[0]);
    const minutes = Number(hourSegment[1]);
    const delta = (now.getDay() - (day ?? 0) + 7) % 7;

    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - delta, hour, minutes);
  }

  static fullDate(v: string) {
    const [daySegment, hourSegment] = v.split(" ");

    if (!daySegment) {
      throw new ParsingError(7, v);
    }

    const parsedDay = daySegment.split("/");
    const parsedHour = hourSegment?.split(":") ?? ["0", "0", "0"];

    if (
      !parsedDay[0] ||
      !parsedDay[1] ||
      !parsedDay[2] ||
      !parsedHour[0] ||
      !parsedHour[1]
    ) {
      throw new ParsingError(7, v);
    }

    const year = parseInt(parsedDay[2], 10);
    const month = parseInt(parsedDay[1], 10) - 1;
    const day = parseInt(parsedDay[0], 10);
    const hour = parseInt(parsedHour[0], 10);
    const minutes = parseInt(parsedHour[1], 10);
    const seconds = parseInt(parsedHour[2] ?? "0", 10);

    if ([year, month, day, hour, minutes, seconds].some((n) => isNaN(n))) {
      throw new ParsingError(7, v);
    }

    return new Date(year, month, day, hour, minutes, seconds);
  }
}