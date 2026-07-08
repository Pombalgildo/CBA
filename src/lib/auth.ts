// Autenticação simples baseada em tokens HMAC assinados
import { scryptSync, randomBytes, createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.ADMIN_SECRET || 'cba-secret-key-change-in-production-2026'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':')
    const hashBuf = Buffer.from(hash, 'hex')
    const testBuf = Buffer.from(scryptSync(password, salt, 64).toString('hex'), 'hex')
    if (hashBuf.length !== testBuf.length) return false
    return timingSafeEqual(hashBuf, testBuf)
  } catch {
    return false
  }
}

// Cria um token assinado: base64(payload).base64(sig)
export function createToken(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString('base64url')
  const sig = createHmac('sha256', SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [data, sig] = token.split('.')
    if (!data || !sig) return null
    const expectedSig = createHmac('sha256', SECRET).update(data).digest('base64url')
    const sigBuf = Buffer.from(sig)
    const expBuf = Buffer.from(expectedSig)
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.exp && Date.now() > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function getTokenFromRequest(request: Request): Record<string, unknown> | null {
  const auth = request.headers.get('authorization') || request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  return verifyToken(token)
}
