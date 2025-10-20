import { test, expect } from "bun:test";
import { Request } from "../../src/structures/network/Request.ts";
import { RequestManager } from "../../src/structures/network/RequestManager.ts";
import { Session } from "../../src/structures/Session.ts";
import { NOTSpace } from "../../src/index.ts";

let count = 0
const manager = new RequestManager();

const server = Bun.serve({
    fetch(req) {
        count++;
        return new Response(JSON.stringify(req.headers), { status: 200, headers: {"X-Request-Count": String(count), "Content-Type": "application/json"} });
    }
})

test("should update specific header", async () => {
    const request = new Request()
        .setHeader("X-Custom-Header", "@Blockshub/Blocksnote")
        .setEndpoint("localhost:" + server.port);

    const response = await request.send<Record<string, string>>()
    expect(response.data["x-custom-header"]).toBe("@Blockshub/Blocksnote");
})

test("should update multiple headers", async () => {
    const request = new Request()
        .setHeaders({
            "X-Custom-Header": "@Blockshub/Blocksnote",
            "X-Readme": "Star the repository"
        })
        .setEndpoint("localhost:" + server.port);

    const response = await request.send<Record<string, string>>()
    expect(response.data["x-custom-header"]).toBe("@Blockshub/Blocksnote");
    expect(response.data["x-readme"]).toBe("Star the repository");
})

test("should update endpoint", async () => {
    const request = new Request()
        .setEndpoint("localhost:" + server.port);

    expect(request.endpoint).toBe("localhost:" + server.port)
})

test("should update method", async () => {
    const request = new Request()
        .setMethod("POST");

    expect(request.method).toBe("POST")
})

test("should update body", async () => {
    const request = new Request()
        .setBody("hello, world!");

    expect(request.payload).toBe("hello, world!")
})

test("should update payload", async () => {
    const session = await Session.initialize("https://demo.index-education.net/pronote/", { url: "mobile.eleve.html", type: NOTSpace.STUDENT, delegated: false, name: "Blocks" });
    const request = new Request()
        .setPronotePayload(session, "Blocksnote", {});

    expect(request.endpoint?.includes("appelfonction") && request.endpoint?.includes(session.id)).toBe(true);
})

test("should serialize requests", async () => {
    const first = new Request().setEndpoint("localhost:" + server.port);
    const second = new Request().setEndpoint("localhost:" + server.port);

    const firstCall = await manager.enqueueRequest<Record<string, string>>(first)
    const secondCall = await manager.enqueueRequest<Record<string, string>>(second)

    expect((Number(firstCall.header("X-Request-Count")) === 3 && Number(secondCall.header("X-Request-Count")) === 4)).toBe(true)
})

test("should throw error on missing parameters", async () => {
    const request = new Request();
    expect(async () => await request.send()).toThrow();
})
