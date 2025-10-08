import { ParsingError } from "../errors/ParsingError";
import { DateParser } from "./DateParser";

export class Parser {
  static parse<T>(obj: unknown): T {
    if (obj === null || typeof obj !== 'object') {
      return obj as T;
    }

    const o = obj as Record<string, unknown>;

    const hasType = Object.prototype.hasOwnProperty.call(o, '_T');
    const hasLabel = Object.prototype.hasOwnProperty.call(o, 'L');
    const hasId = Object.prototype.hasOwnProperty.call(o, 'N');
    const hasValue = Object.prototype.hasOwnProperty.call(o, 'V');

    if (hasLabel) {
        o['label'] = o['L']
        delete o['L']
    }

    if (hasId) {
        o['id'] = o['N']
        delete o['N']
    }

    if (hasType && hasValue) {
      const result = this.handleType(o['_T'] as number, o['V']);
      return result as T;
    }

    if (Array.isArray(o)) {
      for (let i = 0; i < (o as unknown[]).length; i++) {
        (o as unknown[])[i] = this.parse((o as unknown[])[i]);
      }
      return o as T;
    }

    for (const [key, value] of Object.entries(o)) {
      o[key] = this.parse(value);
    }

    return o as T;
  }

  static handleType(t: number, v: unknown): unknown {
    switch (t) {
      case 26: {
        const parsed = JSON.parse(v as string);
        return this.parse(parsed);
      }
      case 7:
        return DateParser.parse(v as string);
      case 24:
      case 10:
      case 25:
      case 21:
        return this.parse(v);
      default:
        throw new ParsingError(t, v);
    }
  }
}