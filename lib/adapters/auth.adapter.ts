import { SignJWT, jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export const authAdapter = {
  async sign(payload: any) {
    return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret);
  },
  async verify(token: string) {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  },
  async hashPassword(p: string) {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(p, 10);
  }
};
