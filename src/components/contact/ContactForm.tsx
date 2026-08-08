import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ContactFormData } from '../../types'

const inputClass =
  'w-full rounded-2xl border-2 border-slate-200 px-3.5 py-3.5 text-[0.95rem] tracking-wide outline-none transition-colors duration-200 focus:border-navy-800 focus:ring-2 focus:ring-blue-100'

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    gradeLevel: '',
    studentName: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email) return

    // Número de WhatsApp del colegio (formato internacional sin el símbolo +)
    const telefonoColegio = '51900000858'

    // Construir el mensaje con el formato de WhatsApp (usando * para negritas)
    const mensajeTexto = `*Nueva Consulta desde la Web* 🏫
*Apoderado:* ${formData.fullName}
*Correo:* ${formData.email}
*Teléfono:* ${formData.phone || 'No indicado'}
*Grado de Interés:* ${formData.gradeLevel || 'No indicado'}
*Estudiante:* ${formData.studentName || 'No indicado'}

*Mensaje:*
${formData.message || 'Sin mensaje adicional'}`

    // Codificar el texto para la URL
    const textoCodificado = encodeURIComponent(mensajeTexto)

    // Abrir WhatsApp en una pestaña nueva
    window.open(`https://wa.me/${telefonoColegio}?text=${textoCodificado}`, '_blank')

    // Mostrar el mensaje de éxito en la página
    setSubmitted(true)
  }

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gradeLevel: '',
      studentName: '',
      message: '',
    })
    setSubmitted(false)
  }

  return (
    <div className="rounded-3xl border-2 border-blue-100 bg-white p-[clamp(24px,5vw,40px)] shadow-xl shadow-navy-900/5">
      <div className="mb-6">
        <h3 className="m-0 mb-2 font-serif text-[1.55rem] font-extrabold text-navy-800">
          Formulario de Matrícula y Consultas
        </h3>
        <p className="m-0 text-[0.92rem] leading-relaxed tracking-wide text-slate-600">
          Complete el formulario a continuación para recibir información sobre admisiones o programar una visita a nuestro campus.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-3xl border-2 border-gold-400/60 bg-gold-400/15 px-6 py-8 text-center">
          <div className="mb-3 text-[2.5rem]">🎉</div>
          <h4 className="m-0 mb-2.5 font-serif text-[1.3rem] font-extrabold text-navy-800">
            ¡Gracias, {formData.fullName}!
          </h4>
          <p className="mx-auto mb-5 max-w-[500px] text-[0.92rem] leading-relaxed tracking-wide text-slate-700">
            Hemos redirigido tu consulta a nuestro WhatsApp. Si la ventana no se abrió, por favor contáctanos directamente al <strong>+51 900 000 858</strong>.
          </p>
          <button
            type='button'
            onClick={handleReset}
            className="cursor-pointer rounded-full border-b-4 border-navy-900 bg-gradient-to-r from-navy-800 to-navy-700 px-6 py-3 text-[0.88rem] font-extrabold tracking-wide text-gold-400 shadow-xl shadow-navy-900/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:from-navy-700 hover:to-navy-800 active:scale-95"
          >
            Enviar Otra Consulta
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
            <div>
              <label className="mb-1.5 block text-[0.86rem] font-extrabold tracking-wide text-navy-800">
                <span>Nombre del Apoderado *</span>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. María Sánchez"
                  className={inputClass}
                />
              </label>

            </div>
            <div>
              <label className="mb-1.5 block text-[0.86rem] font-extrabold tracking-wide text-navy-800">
                <span>Correo Electrónico</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej. maria@correo.com"
                  className={inputClass}
              />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
            <div>
              <label className="mb-1.5 block text-[0.86rem] font-extrabold tracking-wide text-navy-800">
                <span>Teléfono / Celular</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="999 999 999"
                  className={inputClass}
                />
              </label>
            </div>
            <div>
              <label className="mb-1.5 block text-[0.86rem] font-extrabold tracking-wide text-navy-800">
                <span>Grado de Interés</span>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value as any })}
                  className={`${inputClass} cursor-pointer bg-white`}
                >
                <option value="">Seleccione el grado...</option>
                <option value="Primaria 1° grado">Primer grado de primaria</option>
                <option value="Primaria 2° grado">Segundo grado de primaria</option>
                <option value="Primaria 3° grado">Tercer grado de primaria</option>
                <option value="Primaria 4° grado">Cuarto grado de primaria</option>
                <option value="Primaria 5° grado">Quinto grado de primaria</option>
                <option value="Primaria 6° grado">Sexto grado de primaria</option>
              </select>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[0.86rem] font-extrabold tracking-wide text-navy-800">
              <span>Nombre del Estudiante</span>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Ej. Juanito Pérez"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="mb-1.5 block text-[0.86rem] font-extrabold tracking-wide text-navy-800">
              <span>Mensaje o Consultas Específicas</span>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Por favor comparta cualquier duda sobre currículo, matrículas, costos o traslados..."
                className={`${inputClass} resize-y`}
              />
            </label>
          </div>

          <button
            type="submit"
            className="cursor-pointer self-start rounded-full border-b-4 border-crimson-700 bg-crimson-600 px-7 py-4 text-[0.95rem] font-extrabold uppercase tracking-[0.06em] text-white shadow-xl shadow-crimson-700/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:from-crimson-500 hover:to-crimson-600 active:scale-95"
          >
           Enviar Consulta por WhatsApp →
          </button>
        </form>
      )}
    </div>
  )
}