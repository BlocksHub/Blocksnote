import { test, expect } from "bun:test";
import { Request } from "../../src/structures/network/Request.ts";
import { RESTManager } from "../../src/structures/network/RESTManager.ts";

let count = 0
const manager = new RESTManager();

const server = Bun.serve({
    fetch(req) {
        count++;
        return new Response(JSON.stringify(req.headers), { status: 200, headers: {"X-Request-Count": String(count)} });
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

test("should update payload", async () => {
    const request = new Request()
        .setPronotePayload(245934, "Blocksnote", "UpdatePayload", {});

    expect(JSON.stringify(request.payload)).toBe("{\"session\":245934,\"no\":\"Blocksnote\",\"id\":\"UpdatePayload\",\"dataSec\":{}}")
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
