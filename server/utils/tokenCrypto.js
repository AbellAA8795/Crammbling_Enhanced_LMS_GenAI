import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY, "base64");

if (KEY.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes (base64-encoded).");
}

export function encryptToken(plaintext) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Store as iv:authTag:ciphertext, each hex-encoded, in one string.
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptToken(stored) {
    const [ivHex, authTagHex, dataHex] = stored.split(":");
    if (!ivHex || !authTagHex || !dataHex) {
        throw new Error("Malformed encrypted token payload.");
    }
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(dataHex, "hex")),
        decipher.final(),
    ]);
    return decrypted.toString("utf8");
}