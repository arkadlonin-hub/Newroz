import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

type ToastTone = 'success' | 'info' | 'error'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = ++counter.current
      setItems((prev) => [...prev.slice(-2), { id, message, tone }])
      window.setTimeout(() => dismiss(id), 3600)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {items.map((item) => {
          const Icon = item.tone === 'success' ? CheckCircle2 : item.tone === 'error' ? TriangleAlert : Info
          return (
            <div key={item.id} className={`toast toast--${item.tone}`}>
              <Icon size={18} strokeWidth={1.8} aria-hidden />
              <span>{item.message}</span>
              <button
                type="button"
                className="toast__close"
                onClick={() => dismiss(item.id)}
                aria-label="إغلاق التنبيه"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
