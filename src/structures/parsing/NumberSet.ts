export class NumberSet {
  static parse(value: string): number[] {
    if (!value?.startsWith("[") || !value.endsWith("]")) return [];

    const inside = value.slice(1, -1).trim();
    if (!inside) return [];

    const result: number[] = [];

    for (const part of inside.split(",")) {
      const [startStr, endStr] = part.split("..").map((s) => s.trim());
      const start = Number(startStr);
      const end = Number(endStr);

      if (Number.isNaN(start)) continue;

      if (Number.isNaN(end)) {
        result.push(start);
        continue;
      }

      for (let n = start; n <= end; n++) {
        result.push(n);
      }
    }

    return result;
  }
}