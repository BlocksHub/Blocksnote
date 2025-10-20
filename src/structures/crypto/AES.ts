import { CryptographicError } from "../errors/CryptographicError.ts";
import { md5 } from "@noble/hashes/legacy.js";
import { cbc } from "@noble/ciphers/aes.js";
import {type CipherWithOutput, utf8ToBytes, bytesToHex, bytesToUtf8} from "@noble/ciphers/utils.js";
import {hexToBytes} from "@noble/hashes/utils.js";

export class AES {
    private key: Uint8Array<ArrayBufferLike> = new Uint8Array(0);
    private iv: Uint8Array<ArrayBufferLike> = new Uint8Array(0);
    private _dK = this._derivativeKey()
    private _dIV = this._derivativeIv()

    constructor(key?: Uint8Array<ArrayBuffer>, iv?: Uint8Array<ArrayBuffer> ) {
        if (key) { this.key = key; this._dK = this._derivativeKey() };
        if (iv) { this.iv = iv; this._dIV = this._derivativeIv() };
    }

    public encrypt(utf8: string) {
        const cipher: CipherWithOutput = cbc(this._dK, this._dIV);
        const encrypted = cipher.encrypt(utf8ToBytes(utf8));
        return bytesToHex(encrypted);
    }

    public decrypt(hex: string) {
        const cipher: CipherWithOutput = cbc(this._dK, this._dIV);
        const decrypted = cipher.decrypt(hexToBytes(hex));
        return bytesToUtf8(decrypted);
    }

    public updateKey(key: Uint8Array<ArrayBufferLike>) {
        if (key.length !== 32) {
            throw new CryptographicError(
                `AES-256-CBC requires a 32-byte key (256 bits), but you provided a ${key.length}-byte key (${key.length * 8} bits). ` +
                `If you intend to reset the current AES key, please use the resetKey() method instead.`
            );
        }
        this.key = key;
        this._dK = this._derivativeKey();
    }

    public updateIv(iv: Uint8Array<ArrayBufferLike>) {
        if (iv.length !== 16) {
            throw new CryptographicError(
                `AES-256-CBC requires a 16-byte initialization vector (128 bits), but you provided a ${iv.length}-byte initialization vector (${iv.length * 8} bits). ` +
                `If you intend to reset the current AES initialization vector, please use the resetIv() method instead.`
            );
        }
        this.iv = iv;
        this._dIV = this._derivativeIv();
    }

    public resetKey() {
        this.key = new Uint8Array(0);
        this._dK = this._derivativeKey();
    }

    public resetIv() {
        this.iv = new Uint8Array(0);
        this._dIV = this._derivativeIv();
    }

    protected _derivativeKey() {
        return md5(this.key);
    }

    protected _derivativeIv() {
        return this.iv.length ? md5(this.iv) : new Uint8Array(16);
    }
}