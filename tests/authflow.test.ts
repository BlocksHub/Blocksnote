import { test, expect } from "bun:test";
import { AuthFlow } from "../src/structures/AuthFlow";

test.each([
  "https://demo.index-education.net/pronote/eleve.html",
  "http://demo.index-education.net/pronote/eleve.html",
  "demo.index-education.net/pronote/eleve.html",
  "demo.index-education.net/pronote/parent.html",
  "https://demo.index-education.net/pronote",
  "https://demo.index-education.net/pronote/",
  "demo.index-education.net/pronote",
  "demo.index-education.net",
  "demo.index-education.net/",
  "https://demo.index-education.net//pronote///eleve.html",
  "https://demo.index-education.net/PRONOTE/ELEVE.HTML",
  "https://demo.INDEX-EDUCATION.net/pronote/EleVe.html",
  "https://demo.index-education.net/pronote/eleve.html?login=true",
  "https://demo.index-education.net/pronote/parent.html?foo=bar#section",
  "https:///demo.index-education.net/pronote/eleve.html",
  "   https://demo.index-education.net/pronote/eleve.html   ",
  "//demo.index-education.net/pronote/eleve.html"
])("should clean %s", (input) => {
  expect(AuthFlow.cleanUrl(input)).toBeOneOf(["https://demo.index-education.net/pronote/", "http://demo.index-education.net/pronote/", "https://demo.index-education.net/"])
})

test("should initialize the auth flow", async () => {
  const result = await AuthFlow.createFromURL("demo.index-education.net/pronote")

  expect(
    result.source === "https://demo.index-education.net/pronote/"
    && result.availableWorkspaces.every(item => item.delegated === false)
    && result.version.length > 0
    && !result.cas
  ).toBe(true)
})