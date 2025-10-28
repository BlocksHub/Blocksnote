import { test, expect } from "bun:test";
import { Authenticator } from "../src/structures/Authenticator";

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
  expect(Authenticator.cleanUrl(input)).toBeOneOf(["https://demo.index-education.net/pronote/", "http://demo.index-education.net/pronote/", "https://demo.index-education.net/"])
})

const instance = await Authenticator.createFromURL("demo.index-education.net/pronote")

test("should initialize the auth flow", async () => {
  expect(
    instance.source === "https://demo.index-education.net/pronote/"
    && instance.availableWorkspaces.every(item => item.delegated === false)
    && instance.version.length > 0
    && !instance.cas
  ).toBe(true)
})
