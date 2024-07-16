import { sign as JWTSign, verify as JWTVerify } from "jsonwebtoken";

export interface SignOptions {
  algorithm?: string;
  keyid?: string;
  expiresIn?: string | number;
  notBefore?: string | number;
  audience?: string | string[];
  subject?: string;
  issuer?: string;
  jwtid?: string;
  mutatePayload?: boolean;
  noTimestamp?: boolean;
  header?: any;
  encoding?: string;
  allowInsecureKeySizes?: boolean;
  allowInvalidAsymmetricKeyTypes?: boolean;
}

export function sign(
  payload: object,
  secretKey: string,
  options?: SignOptions,
): string {
  const key = Buffer.from(secretKey, "base64").toString("ascii");

  return JWTSign(payload, key, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verify<T>(token: string | null, publicKey: string): T | null {
  if (!token) return null;

  try {
    const key = Buffer.from(publicKey, "base64").toString("ascii");

    return JWTVerify(token, key) as T;
  } catch (error) {
    return null;
  }
}
