import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, TriangleAlert } from 'lucide-react'
import { Button } from '../../components/ui/Controls'

export const STEP_LABELS = ['العالم', 'الدولة', 'الهوية', 'الحكم', 'البداية'] as const

export const STEP_META: Record<
  number,
  { eyebrow: string; title: string; description: string }
> = {
  1: {
    eyebrow: 'الخطوة الأولى',
    title: 'اختر العالم الذي ستولد فيه',
    description:
      'حدّد نوع العالم وسنته وقواعده الأساسية. يمكنك البدء من العالم الحقيقي، أو بناء عالم خيالي، أو الانطلاق من سيناريو جاهز.',
  },
  2: {
    eyebrow: 'الخطوة الثانية',
    title: 'اختر دولتك',
    description:
      'اختر دولة حقيقية من الخريطة والقائمة، أو ضع دولتك الخيالية على الموقع الجغرافي الذي تريده على خريطة العالم.',
  },
  3: {
    eyebrow: 'الخطوة الثالثة',
    title: 'ابنِ هوية الدولة',
    description:
      'الاسم والعاصمة واللغة والعملة والعلم والشعار. هذه ليست تفاصيل شكلية: الهوية سترافق كل قرار في اللعبة.',
  },
  4: {
    eyebrow: 'الخطوة الرابعة',
    title: 'اختر نظام الحكم',
    description:
      'لكل نظام توازن مختلف بين السرعة والشرعية والرقابة. اختر ما يناسب حكايتك، أو صمّم نظاماً مخصصاً بيدك.',
  },
  5: {
    eyebrow: 'الخطوة الخامسة',
    title: 'اضبط شروط البداية',
    description:
      'هذه أرقام الانطلاق: السكان والخزينة والدين ومؤشرات الدولة. في هذه المرحلة تُحفظ كحالة بداية، ولا تُحاكى بعد بشكل حي.',
  },
}

export function WizardProgress({ step }: { step: number }) {
  return (
    <div className="wizard-progress" aria-label="خطوات إنشاء اللعبة">
      <ol className="wizard-progress__list">
        {STEP_LABELS.map((label, index) => {
          const number = index + 1
          const state = number === step ? 'is-active' : number < step ? 'is-done' : ''
          return (
            <li key={label} className={`wizard-step ${state}`}>
              <span className="wizard-step__num">{number}</span>
              <span className="wizard-step__label">{label}</span>
            </li>
          )
        })}
      </ol>
      <div className="wizard-progress__mobile">
        <span className="wizard-progress__mobile-text">
          الخطوة <strong>{step}</strong> من 5 · {STEP_LABELS[step - 1]}
        </span>
        <span className="wizard-dots" aria-hidden>
          {STEP_LABELS.map((label, index) => {
            const number = index + 1
            return (
              <i
                key={label}
                className={
                  number === step ? 'is-active' : number < step ? 'is-done' : undefined
                }
              />
            )
          })}
        </span>
      </div>
    </div>
  )
}

export function StepHead({
  step,
  aside,
}: {
  step: number
  aside?: ReactNode
}) {
  const meta = STEP_META[step]
  return (
    <div className="step-head">
      <span className="eyebrow">{meta.eyebrow}</span>
      <h1>{meta.title}</h1>
      <p>{meta.description}</p>
      {aside}
    </div>
  )
}

export function SectionHead({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="step-section__head">
      <div>
        <h2>{title}</h2>
        {hint && <p>{hint}</p>}
      </div>
      {action}
    </div>
  )
}

export function WizardFooter({
  step,
  error,
  onBack,
  onNext,
  onExit,
  busy,
}: {
  step: number
  error: string | null
  onBack: () => void
  onNext: () => void
  onExit: () => void
  busy?: boolean
}) {
  const isLast = step === 5
  return (
    <footer className="wizard-footer">
      <div className="wizard-footer__inner">
        <div className="wizard-footer__side">
          {step > 1 ? (
            <Button
              variant="ghost"
              size="lg"
              icon={<ArrowRight size={16} />}
              onClick={onBack}
            >
              السابق
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="lg"
              icon={<ArrowRight size={16} />}
              onClick={onExit}
            >
              القائمة
            </Button>
          )}
        </div>

        {error ? (
          <div className="wizard-footer__error" role="alert">
            <TriangleAlert size={14} />
            <span>{error}</span>
          </div>
        ) : (
          <span className="wizard-footer__count">
            الخطوة {step} من 5
          </span>
        )}

        <div className="wizard-footer__side" style={{ justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            disabled={busy}
            icon={isLast ? undefined : <ArrowLeft size={16} />}
          >
            {isLast ? 'ابدأ اللعبة' : 'التالي'}
          </Button>
        </div>
      </div>
    </footer>
  )
}
