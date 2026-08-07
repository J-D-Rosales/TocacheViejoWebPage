import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  type AuthUser,
} from 'aws-amplify/auth'

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface AdminUser {
  username: string
  userId: string
  email?: string
}

export interface AuthContextValue {
  user: AdminUser | null
  isAuthenticated: boolean
  idToken: string | null
  isLoading: boolean
  /** Attempt sign-in with email + password */
  login: (email: string, password: string) => Promise<void>
  /** Sign the current user out */
  logout: () => Promise<void>
}

// ─── JWT helpers ──────────────────────────────────────────────────────────────

/** Decodifica el payload (sección media) de un JWT sin validar la firma. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const normalized = payload.replaceAll('-', '+').replaceAll('_', '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const decoded = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${c.codePointAt(0)!.toString(16).padStart(2, '0')}`)
        .join(''),
    )
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return null
  }
}

/** Extrae el claim `email` de un IdToken de Cognito, si existe. */
function getEmailFromToken(token: string | null): string | undefined {
  if (!token) return undefined
  const claims = decodeJwtPayload(token)
  const email = claims?.email
  return typeof email === 'string' && email.length > 0 ? email : undefined
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /** Hydrate auth state from an existing Amplify session on mount */
  const hydrateSession = useCallback(async () => {
    try {
      const cognitoUser: AuthUser = await getCurrentUser()
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString() ?? null
      setUser({
        username: cognitoUser.username,
        userId: cognitoUser.userId,
        email: getEmailFromToken(token),
      })
      setIdToken(token)
    } catch {
      // No active session – this is expected when the user is not logged in
      setUser(null)
      setIdToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    hydrateSession()
  }, [hydrateSession])

  // ── login ─────────────────────────────────────────────────────────────────

  const login = useCallback(async (email: string, password: string) => {
    const result = await signIn({ username: email, password })

    if (result.isSignedIn) {
      const cognitoUser: AuthUser = await getCurrentUser()
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString() ?? null
      setUser({
        username: cognitoUser.username,
        userId: cognitoUser.userId,
        email: getEmailFromToken(token),
      })
      setIdToken(token)
    } else {
      throw new Error('Autenticación incompleta. Verifica tu cuenta de Cognito.')
    }
  }, [])

  // ── logout ────────────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
    setIdToken(null)
  }, [])

  const value = useMemo(
  () => ({
    user,
    isAuthenticated: !!user,
    idToken,
    isLoading,
    login,
    logout,
  }),
  [user, idToken, isLoading, login, logout]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return ctx
}
