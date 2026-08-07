import type {
  SchoolEvent,
  SchoolAward,
  CreateAwardPayload,
  CreateEventPayload,
  MediaUploadFile,
  UploadTarget,
} from '../types'

/**
 * Base URL de la API del colegio Tocache Viejo.
 * Configurada vía VITE_API_BASE_URL (ver .env.example).
 */
let API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL ||
    'https://api.tocacheviejo.edu.pe/v1',
)

while (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1)
}

async function toJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail: string
    try {
      const body = await res.json()
      detail = typeof body === 'string' ? body : JSON.stringify(body)
    } catch {
      detail = res.statusText
    }
    const errorDetail = detail ? `: ${detail}` : ''
    throw new Error(`HTTP ${res.status}${errorDetail}`)
  }
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

function headers(token?: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export const apiService = {
  /**
   * Retorna la URL base configurada para la API
   */
  getApiBaseUrl(): string {
    return API_BASE_URL
  },

  // ── Events ────────────────────────────────────────────────────────────────

  /** GET /events — público. Soporta filtro opcional por año. */
  async getEvents(year?: number): Promise<SchoolEvent[]> {
    const query = year ? `?year=${year}` : ''
    const res = await fetch(`${API_BASE_URL}/events${query}`)
    const data = await toJson<SchoolEvent[]>(res)
    return Array.isArray(data) ? data : []
  },

  /** GET /events/{id} — público. Devuelve el evento con URLs de media. */
  async getEvent(id: string): Promise<SchoolEvent> {
    const res = await fetch(`${API_BASE_URL}/events/${id}`)
    return await toJson<SchoolEvent>(res)
  },

  /** POST /events — protegido. Crea un evento con sus mediaItems. */
  async createEvent(payload: CreateEventPayload, idToken: string): Promise<SchoolEvent> {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: headers(idToken),
      body: JSON.stringify(payload),
    })
    const data = await toJson<{ event?: SchoolEvent }>(res)
    return data.event ?? (data as unknown as SchoolEvent)
  },

  /** DELETE /events/{id} — protegido. Elimina evento, media y archivos S3. */
  async deleteEvent(id: string, idToken: string): Promise<void> {
    await toJson(
      await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: headers(idToken),
      }),
    )
  },

  // ── Media Upload ──────────────────────────────────────────────────────────

  /** POST /media/upload-urls — protegido. Solicita URLs pre-firmadas de S3. */
  async getUploadUrls(
    payload: { year: number; eventId: string; files: MediaUploadFile[] },
    idToken: string,
  ): Promise<UploadTarget[]> {
    const res = await fetch(`${API_BASE_URL}/media/upload-urls`, {
      method: 'POST',
      headers: headers(idToken),
      body: JSON.stringify(payload),
    })
    const data = await toJson<{ uploadTargets?: UploadTarget[] }>(res)
    return data.uploadTargets ?? []
  },

  // ── Awards ────────────────────────────────────────────────────────────────

  /** GET /awards — público. */
  async getAwards(): Promise<SchoolAward[]> {
    const res = await fetch(`${API_BASE_URL}/awards`)
    const data = await toJson<SchoolAward[]>(res)
    return Array.isArray(data) ? data : []
  },

  /** POST /awards — protegido. Crea un premio. */
  async createAward(payload: CreateAwardPayload, idToken: string): Promise<SchoolAward> {
    const res = await fetch(`${API_BASE_URL}/awards`, {
      method: 'POST',
      headers: headers(idToken),
      body: JSON.stringify(payload),
    })
    const data = await toJson<{ award?: SchoolAward }>(res)
    return data.award ?? (data as unknown as SchoolAward)
  },

  /** PUT /awards/{id} — protegido. Actualiza un premio existente. */
  async updateAward(
    id: string,
    payload: Partial<CreateAwardPayload>,
    idToken: string,
  ): Promise<SchoolAward> {
    const res = await fetch(`${API_BASE_URL}/awards/${id}`, {
      method: 'PUT',
      headers: headers(idToken),
      body: JSON.stringify(payload),
    })
    const data = await toJson<{ award?: SchoolAward }>(res)
    return data.award ?? (data as unknown as SchoolAward)
  },

  /** DELETE /awards/{id} — protegido. Elimina un premio. */
  async deleteAward(id: string, idToken: string): Promise<void> {
    await toJson(
      await fetch(`${API_BASE_URL}/awards/${id}`, {
        method: 'DELETE',
        headers: headers(idToken),
      }),
    )
  },
}
