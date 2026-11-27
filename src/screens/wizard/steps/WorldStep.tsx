import {
  Check,
  Compass,
  Globe2,
  Hourglass,
  RadioTower,
  Sparkles,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { WizardDraft } from '../../../game/setup'
import type { Difficulty, WorldKind } from '../../../game/types'
import {
  ABUNDANCE_LEVELS,
  CLIMATES,
  DIFFICULTIES,
  TECH_LEVELS,
  WORLD_KINDS,
} from '../../../data/worlds'
import { SCENARIOS } from '../../../data/scenarios'
import { applyDifficulty, applyScenario, applyWorldKind } from '../../../game/draft'
import { TextField } from '../../../components/ui/Controls'
import { SectionHead } from '../parts'

const WORLD_ICONS = {
  real: Globe2,
  fictional: Sparkles,
  custom: Compass,
  historical: Hourglass,
  modern: RadioTower,
} as const

export function WorldStep({
  draft,
  setDraft,
}: {
  draft: WizardDraft
  setDraft: Dispatch<SetStateAction<WizardDraft>>
}) {
  const world = draft.world
  const scenarioChoices = SCENARIOS.filter((scenario) =>
    world.kind === 'historical' ? scenario.era === 'historical' : scenario.era === 'modern',
  )

  const setWorld = (patch: Partial<WizardDraft['world']>) =>
    setDraft((current) => ({ ...current, world: { ...current.world, ...patch } }))

  const chooseKind = (kind: WorldKind) =>
    setDraft((current) => applyWorldKind(current, kind))

  return (
    <div>
      <div className="world-grid" role="list" aria-label="نوع العالم">
        {WORLD_KINDS.map((kind) => {
          const Icon = WORLD_ICONS[kind.id]
          const active = world.kind === kind.id
          return (
            <button
              key={kind.id}
              type="button"
              role="listitem"
              className={`world-card ${active ? 'is-active' : ''}`}
              style={{ '--wc-accent': kind.accent } as React.CSSProperties}
              onClick={() => chooseKind(kind.id)}
              aria-pressed={active}
            >
              <div className="world-card__top">
                <span className="world-card__icon">
                  <Icon size={18} strokeWidth={1.6} />
                </span>
                <span className="world-card__check" aria-hidden>
                  <Check size={12} strokeWidth={2.6} />
                </span>
              </div>
              <h3>{kind.title}</h3>
              <span className="world-card__sub">{kind.subtitle}</span>
              <p className="world-card__desc">{kind.description}</p>
            </button>
          )
        })}
      </div>

      {(world.kind === 'historical' || world.kind === 'modern') && (
        <section className="step-section" aria-labelledby="scenario-heading">
          <SectionHead
            title={world.kind === 'historical' ? 'اختر اللحظة التاريخية' : 'اختر بذرة السيناريو الحديث'}
            hint="السيناريو يضبط السنة والدولة المقترحة وشروط البداية. يمكنك تعديل كل قيمة لاحقاً."
          />
          <div className="scenario-pick-grid" id="scenario-heading">
            {scenarioChoices.map((scenario) => {
              const active = draft.scenarioId === scenario.id
              return (
                <button
                  key={scenario.id}
                  type="button"
                  className={`scenario-mini ${active ? 'is-active' : ''}`}
                  onClick={() =>
                    setDraft((current) => applyScenario(current, scenario.id))
                  }
                  aria-pressed={active}
                >
                  <span className="scenario-mini__year">{scenario.year}</span>
                  <strong>{scenario.title}</strong>
                  <small>{scenario.subtitle}</small>
                  <small>{scenario.description}</small>
                </button>
              )
            })}
          </div>
          <p className="tiny faint" style={{ marginTop: '0.55rem', lineHeight: 1.7 }}>
            شروط البداية في السيناريوهات التاريخية تقديرية لأغراض اللعب وليست إحصاءات رسمية.
          </p>
        </section>
      )}

      <section className="step-section" aria-labelledby="world-config-heading">
        <SectionHead
          title="إعدادات العالم"
          hint="الاسم والسنة والمستوى التقني والوفرة والمناخ تُحفظ مع اللعبة."
        />
        <div className="world-config" id="world-config-heading">
          <TextField
            label="اسم العالم"
            value={world.name}
            onChange={(value) => setWorld({ name: value })}
            placeholder="مثال: عالم النور"
            maxLength={48}
          />
          <TextField
            label="سنة البداية"
            value={String(world.year)}
            onChange={(value) => {
              const parsed = Number(value.replace(/[^0-9]/g, ''))
              if (!Number.isFinite(parsed)) return
              setWorld({ year: Math.min(2200, Math.max(1, parsed || 1)) })
            }}
            type="number"
            suffix="م"
            hint="السنة الميلادية لبداية المحاكاة"
          />
          <TextField
            label="وصف العصر"
            value={world.eraLabel}
            onChange={(value) => setWorld({ eraLabel: value })}
            placeholder="مثال: الحاضر"
            maxLength={40}
          />
          <label className="field field--wide">
            <span className="field__label">ملاحظات العالم</span>
            <span className="field__input-wrap">
              <textarea
                className="field__input"
                value={world.notes}
                onChange={(event) => setWorld({ notes: event.target.value })}
                placeholder="تفاصيل إضافية عن قواعد عالمك أو حكايته..."
                maxLength={280}
                rows={3}
                style={{ minHeight: 86, padding: '0.7rem 0.95rem', resize: 'vertical' }}
              />
            </span>
            <span className="field__hint">اختياري — تُعرض لاحقاً في ملف العالم.</span>
          </label>
        </div>
      </section>

      <section className="step-section" aria-labelledby="tech-heading">
        <SectionHead title="المستوى التقني" hint="يُسجّل كخلفية للعالم في هذه المرحلة." />
        <div className="option-cards" id="tech-heading">
          {TECH_LEVELS.map((tech) => (
            <button
              key={tech.id}
              type="button"
              className={`option-card ${world.techLevel === tech.id ? 'is-active' : ''}`}
              onClick={() => setWorld({ techLevel: tech.id })}
              aria-pressed={world.techLevel === tech.id}
            >
              <strong>{tech.label}</strong>
              <small>{tech.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="step-section" aria-labelledby="abundance-heading">
        <SectionHead title="وفرة الموارد" hint="تؤثر على قراءة الاقتصاد والموارد في شروط البداية." />
        <div className="option-cards" id="abundance-heading" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
          {ABUNDANCE_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              className={`option-card ${world.abundance === level.id ? 'is-active' : ''}`}
              onClick={() => setWorld({ abundance: level.id })}
              aria-pressed={world.abundance === level.id}
            >
              <strong>{level.label}</strong>
              <small>{level.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="step-section" aria-labelledby="climate-heading">
        <SectionHead title="المناخ الغالب" hint="خلفية جغرافية تُحفظ مع العالم." />
        <div className="option-cards" id="climate-heading" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
          {CLIMATES.map((climate) => (
            <button
              key={climate.id}
              type="button"
              className={`option-card ${world.climate === climate.id ? 'is-active' : ''}`}
              onClick={() => setWorld({ climate: climate.id })}
              aria-pressed={world.climate === climate.id}
            >
              <strong>{climate.label}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="step-section" aria-labelledby="difficulty-heading">
        <SectionHead
          title="مستوى الصعوبة"
          hint="يعدّل الخزينة والدين وبعض المؤشرات عند اختيار الدولة."
        />
        <div className="difficulty-grid" id="difficulty-heading">
          {DIFFICULTIES.map((difficulty) => {
            const active = world.difficulty === difficulty.id
            return (
              <button
                key={difficulty.id}
                type="button"
                className={`difficulty-card ${active ? 'is-active' : ''}`}
                style={active ? { color: difficulty.tone } : undefined}
                onClick={() =>
                  setDraft((current) => applyDifficulty(current, difficulty.id as Difficulty))
                }
                aria-pressed={active}
              >
                <strong>
                  <i style={{ background: difficulty.tone }} />
                  {difficulty.label}
                </strong>
                <small style={active ? { color: 'var(--muted)' } : undefined}>
                  {difficulty.description}
                </small>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
