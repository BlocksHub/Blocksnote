import { test, expect } from "bun:test";
import { NumberSet } from "../../src/structures/parsing/NumberSet";

test("should parse number set []", () => {
  expect(NumberSet.parse("[]")).toEqual([])
})

test("should parse number set [0]", () => {
  expect(NumberSet.parse("[0]")).toEqual([0])
})

test("should parse number set [0..3]", () => {
  expect(NumberSet.parse("[0..3]")).toEqual([0,1,2,3])
})

test("should parse number set [1..3,4..6]", () => {
  expect(NumberSet.parse("[1..3,4..6]")).toEqual([1,2,3,4,5,6])
})

test("should parse number set an invalid value", () => {
  expect(NumberSet.parse("")).toEqual([])
})