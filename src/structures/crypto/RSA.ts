import { PKCS1_KEM, type PublicKey } from "micro-rsa-dsa-dh/rsa.js";
import { EXPONENT_1024, MODULUS_1024 } from "../../utils/constants";
import { utf8ToBytes } from "@noble/hashes/utils.js";

export class RSA {
  public static publicKey1024: PublicKey = { e: BigInt("0x" + EXPONENT_1024), n: BigInt("0x" + MODULUS_1024) };

  public static encrypt1024(str: string | Uint8Array): string {
    const pkcs = PKCS1_KEM;
    return (pkcs.encrypt(RSA.publicKey1024, (str instanceof Uint8Array) ? str : utf8ToBytes(str))).toBase64();
  }
}
