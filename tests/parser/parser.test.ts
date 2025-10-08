import { test, expect } from "bun:test";
import { Parser } from "../../src/structures/parsing/Parser";

test("should correctly parse label", () => {
  expect(JSON.stringify(Parser.parse({L: "Blocksnote"}))).toBe('{"label":"Blocksnote"}');
});

test("should correctly parse id", () => {
  expect(JSON.stringify(Parser.parse({N: "Blocksnote"}))).toBe('{"id":"Blocksnote"}');
});

test("should correctly parse label & id", () => {
  expect(JSON.stringify(Parser.parse({L: "Blockshub", N: "Blocksnote"}))).toBe('{"label":"Blockshub","id":"Blocksnote"}');
});

test("should correctly parse date with _T & V", () => {
  expect((Parser.parse({ _T: 7, V: "18/09/2025" }) as Date).toISOString()).toBe(new Date(2025, 8, 18).toISOString());
});