import { useEffect, useId, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Button({
  children,
  variant = 'glass',
  size = 'md',
  icon,
  full,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'glass' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  full?: boolean
}) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} btn--${size} ${full ? 'btn--full' : ''} ${className}`}
      {...rest}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      <span className="btn__label">{children}</span>
    </button>
  )
}

export function IconButton({
  label,
  children,
  active,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      className={`icon-btn ${active ? 'is-active' : ''} ${className}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
  disabled?: boolean
}) {
  const id = useId()
  return (
    <label className={`toggle-row ${disabled ? 'is-disabled' : ''}`} htmlFor={id}>
      <span className="toggle-row__text">
        <span className="toggle-row__label">{label}</span>
        {description && <span className="toggle-row__desc">{description}</span>}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="toggle" aria-hidden>
        <span className="toggle__thumb" />
      </span>
    </label>
  )
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  compact,
}: {
  options: { value: T; label: string; icon?: ReactNode }[]
  value: T
  onChange: (value: T) => void
  label?: string
  compact?: boolean
}) {
  return (
    <div className={`segmented ${compact ? 'segmented--compact' : ''}`} role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          className={`segmented__item ${opt.value === value ? 'is-active' : ''}`}
          onClick={() => onChange(opt.value)}
          aria-pressed={opt.value === value}
        >
          {opt.icon}
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

export function Meter({
  label,
  value,
  hint,
  tone = 'sage',
  icon,
  small,
}: {
  label: string
  value: number
  hint?: string
  tone?: 'sage' | 'bronze' | 'stone' | 'clay'
  icon?: ReactNode
  small?: boolean
}) {
  return (
    <div className={`meter meter--${tone} ${small ? 'meter--small' : ''}`}>
      <div className="meter__top">
        <span className="meter__label">
          {icon}
          {label}
        </span>
        <span className="meter__value">{Math.round(value)}</span>
      </div>
      <div className="meter__track">
        <span className="meter__fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
      {hint && <span className="meter__hint">{hint}</span>}
    </div>
  )
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  hint,
  defaultValue,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  format?: (value: number) => string
  hint?: string
  defaultValue?: number
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="range-field">
      <div className="range-field__top">
        <label className="range-field__label">{label}</label>
        <span className="range-field__value">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        dir="ltr"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--fill': `${pct}%` } as React.CSSProperties}
        aria-label={label}
      />
      <div className="range-field__meta">
        {hint && <span>{hint}</span>}
        {defaultValue != null && value !== defaultValue && (
          <button type="button" className="range-field__reset" onClick={() => onChange(defaultValue)}>
            استعادة المقترح
          </button>
        )}
      </div>
    </div>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  maxLength,
  type = 'text',
  suffix,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  error?: string
  maxLength?: number
  type?: string
  suffix?: string
}) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field__label">{label}</span>
      <span className="field__input-wrap">
        <input
          className="field__input"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          dir={type === 'number' ? 'ltr' : undefined}
        />
        {suffix && <span className="field__suffix">{suffix}</span>}
      </span>
      {error ? <span className="field__error">{error}</span> : hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  )
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  sheetOnMobile = true,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  sheetOnMobile?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-layer" role="presentation">
      <button type="button" className="modal-backdrop" aria-label="إغلاق" onClick={onClose} />
      <div
        className={`modal glass modal--${size} ${sheetOnMobile ? 'modal--sheet' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal__handle" aria-hidden />
        <header className="modal__header">
          <div>
            <h2 className="modal__title">{title}</h2>
            {subtitle && <p className="modal__subtitle">{subtitle}</p>}
          </div>
          <IconButton label="إغلاق" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  )
}
