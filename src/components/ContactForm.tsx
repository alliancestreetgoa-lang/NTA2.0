import { useState, type FormEvent } from 'react'
import { Check, Send } from 'lucide-react'
import { divisions } from '../config/site'

interface Errors {
  name?: string
  email?: string
  message?: string
}

const inputClass =
  'w-full rounded-lg border border-white/12 bg-[#0a1622] px-4 py-3 text-sm text-white placeholder:text-[#5b6675] focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50 transition-colors'

/** UI-only contact form: client-side validation + success state, no network call. */
export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const validate = (data: FormData): Errors => {
    const next: Errors = {}
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    if (!name) next.name = 'Please enter your name.'
    if (!email) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.'
    if (!message) next.message = 'Please add a short message.'
    return next
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next = validate(data)
    setErrors(next)
    if (Object.keys(next).length === 0) {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#d4af37]/30 bg-[#13283f] px-8 py-14 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#d4af37] text-[#0a1622]">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-xl font-semibold text-white">Thanks — we'll be in touch</h3>
        <p className="mt-2 max-w-sm text-sm text-[#9aa6b3]">
          Our trading team has received your enquiry and will respond shortly.
        </p>
        <button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-[#d4af37] hover:underline">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-white/8 bg-[#13283f] p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input name="name" type="text" className={inputClass} placeholder="Jane Trader" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Company">
          <input name="company" type="text" className={inputClass} placeholder="Acme Commodities" />
        </Field>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Email" error={errors.email}>
          <input name="email" type="email" className={inputClass} placeholder="you@company.com" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Division of interest">
          <select name="division" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a division
            </option>
            {divisions.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
            <option value="other">Other / General enquiry</option>
          </select>
        </Field>
      </div>
      <div className="mt-5">
        <Field label="Message" error={errors.message}>
          <textarea
            name="message"
            rows={4}
            className={inputClass}
            placeholder="Tell us about your sourcing or supply requirement…"
            aria-invalid={!!errors.message}
          />
        </Field>
      </div>
      <button type="submit" className="btn-gold mt-6 w-full sm:w-auto">
        Send enquiry
        <Send className="h-4 w-4" />
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#9aa6b3]">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-[#e0795a]">{error}</span>}
    </label>
  )
}
