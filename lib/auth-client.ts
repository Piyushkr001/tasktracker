import jwt from 'jsonwebtoken'

export function verifyTokenClient(token: string): boolean {
  try {
    const decoded = jwt.decode(token)
    if (!decoded || typeof decoded === 'string') return false

    const exp = (decoded as any).exp
    return exp ? Date.now() < exp * 1000 : false
  } catch {
    return false
  }
}
