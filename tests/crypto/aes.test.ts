import { test, expect } from "bun:test";
import { AES } from "../../src/structures/crypto/AES.ts";

const aes = new AES();

test("AES Benchmark (1k)", () => {
    let i = 0;
    while (i < 1e3) {
        aes.encrypt(String(i));
        i++
    }
    expect(Bun.nanoseconds()).toBeLessThan(70000000);
});

test("AES Benchmark (10k)", () => {
    let i = 0;
    while (i < 1e4) {
        aes.encrypt(String(i));
        i++
    }
    expect(Bun.nanoseconds()).toBeLessThan(130000000);
});

test("AES Benchmark (100k)", () => {
    let i = 0;
    while (i < 1e5) {
        aes.encrypt(String(i));
        i++
    }
    expect(Bun.nanoseconds()).toBeLessThan(4e9);
});

test("AES Initialisation", () => {
    const result = aes.encrypt("1")
    expect(result).toBe("3fa959b13967e0ef176069e01e23c8d7");
});
