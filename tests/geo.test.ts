import { test, expect } from "bun:test";
import { searchSchoolsWithGeo } from "../src/routes/geolocation";
import { School } from "../src/structures/School";

test("should the function return the correct first result from", async () => {
  const result = await School.locate(48.733333, -3.466667, 1)
  expect(result[0] !== undefined && result[0].name !== undefined).toBe(true)
});

test("should the class return the correct first result", async () => {
  const result = await searchSchoolsWithGeo(48.733333, -3.466667, 1)
  expect(result[0] !== undefined && result[0].name !== undefined).toBe(true)
});
