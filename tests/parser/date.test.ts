import { test, expect } from "bun:test";
import { DateParser } from "../../src/structures/parsing/DateParser";

test("should parse date as format DD/MM/YYYY", () => {
  expect(DateParser.parse("18/09/2025").toDateString()).toBe(new Date(2025, 8, 18).toDateString());
});

test("should parse date as format DD/MM/YYYY HH:mm:ss", () => {
  expect(DateParser.parse("18/09/2025 09:45:51").toISOString()).toBe(new Date(2025, 8, 18, 9, 45, 51).toISOString());
});

test("should parse date as format DD/MM/YYYY HH:mm", () => {
  expect(DateParser.parse("18/09/2025 09:45").toISOString()).toBe(new Date(2025, 8, 18, 9, 45).toISOString());
});

test("should parse date as format EEEE HH:mm", () => {
  const now = new Date();
  const delta = (now.getDay() - (1) + 7) % 7;
  expect(DateParser.parse("lundi 13h25").toISOString()).toBe(new Date(now.getFullYear(), now.getMonth(), now.getDate() - delta, 13, 25).toISOString());
});

test("should parse date as format EEEE DD/MM", () => {
  const now = new Date();
  expect(DateParser.parse("lundi 03/10").toISOString()).toBe(new Date(now.getFullYear(), 9, 3).toISOString());
});

test("should throw error on invalid format", () => {
  expect(() => DateParser.parse("hello, world!")).toThrowError();
});
