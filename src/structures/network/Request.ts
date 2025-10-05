import { USER_AGENT } from "../../utils/constants.ts";
import {NetworkError} from "../errors/NetworkError.ts";
import {isExecutedWithBun} from "../../utils/bun.ts";

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

    setPayload(session: number, no: string, id: string, data: unknown): Request {
        this.payload = {
            session,
            no,
            id,
            dataSec: data
        }
        return this;
    }

    public async send<T>(): Promise<T> {
        if (!this.endpoint) {
            throw new NetworkError("Unable to send the request due to missing parameters...");
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

        const text = await response.text();

        try {
            return JSON.parse(text) as T;
        } catch {
            return text as unknown as T;
        }
    }
}
