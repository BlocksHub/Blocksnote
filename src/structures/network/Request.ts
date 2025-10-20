import { USER_AGENT } from "../../utils/constants.ts";
import {NetworkError} from "../errors/NetworkError.ts";
import {isExecutedWithBun} from "../../utils/runtime.ts";
import { Response } from "./Response.ts";
import type { Session } from "../Session.ts";

export class Request {
    public headers: Record<string, string> = {
        "User-Agent": USER_AGENT
    }
    public endpoint: string | undefined;
    public method: "GET" | "POST" = "GET";
    public payload: unknown;

    setHeader(key: string, value: string): Request {
        this.headers[key] = value;
        return this;
    }

    setHeaders(values: Record<string, string>): Request {
        this.headers = values;
        return this
    }

    setEndpoint(endpoint: string): Request {
        this.endpoint = endpoint;
        return this;
    }

    setMethod(method: "GET" | "POST"): Request {
        this.method = method;
        return this;
    }

    setBody(body: unknown): Request {
        this.payload = body
        return this;
    }

    setPronotePayload(session: Session, fName: string, data: unknown): Request {
        const encryptedNumber = session.aes.encrypt(String(session.manager.requestNumber + 1));

        this.method = "POST";
        this.endpoint = session.source + ["appelfonction", session.workspace.type, session.id, encryptedNumber].join("/")
        this.payload = {
            session: Number(session.id),
            no: encryptedNumber,
            id: fName,
            dataSec: { data: data }
        }
        return this;
    }

    public async send<T>(): Promise<Response<T>> {
        if (!this.endpoint) {
            throw new NetworkError("Unable to send the request due to missing parameters...", 400);
        }

        const requester =
            isExecutedWithBun() && typeof Bun.fetch === "function"
                ? Bun.fetch
                : fetch;

        const init: RequestInit = {
            headers: this.headers,
            method: this.method,
        };

        if (this.payload !== undefined) {
            init.body =
                typeof this.payload === "string" || this.payload instanceof FormData
                    ? this.payload
                    : JSON.stringify(this.payload);

            if (typeof this.payload === "object" && !(this.payload instanceof FormData)) {
                this.headers["Content-Type"] = "application/json";
            }
        }

        const response = await requester(this.endpoint, init);

        const headers = Object.fromEntries(response.headers.entries());
        const contentType = headers["content-type"]
        const text = await response.text();

        if (contentType?.includes("json")) {
            return new Response(headers, response.status, this.endpoint.includes("appelfonction") ? JSON.parse(text).dataSec.data : JSON.parse(text) as T);
        } else {
            return new Response(headers, response.status, text as T)
        }
    }
}
