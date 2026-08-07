import { useState, useRef, useEffect, useCallback, type FormEvent, type ChangeEvent, type ReactNode } from 'react'
import imageCompression from 'browser-image-compression'
import type { Page, SchoolEvent, SchoolAward, CreateAwardPayload, EventMediaItemInput } from '../types'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../services/apiService'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FieldLabel({ children }: {readonly children: ReactNode }) {
  return (
    <label className="mb-[5px] block text-[0.85rem] font-extrabold uppercase tracking-[0.1em] text-navy-800">
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-2xl border-2 border-slate-200 px-3.5 py-3 text-[0.95rem] tracking-wide outline-none transition-colors duration-200 focus:border-navy-800 focus:ring-2 focus:ring-blue-100'

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  readonly value: string
  readonly onChange: (v: string) => void
  readonly placeholder?: string
  readonly type?: string
  readonly required?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={inputClass}
    />
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  readonly value: string
  readonly onChange: (v: string) => void
  readonly placeholder?: string
  readonly rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${inputClass} resize-y font-sans`}
    />
  )
}

function Select({
  value,
  onChange,
  children,
  required,
}: {
  readonly value: number | string
  readonly onChange: (v: number | string) => void
  readonly children: ReactNode
  readonly required?: boolean
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={`${inputClass} cursor-pointer bg-white`}
    >
      {children}
    </select>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-[0.9rem] font-bold tracking-wide text-red-700"
    >
      <span className="shrink-0">⚠️</span>
      {message}
    </div>
  )
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border-2 border-green-200 bg-green-50 px-4 py-3 text-[0.9rem] font-bold tracking-wide text-green-700">
      ✅ {message}
    </div>
  )
}

const MAX_VIDEO_MB = 200

/** Comprime una imagen a WebP (máx ~0.5MB, 1920px) antes de subirla a S3. */
async function compressImageFile(file: File): Promise<File> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    fileType: 'image/webp',
    useWebWorker: true,
  })
  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([compressed], `${baseName}.webp`, { type: 'image/webp' })
}

function PanelHeader({
  icon,
  title,
  onRefresh,
  refreshing,
}: {
  readonly icon: ReactNode
  readonly title: string
  readonly onRefresh?: () => void
  readonly refreshing?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2.5 bg-gradient-to-r from-navy-800 to-navy-700 px-7 py-[18px]">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="m-0 font-serif text-[1.15rem] font-extrabold text-white">
          {title}
        </h2>
      </div>
      {onRefresh && (
        <button
          type='button'
          onClick={onRefresh}
          disabled={refreshing}
          className="cursor-pointer rounded-full border-2 border-white/25 bg-white/10 px-3 py-1.5 text-[0.8rem] font-bold tracking-wide text-white transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95 disabled:cursor-wait"
        >
          ↺ Actualizar
        </button>
      )}
    </div>
  )
}

// ─── Login Form ───────────────────────────────────────────────────────────────

interface LoginFormProps {
  readonly setPage: (p: Page) => void
}

  function mapCognitoError(err: unknown): string {
    const message = err instanceof Error ? err.message : String(err)

    if (message.includes('Incorrect username or password') || message.includes('NotAuthorizedException')) {
      return 'Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.'
    }
    if (message.includes('User does not exist') || message.includes('UserNotFoundException')) {
      return 'No existe una cuenta para este correo electrónico.'
    }
    if (message.includes('User is not confirmed') || message.includes('UserNotConfirmedException')) {
      return 'Tu cuenta no ha sido confirmada. Revisa tu correo y confirma tu cuenta.'
    }
    if (message.includes('Password attempts exceeded') || message.includes('LimitExceededException')) {
      return 'Demasiados intentos fallidos. Inténtalo más tarde.'
    }
    return 'Error al iniciar sesión. Inténtalo de nuevo.'
  }

function LoginForm({ setPage }: LoginFormProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      setError(mapCognitoError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 px-4 pb-[60px] pt-[100px]">
      {/* Decorative gradient bar */}
      <div className="absolute inset-x-0 top-0 h-[5px] bg-gradient-to-r from-gold-400 to-crimson-600" />

      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -top-[100px] -right-[100px] h-[400px] w-[400px] rounded-full bg-gold-400/[0.04]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-crimson-600/[0.05]" />

      <div className="relative w-full max-w-[460px] rounded-3xl border-2 border-gold-400/20 bg-white px-9 py-10 shadow-2xl shadow-navy-900/40">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-b-4 border-gold-500 bg-gradient-to-br from-gold-400 to-gold-500 font-serif text-[22px] font-black text-navy-800 shadow-xl shadow-gold-400/30">
            TV
          </div>
          <h1 className="m-0 mb-1.5 font-serif text-[1.6rem] font-extrabold text-navy-800">
            Portal Administrativo
          </h1>
          <p className="m-0 text-[0.9rem] tracking-wide text-slate-600">
            I.E. Tocache Viejo — Acceso para Personal
          </p>
        </div>

        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border-2 border-blue-200 bg-blue-50 px-4 py-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F2C59" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[0.82rem] font-bold tracking-wide text-slate-600">
            Área restringida — Solo personal autorizado
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-[18px]">
            <ErrorBanner message={error} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-[18px]">
          <div>
            <FieldLabel>Correo electrónico</FieldLabel>
            <TextInput
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="admin@tocacheviejo.edu.pe"
              required
            />
          </div>

          <div>
            <FieldLabel>Contraseña</FieldLabel>
            <TextInput
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            id="admin-login-btn"
            disabled={loading}
            className={`mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-[13px] text-[0.95rem] font-extrabold uppercase tracking-[0.07em] transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
              loading
                ? 'cursor-wait border-b-4 border-slate-500 bg-slate-400 text-white'
                : 'border-b-4 border-crimson-700 bg-crimson-600 text-white shadow-xl shadow-crimson-700/30 hover:bg-crimson-500'
            }`}
          >
            {loading ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                <span>Verificando...</span>
              </>
            ) : (
              'Acceder al Portal'
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setPage('home')}
            className="cursor-pointer border-0 bg-transparent text-[0.82rem] text-slate-600 underline"
          >
            ← Volver a la página principal
          </button>
        </div>
      </div>
    </main>
  )
}

// ─── Awards Manager (POST /awards) ───────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i)

interface AwardsManagerProps {
  idToken: string
}

function AwardsManager({ idToken }: AwardsManagerProps) {
  const [awards, setAwards] = useState<SchoolAward[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [year, setYear] = useState<number>(CURRENT_YEAR)
  const [place, setPlace] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)

  let buttonText: string

  if (submitting) {
    buttonText = 'Guardando...'
  } else if (editingId) {
    buttonText = 'Guardar Cambios'
  } else {
    buttonText = '+ Crear Premio'
  }

  const loadAwards = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getAwards()
      setAwards(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar premios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    apiService
      .getAwards()
      .then((data) => {
        if (active) {
          setAwards(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Error al cargar premios')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setDescription('')
    setYear(CURRENT_YEAR)
    setPlace('')
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  const startEdit = (award: SchoolAward) => {
    setEditingId(award.id)
    setName(award.name)
    setDescription(award.description ?? '')
    setYear(award.year)
    setPlace(award.place ?? '')
    setSubmitError(null)
    setSubmitSuccess(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    const payload: CreateAwardPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      year,
      place: place.trim() || undefined,
    }

    try {
      if (editingId) {
        await apiService.updateAward(editingId, payload, idToken)
        setSubmitSuccess('Premio actualizado con éxito. ✓')
      } else {
        await apiService.createAward(payload, idToken)
        setSubmitSuccess('Premio creado con éxito. ✓')
      }
      resetForm()
      await loadAwards()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al guardar el premio.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, awardName: string) => {
    if (!confirm(`¿Eliminar el premio "${awardName}"? Esta acción es irreversible.`)) return
    setDeleteLoadingId(id)
    try {
      await apiService.deleteAward(id, idToken)
      setAwards((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo eliminar el premio.')
    } finally {
      setDeleteLoadingId(null)
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-xl shadow-navy-900/5">
      <PanelHeader
        title="Premios y Reconocimientos"
        onRefresh={loadAwards}
        refreshing={loading}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D03F" strokeWidth="2">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        }
      />

      <div className="grid gap-7 p-7">
        {/* ── Award form ── */}
        <form onSubmit={handleSubmit} className="grid gap-[18px]">
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div>
              <FieldLabel>Nombre del premio *</FieldLabel>
              <TextInput
                value={name}
                onChange={setName}
                placeholder="Ej: Primer Puesto Feria de Ciencia"
                required
              />
            </div>
            <div className="min-w-[100px]">
              <FieldLabel>Año *</FieldLabel>
              <Select value={year} onChange={(v) => setYear(Number(v))} required>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <FieldLabel>Lugar / Posición</FieldLabel>
            <TextInput
              value={place}
              onChange={setPlace}
              placeholder="Ej: 1st Place, Medalla de Oro, Finalistas..."
            />
          </div>

          <div>
            <FieldLabel>Descripción</FieldLabel>
            <TextArea value={description} onChange={setDescription} rows={3} placeholder="Breve descripción del reconocimiento..." />
          </div>

          {submitError && <ErrorBanner message={submitError} />}
          {submitSuccess && <SuccessBanner message={submitSuccess} />}

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="award-submit-btn"
              type="submit"
              disabled={submitting}
              className={`cursor-pointer rounded-full px-6 py-3 text-[0.92rem] font-extrabold uppercase tracking-[0.07em] transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                submitting
                  ? 'cursor-wait border-b-4 border-slate-500 bg-slate-400 text-white'
                  : 'border-b-4 border-navy-900 bg-gradient-to-r from-navy-800 to-navy-700 text-gold-400 shadow-xl shadow-navy-900/20'
              }`}
            >
              {buttonText}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="cursor-pointer rounded-full border-2 border-slate-300 bg-transparent px-[18px] py-[11px] text-[0.88rem] font-bold tracking-wide text-slate-600 transition-all duration-200 hover:scale-[1.02] hover:border-slate-400 hover:text-slate-800 active:scale-95"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        {/* ── Awards list ── */}
        {error && <ErrorBanner message={error} />}
        {loading && <div className="py-6 text-center text-slate-600">Cargando premios...</div>}
        {!loading && awards.length === 0 && (
          <div className="py-8 text-center text-[0.9rem] text-slate-400">
            No hay premios registrados aún. ¡Crea el primero!
          </div>
        )}
        {!loading && awards.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[0.84rem]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  {['Nombre', 'Año', 'Lugar', 'Creado', ''].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-3 py-2.5 text-left text-[0.76rem] font-bold uppercase tracking-[0.06em] text-navy-800"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {awards.map((award, i) => (
                  <tr
                    key={award.id}
                    className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                  >
                    <td className="p-3 font-semibold text-slate-800">{award.name}</td>
                    <td className="p-3 text-slate-600">{award.year}</td>
                    <td className="p-3 text-slate-600">{award.place || '—'}</td>
                    <td className="p-3 text-[0.78rem] text-slate-400">
                      {award.createdAt ? new Date(award.createdAt).toLocaleDateString('es-PE') : '—'}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <button
                        type="button"
                        id={`edit-award-${award.id}`}
                        onClick={() => startEdit(award)}
                        className="mr-1.5 cursor-pointer rounded-full border border-blue-200 bg-transparent px-2.5 py-[5px] text-[0.76rem] font-bold text-blue-700 transition-colors duration-150 hover:bg-blue-100"
                      >
                        ✎ Editar
                      </button>
                      <button
                        type="button"
                        id={`delete-award-${award.id}`}
                        onClick={() => handleDelete(award.id, award.name)}
                        disabled={deleteLoadingId === award.id}
                        className="cursor-pointer rounded-full border border-red-200 bg-transparent px-2.5 py-[5px] text-[0.76rem] font-bold text-red-600 transition-colors duration-150 hover:bg-red-50 disabled:cursor-wait"
                      >
                        {deleteLoadingId === award.id ? '...' : '🗑 Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const { user, idToken, logout } = useAuth()

  // ── Events list ──────────────────────────────────────────────────────────
  const [events, setEvents] = useState<SchoolEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState<string | null>(null)
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null)

  // ── Create event form ────────────────────────────────────────────────────
  const [evtName, setEvtName] = useState('')
  const [evtYear, setEvtYear] = useState<number>(CURRENT_YEAR)
  const [evtDate, setEvtDate] = useState('')
  const [evtDesc, setEvtDesc] = useState('')
  const [evtFiles, setEvtFiles] = useState<File[]>([])
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSuccess, setCreateSuccess] = useState<string | null>(null)
  const [createStep, setCreateStep] = useState<'idle' | 'compress' | 'urls' | 'upload' | 'save' | 'done'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadEvents = useCallback(async () => {
    setEventsLoading(true)
    setEventsError(null)
    try {
      const data = await apiService.getEvents()
      setEvents(data)
    } catch (err) {
      setEventsError(err instanceof Error ? err.message : 'Error al cargar eventos')
    } finally {
      setEventsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    apiService
      .getEvents()
      .then((data) => {
        if (active) {
          setEvents(data)
          setEventsError(null)
        }
      })
      .catch((err) => {
        if (active) setEventsError(err instanceof Error ? err.message : 'Error al cargar eventos')
      })
      .finally(() => {
        if (active) setEventsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // ── File picker ──────────────────────────────────────────────────────────
  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    const oversized = selected.filter((f) => f.type.startsWith('video/') && f.size > MAX_VIDEO_MB * 1024 * 1024)
    if (oversized.length > 0) {
      alert(
        `Los siguientes archivos superan el límite de ${MAX_VIDEO_MB} MB y fueron omitidos:\n` +
          oversized.map((f) => `• ${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`).join('\n'),
      )
    }
    setEvtFiles(selected.filter((f) => !oversized.includes(f)))
  }

  // ── Create event flow (FLOW 1 del README) ─────────────────────────────────
  // 1. POST /media/upload-urls  → 2. PUT directo a S3  → 3. POST /events
  const handleCreateEvent = async (e: FormEvent) => {
    e.preventDefault()
    if (!idToken) return
    if (evtFiles.length === 0) {
      setCreateError('Selecciona al menos una foto o video.')
      return
    }

    setCreating(true)
    setCreateError(null)
    setCreateSuccess(null)

    // Genera un ID único en el cliente para organizar los archivos en S3
    // bajo media/{year}/{eventId}/{filename} y como id del evento en DynamoDB.
    const eventId = 'evt-' + Date.now()

    try {
      // STEP 0: Comprimir imágenes a WebP (~0.5MB máx, 1920px). Los videos no se tocan.
      setCreateStep('compress')
      const preparedFiles = await Promise.all(
        evtFiles.map(async (f) => (f.type.startsWith('image/') ? compressImageFile(f) : f)),
      )

      // STEP 1: Obtener URLs pre-firmadas de S3
      setCreateStep('urls')
      const uploadTargets = await apiService.getUploadUrls(
        {
          year: evtYear,
          eventId,
          files: preparedFiles.map((f) => ({ fileName: f.name, fileType: f.type })),
        },
        idToken,
      )

      // STEP 2: Subir binarios directamente a S3
      setCreateStep('upload')
      const mediaItems: EventMediaItemInput[] = []
      for (let i = 0; i < preparedFiles.length; i++) {
        const target = uploadTargets[i]
        const file = preparedFiles[i]
        if (!target) throw new Error(`No se obtuvo URL de subida para "${file.name}".`)
        const uploadRes = await fetch(target.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        if (!uploadRes.ok) throw new Error(`Falló la subida de "${file.name}" (${uploadRes.status}).`)
        mediaItems.push({
          s3Key: target.s3Key,
          type: file.type.startsWith('video/') ? 'VIDEO' : 'PHOTO',
          title: file.name,
        })
      }

      // STEP 3: Guardar metadata del evento en DynamoDB
      setCreateStep('save')
      const event = await apiService.createEvent(
        {
          id: eventId,
          name: evtName,
          description: evtDesc || undefined,
          year: evtYear,
          eventDate: evtDate || undefined,
          mediaItems,
        },
        idToken,
      )

      setCreateStep('done')
      setCreateSuccess(`Evento "${event.name}" creado con éxito. ✓`)

      // Reset form
      setEvtName('')
      setEvtYear(CURRENT_YEAR)
      setEvtDate('')
      setEvtDesc('')
      setEvtFiles([])
      if (fileInputRef.current) fileInputRef.current.value = ''

      // Refresh list
      await loadEvents()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Error desconocido al crear el evento.')
    } finally {
      setCreating(false)
      setCreateStep('idle')
    }
  }

  // ── Delete event ──────────────────────────────────────────────────────────
  const handleDeleteEvent = async (id: string, name: string) => {
    if (!idToken) return
    if (!confirm(`¿Eliminar el evento "${name}" y todos sus archivos? Esta acción es irreversible.`)) return
    setDeleteEventId(id)
    try {
      await apiService.deleteEvent(id, idToken)
      setEvents((prev) => prev.filter((ev) => ev.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo eliminar el evento.')
    } finally {
      setDeleteEventId(null)
    }
  }

  // ── Derived step label ────────────────────────────────────────────────────
  const createStepLabel: Record<typeof createStep, string> = {
    idle: 'Crear Evento',
    compress: 'Comprimiendo imágenes (1/4)...',
    urls: 'Obteniendo URLs de subida (2/4)...',
    upload: 'Subiendo archivos a S3 (3/4)...',
    save: 'Guardando evento (4/4)...',
    done: '¡Completado!',
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      {/* Top bar */}
      <div className="border-b-[3px] border-gold-400 bg-navy-800 px-[clamp(16px,4vw,48px)]">
        <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border-b-4 border-gold-500 bg-gradient-to-br from-gold-400 to-gold-500 font-serif text-[14px] font-black text-navy-800 shadow-xl shadow-gold-400/30">
              TV
            </div>
            <div>
              <div className="font-serif text-[0.95rem] font-extrabold text-white">
                Panel Administrativo
              </div>
              <div className="text-[0.7rem] text-slate-400">I.E. Tocache Viejo</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[0.8rem] text-slate-400">
              👤 <strong className="text-gold-400">{user?.email ?? user?.username ?? 'Admin'}</strong>
            </span>
            <button
              type="button"
              id="admin-logout-btn"
              onClick={logout}
              className="cursor-pointer rounded-full border-b-4 border-crimson-700 bg-crimson-600 px-4 py-[9px] text-[0.82rem] font-bold tracking-wide text-white shadow-xl shadow-crimson-700/30 transition-all duration-300 hover:scale-[1.03] hover:bg-crimson-500 active:scale-95"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-9 px-[clamp(16px,4vw,48px)] py-9">
        {/* ── Create Event Panel ─────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-xl shadow-navy-900/5">
          <PanelHeader
            title="Crear Nuevo Evento"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D03F" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            }
          />

          <form onSubmit={handleCreateEvent} className="grid gap-5 p-7">
            {/* Row: Name + Year */}
            <div className="grid grid-cols-[1fr_auto] gap-4">
              <div>
                <FieldLabel>Nombre del evento *</FieldLabel>
                <TextInput
                  value={evtName}
                  onChange={setEvtName}
                  placeholder="Ej: Festival Cultural Anual"
                  required
                />
              </div>
              <div className="min-w-[100px]">
                <FieldLabel>Año *</FieldLabel>
                <Select value={evtYear} onChange={(v) => setEvtYear(Number(v))} required>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Fecha */}
            <div>
              <FieldLabel>Fecha del evento</FieldLabel>
              <TextInput type="date" value={evtDate} onChange={setEvtDate} />
            </div>

            {/* Descripción */}
            <div>
              <FieldLabel>Descripción</FieldLabel>
              <TextArea value={evtDesc} onChange={setEvtDesc} placeholder="Breve descripción del evento..." />
            </div>

            {/* File picker (múltiple) */}
            <div>
              <FieldLabel>Fotos / Videos (puedes elegir varios) *</FieldLabel>
              <label
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-[22px] text-center transition-colors duration-200 hover:border-navy-800 ${
                  evtFiles.length > 0 ? 'border-green-300 bg-green-50' : 'border-slate-300 bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                  required
                />
                {evtFiles.length > 0 ? (
                  <div>
                    <div className="mb-1.5 text-[1.5rem]">📁</div>
                    <div className="text-[0.88rem] font-bold text-green-700">
                      {evtFiles.length} archivo(s) seleccionado(s)
                    </div>
                    <div className="mt-1 flex max-h-[90px] flex-col gap-0.5 overflow-y-auto text-[0.76rem] text-slate-600">
                      {evtFiles.map((f) => (
                        <span key={`${f.name}-${f.lastModified}`}>
                          {f.type.startsWith('video') ? '🎬' : '🖼️'} {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      className="mx-auto mb-2 block"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <div className="text-[0.86rem] text-slate-600">
                      Haz clic para seleccionar imágenes o videos
                    </div>
                    <div className="mt-1 text-[0.75rem] text-slate-400">
                      JPG, PNG, GIF, MP4, MOV — imágenes auto-comprimidas a WebP (~0.5 MB), videos máx. 200 MB
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Feedback */}
            {createError && <ErrorBanner message={createError} />}
            {createSuccess && <SuccessBanner message={createSuccess} />}

            {/* Progress indicator */}
            {creating && createStep !== 'idle' && (
              <div className="flex items-center gap-2.5 text-[0.84rem] font-semibold text-navy-800">
                <span className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-navy-800" />
                {createStepLabel[createStep]}
              </div>
            )}

            {/* Submit */}
            <button
              id="event-submit-btn"
              type="submit"
              disabled={creating || evtFiles.length === 0}
              className={`min-w-[180px] cursor-pointer self-start rounded-full px-4 py-[13px] text-[0.92rem] font-extrabold uppercase tracking-[0.07em] transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                creating || evtFiles.length === 0
                  ? 'cursor-not-allowed border-b-4 border-slate-500 bg-slate-400 text-white'
                  : 'border-b-4 border-navy-900 bg-gradient-to-r from-navy-800 to-navy-700 text-gold-400 shadow-xl shadow-navy-900/20'
              }`}
            >
              {creating ? createStepLabel[createStep] : '↑ Crear Evento'}
            </button>
          </form>
        </section>

        {/* ── Events List Panel (GET /events) ─────────────────────────────── */}
        <section className="overflow-hidden rounded-3xl border-2 border-blue-100 bg-white shadow-xl shadow-navy-900/5">
          <PanelHeader
            title="Eventos Existentes"
            onRefresh={loadEvents}
            refreshing={eventsLoading}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F4D03F" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          />

          <div className="px-7 pb-7">
            {eventsLoading && (
              <div className="p-8 text-center text-slate-600">
                Cargando eventos...
              </div>
            )}
            {eventsError && (
              <div className="mt-5">
                <ErrorBanner message={eventsError} />
              </div>
            )}
            {!eventsLoading && !eventsError && events.length === 0 && (
              <div className="p-10 text-center text-[0.9rem] text-slate-400">
                No hay eventos registrados aún. ¡Crea el primero! ↑
              </div>
            )}
            {!eventsLoading && events.length > 0 && (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-[0.84rem]">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      {['Nombre', 'Año', 'Fecha', 'Creado', ''].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap px-3 py-2.5 text-left text-[0.76rem] font-bold uppercase tracking-[0.06em] text-navy-800"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev, i) => (
                      <tr
                        key={ev.id}
                        className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                      >
                        <td className="p-3 font-semibold text-slate-800">{ev.name}</td>
                        <td className="p-3 text-slate-600">{ev.year}</td>
                        <td className="p-3 text-slate-600">
                          {ev.eventDate ? new Date(`${ev.eventDate}T00:00:00`).toLocaleDateString('es-PE') : '—'}
                        </td>
                        <td className="p-3 text-[0.78rem] text-slate-400">
                          {ev.createdAt ? new Date(ev.createdAt).toLocaleDateString('es-PE') : '—'}
                        </td>
                        <td className="p-3">
                          <button
                            type='button'
                            id={`delete-event-${ev.id}`}
                            onClick={() => handleDeleteEvent(ev.id, ev.name)}
                            disabled={deleteEventId === ev.id}
                            className="cursor-pointer rounded-full whitespace-nowrap border border-red-200 bg-transparent px-3 py-[5px] text-[0.76rem] font-bold text-red-600 transition-colors duration-150 hover:bg-red-50 disabled:cursor-wait"
                          >
                            {deleteEventId === ev.id ? '...' : '🗑 Eliminar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ── Awards Panel (POST /awards) ─────────────────────────────────── */}
        {idToken && <AwardsManager idToken={idToken} />}
      </div>
    </main>
  )
}

// ─── AdminPage (root export) ──────────────────────────────────────────────────

interface AdminPageProps {
  setPage: (p: Page) => void
}

export function AdminPage({ setPage }: AdminPageProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy-800">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-gold-400/30 border-t-gold-400" />
      </main>
    )
  }

  return isAuthenticated ? <AdminDashboard /> : <LoginForm setPage={setPage} />
}
