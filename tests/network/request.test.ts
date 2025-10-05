import { test, expect } from "bun:test";
import { Request } from "../../src/structures/network/Request.ts";

const server = Bun.serve({
    fetch(req) {
        return new Response(JSON.stringify(req.headers), { status: 200 });
    }
})

test("should update specific header", async () => {
    const request = new Request()
        .setHeader("X-Custom-Header", "@Blockshub/Blocksnote")
        .setEndpoint("localhost:" + server.port);

    const response = await request.send<Record<string, string>>()
    expect(response["x-custom-header"]).toBe("@Blockshub/Blocksnote");
})

test("should update multiple headers", async () => {
    const request = new Request()
        .setHeaders({
            "X-Custom-Header": "@Blockshub/Blocksnote",
            "X-Readme": "Star the repository"
        })
        .setEndpoint("localhost:" + server.port);

    const response = await request.send<Record<string, string>>()
    expect(response["x-custom-header"]).toBe("@Blockshub/Blocksnote");
    expect(response["x-readme"]).toBe("Star the repository");
})

test("should update endpoint", async () => {
    const request = new Request()
        .setEndpoint("localhost:" + server.port);

    expect(request.endpoint).toBe("localhost:" + server.port)
})