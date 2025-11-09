import { test, expect } from "bun:test";
import { AES } from "../../src/structures/crypto/AES.ts";
import {randomBytes} from "@noble/hashes/utils.js";

const aes = new AES();

test("should return correct ciphertext for default key/IV", () => {
    const result = aes.encrypt("1")
    expect(result).toBe("3fa959b13967e0ef176069e01e23c8d7");
});

test("should update AES key with valid 32-byte key", () => {
    expect(aes.updateKey(randomBytes(32))).toBeUndefined()
});

test("should update AES IV with valid 16-byte IV", () => {
    expect(aes.updateIv(randomBytes(16))).toBeUndefined()
});

test("should throw when updating AES IV with invalid length", () => {
    expect(() => aes.updateIv(randomBytes(8))).toThrow();
});

test("should produce different ciphertext after key and IV update", () => {
    const result = aes.encrypt("1")
    expect(result).not.toBe("3fa959b13967e0ef176069e01e23c8d7");
});

test("should correctly decrypt previously encrypted data", () => {
    const encrypted = aes.encrypt("hello, world!")
    const decrypted = aes.decrypt(encrypted);
    expect(decrypted).toBe("hello, world!")
});

test("should reset key and iv", async () => {
    aes.resetKey()
    aes.resetIv()
    const result = aes.encrypt("1")
    expect(result).toBe("3fa959b13967e0ef176069e01e23c8d7");
});