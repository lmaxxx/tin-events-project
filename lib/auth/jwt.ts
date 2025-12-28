import { SignJWT, jwtVerify } from 'jose';

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const EXPIRATION_TIME = '7d';

export async function generateToken(payload: JWTPayload): Promise<string> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION_TIME)
    .sign(secret);

  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}
