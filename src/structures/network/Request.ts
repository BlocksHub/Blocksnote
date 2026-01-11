import { USER_AGENT } from "../../utils/constants.ts";
import { NetworkError } from "../errors/NetworkError.ts";
import { isExecutedWithBun } from "../../utils/runtime.ts";
import { Response } from "./Response.ts";
import type { Session } from "../Session.ts";
import { utf8ToBytes } from "@noble/hashes/utils.js";
import { inflateSync, deflateSync } from "fflate";
import { bytesToUtf8 } from "@noble/ciphers/utils.js";
import { Parser } from "../parsing/Parser.ts";
import { ParsingError } from "../errors/ParsingError.ts";

export class Request {
  public headers: Record<string, string> = {
    "User-Agent": USER_AGENT
  }

  public endpoint: string | undefined;

  public method: "GET" | "POST" = "GET";

  public payload: unknown;

  public session?: Session;

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
    this.session = session;
    this.endpoint = session.source + ["appelfonction", session.workspace.type, session.id, encryptedNumber].join("/")
    this.payload = {
      session: Number(session.id),
      no:      encryptedNumber,
      id:      fName,
      dataSec: this._processPayload(session, { data })
    }

    return this;
  }

  private _processPayload(session: Session, data: unknown) {
    if (!session.useCompression && !session.useEncryption) {
      return data
    }

    data = JSON.stringify(data);

    if (session.useCompression && typeof data === "string") {
      data = utf8ToBytes(data).toHex();
      data = deflateSync(utf8ToBytes(data as string), {
        level: 6
      })
    }

    if (session.useEncryption && data instanceof Uint8Array) {
      data = session.aes.encrypt(data)
    }

    return data;
  }

  private _processResponse(session: Session, data: string) {
    let processed = JSON.parse(data).dataSec;

    if (!processed) throw new ParsingError(-1, "Unable to parse the JSON returned by PRONOTE");

    if (session.useEncryption) {
      processed = session.aes.decrypt(processed, true)
    }

    if (session.useCompression) {
      processed = bytesToUtf8(inflateSync(processed));
      processed = JSON.parse(processed)
    }

    const parsed = Parser.parse(processed);

    if (!parsed || typeof parsed !== "object" || !("data" in parsed) || parsed.data == null) {
      throw new ParsingError(-1, "Unable to parse the JSON returned by PRONOTE");
    }

    return parsed.data;
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
      method:  this.method
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
      if (this.session) {
        this._processResponse(this.session, text)
      }
      return new Response(
        headers,
        response.status,
        (this.endpoint.includes("appelfonction") && this.session) ? this._processResponse(this.session, text) as T : JSON.parse(text) as T,
        JSON.parse(text).dataNonSec
      );
    } else {
      return new Response(headers, response.status, text as T)
    }
  }
}
