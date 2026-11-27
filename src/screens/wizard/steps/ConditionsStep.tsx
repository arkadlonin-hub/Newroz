import type { Dispatch, ReactNode, SetStateAction } from 'react'
import {
  Banknote,
  Coins,
  Factory,
  Gauge,
  GraduationCap,
  Handshake,
  HeartPulse,
  Info,
  Landmark,
  ShieldCheck,
  Sprout,
  TrendingUp,
  TriangleAlert,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import type { WizardDraft } from '../../../game/setup'
import type { Conditions, Difficulty } from '../../../game/types'
import { setDevelopment } from '../../../game/draft'
import { COUNTRY_BY_CCA2 } from '../../../data/countries'
import { SCENARIO_BY_ID } from '../../../data/scenarios'
import { DIFFICULTY_BY_ID, WORLDS_ABUNDANCE_LABEL } from '../../../game/labels'
import { Meter, RangeField, Segmented, TextField } from '../../../components/ui/Controls'
import {
  formatMoney,
  formatPercent,
  formatPopulation,
} from '../../../lib/format'
import { SectionHead } from '../parts'

type MeterField = {
  key: keyof Conditions
  label: string
  icon: ReactNode
  tone: 'sage' | 'bronze' | 'stone' | 'clay'
}

const METER_FIELDS: MeterField[] = [
  { key: 'economy', label: 'الاقتصاد', icon: <TrendingUp size={13} />, tone: 'sage' },
  { key: 'infrastructure', label: 'البنية التحتية', icon: <Wrench size={13} />, tone: 'sage' },
  { key: 'education', label: 'التعليم', icon: <GraduationCap size={13} />, tone: 'bronze' },
  { key: 'healthcare', label: 'الصحة', icon: <HeartPulse size={13} />, tone: 'bronze' },
  { key: 'energy', label: 'الطاقة', icon: <Zap size={13} />, tone: 'bronze' },
  { key: 'agriculture', label: 'الزراعة', icon: <Sprout size={13} />, tone: 'sage' },
  { key: 'industry', label: 'الصناعة', icon: <Factory size={13} />, tone: 'stone' },
  { key: 'resources', label: 'الموارد', icon: <Landmark size={13} />, tone: 'bronze' },
  { key: 'stability', label: 'الاستقرار', icon: <ShieldCheck size={13} />, tone: 'sage' },
  { key: 'relations', label: 'العلاقات الخارجية', icon: <Handshake size={13} />, tone: 'stone' },
]

const DEVELOPMENTS = [
  {
    id: 'developing' as const,
    label: 'نامية',
    description: 'بنية أساسية محدودة واقتصاد يعتمد على الزراعة والموارد.',
  },
  {
    id: 'emerging' as const,
    label: 'ناشئة',
    description: 'تصنيع وخدمات متوسطة ومؤسسات في طور الترسيخ.',
  },
  {
    id: 'advanced' as const,
    label: 'متقدمة',
    description: 'اقتصاد متنوع وبنية حديثة ومؤسسات راسخة.',
  },
]

export function ConditionsStep({
  draft,
  setDraft,
}: {
  draft: WizardDraft
  setDraft: Dispatch<SetStateAction<WizardDraft>>
}) {
  const conditions = draft.conditions
  const record = draft.selectedCode ? COUNTRY_BY_CCA2.get(draft.selectedCode) : null
  const scenario = draft.scenarioId ? SCENARIO_BY_ID[draft.scenarioId] : null
  const difficulty = DIFFICULTY_BY_ID[draft.world.difficulty]

  const setCondition = (key: keyof Conditions, value: number) =>
    setDraft((current) => {
      const next: Conditions = { ...current.conditions, [key]: value }
      return {
        ...current,
        conditions: next,
        identity:
          key === 'population'
            ? { ...current.identity, population: value }
            : current.identity,
        quickTouched: true,
      }
    })

  const editNumber = (key: keyof Conditions, raw: string) => {
    const parsed = Number(raw.replace(/[^0-9.]/g, ''))
    if (!Number.isFinite(parsed)) return
    setCondition(key, Math.max(0, parsed))
  }

  return (
    <div>
      <div className="cond-topbar">
        <Segmented
          label="طريقة الإعداد"
          value={draft.conditionsMode}
          onChange={(value) =>
            setDraft((current) => ({ ...current, conditionsMode: value }))
          }
          options={[
            { value: 'quick', label: 'إعداد سريع' },
            { value: 'advanced', label: 'إعداد متقدم' },
          ]}
        />
        <span className="chip chip--bronze">
          <Gauge size={12} /> {difficulty.label}
        </span>
      </div>

      {scenario?.conditions && (
        <div className="cond-source">
          <Info size={15} />
          <span>
            شروط البداية مستندة إلى سيناريو «{scenario.title}». التاريخية منها تقديرية لأغراض
            اللعب وليست إحصاءات رسمية، ويمكنك تعديل كل قيمة من الإعداد المتقدم.
          </span>
        </div>
      )}

      {draft.countryKind === 'fictional' && (
        <section className="step-section" style={{ marginTop: 0 }}>
          <SectionHead
            title="مستوى تنمية الدولة الخيالية"
            hint="يحدد الانطلاق الاقتصادي والاجتماعي قبل أي تعديل يدوي."
          />
          <div className="option-cards" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
            {DEVELOPMENTS.map((development) => (
              <button
                key={development.id}
                type="button"
                className={`option-card ${draft.development === development.id ? 'is-active' : ''}`}
                onClick={() =>
                  setDraft((current) => setDevelopment(current, development.id))
                }
                aria-pressed={draft.development === development.id}
              >
                <strong>{development.label}</strong>
                <small>{development.description}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      {draft.conditionsMode === 'quick' ? (
        <>
          <div className="quick-summary">
            <div className="quick-stat">
              <span className="quick-stat__label">
                <Users size={12} /> السكان
              </span>
              <span className="quick-stat__value">{formatPopulation(conditions.population)}</span>
              <span className="quick-stat__sub">
                {record ? `بيانات ${record.nameAr}` : 'تقدير الدولة الخيالية'}
              </span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat__label">
                <Coins size={12} /> الخزينة
              </span>
              <span className="quick-stat__value">{formatMoney(conditions.treasury)}</span>
              <span className="quick-stat__sub">رصيد بداية تقديري</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat__label">
                <Banknote size={12} /> الدين العام
              </span>
              <span className="quick-stat__value">{formatPercent(conditions.debtPct)}</span>
              <span className="quick-stat__sub">من الناتج المحلي</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat__label">
                <ShieldCheck size={12} /> الاستقرار
              </span>
              <span className="quick-stat__value">{conditions.stability}</span>
              <span className="quick-stat__sub">مؤشر من 100</span>
            </div>
          </div>

          <div className="form-section">
            <div className="adv-number-grid">
              <TextField
                label="السكان"
                value={String(conditions.population)}
                onChange={(value) => editNumber('population', value)}
                type="number"
                suffix="نسمة"
              />
              <TextField
                label="الخزينة (مليار دولار)"
                value={String(conditions.treasury)}
                onChange={(value) => editNumber('treasury', value)}
                type="number"
                suffix="مليار $"
              />
            </div>
            <div style={{ marginTop: '0.65rem' }}>
              <RangeField
                label="نسبة الدين إلى الناتج"
                value={conditions.debtPct}
                min={0}
                max={200}
                onChange={(value) => setCondition('debtPct', value)}
                format={(value) => formatPercent(value)}
                hint="0% = بلا دين · 200% = دين يعادل ضعف الناتج"
              />
            </div>
          </div>

          <section className="step-section">
            <SectionHead
              title="المؤشرات الأساسية"
              hint="قيم بداية محسوبة من بيانات الدولة أو من مستوى التنمية. عدّلها من الإعداد المتقدم."
            />
            <div className="quick-meters">
              {METER_FIELDS.map((field) => (
                <Meter
                  key={field.key}
                  label={field.label}
                  value={Number(conditions[field.key])}
                  icon={field.icon}
                  tone={field.tone}
                  small
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="advanced-grid">
          <div className="advanced-group">
            <h3>
              <Users size={15} /> السكان والخزينة
            </h3>
            <div className="advanced-group__fields">
              <TextField
                label="عدد السكان"
                value={String(conditions.population)}
                onChange={(value) => editNumber('population', value)}
                type="number"
                suffix="نسمة"
              />
              <TextField
                label="الخزينة (مليار دولار)"
                value={String(conditions.treasury)}
                onChange={(value) => editNumber('treasury', value)}
                type="number"
                suffix="مليار $"
              />
              <RangeField
                label="نسبة الدين إلى الناتج"
                value={conditions.debtPct}
                min={0}
                max={200}
                onChange={(value) => setCondition('debtPct', value)}
                format={(value) => formatPercent(value)}
              />
            </div>
          </div>

          <div className="advanced-group">
            <h3>
              <TrendingUp size={15} /> الاقتصاد والصناعة
            </h3>
            <div className="advanced-group__fields">
              <RangeField
                label="الاقتصاد"
                value={conditions.economy}
                min={0}
                max={100}
                onChange={(value) => setCondition('economy', value)}
              />
              <RangeField
                label="الصناعة"
                value={conditions.industry}
                min={0}
                max={100}
                onChange={(value) => setCondition('industry', value)}
              />
              <RangeField
                label="الزراعة"
                value={conditions.agriculture}
                min={0}
                max={100}
                onChange={(value) => setCondition('agriculture', value)}
              />
              <RangeField
                label="الموارد الطبيعية"
                value={conditions.resources}
                min={0}
                max={100}
                onChange={(value) => setCondition('resources', value)}
              />
            </div>
          </div>

          <div className="advanced-group">
            <h3>
              <Wrench size={15} /> البنية والخدمات
            </h3>
            <div className="advanced-group__fields">
              <RangeField
                label="البنية التحتية"
                value={conditions.infrastructure}
                min={0}
                max={100}
                onChange={(value) => setCondition('infrastructure', value)}
              />
              <RangeField
                label="الطاقة"
                value={conditions.energy}
                min={0}
                max={100}
                onChange={(value) => setCondition('energy', value)}
              />
              <RangeField
                label="التعليم"
                value={conditions.education}
                min={0}
                max={100}
                onChange={(value) => setCondition('education', value)}
              />
              <RangeField
                label="الصحة"
                value={conditions.healthcare}
                min={0}
                max={100}
                onChange={(value) => setCondition('healthcare', value)}
              />
            </div>
          </div>

          <div className="advanced-group">
            <h3>
              <ShieldCheck size={15} /> الاستقرار والعلاقات
            </h3>
            <div className="advanced-group__fields">
              <RangeField
                label="الاستقرار الداخلي"
                value={conditions.stability}
                min={0}
                max={100}
                onChange={(value) => setCondition('stability', value)}
              />
              <RangeField
                label="العلاقات الخارجية"
                value={conditions.relations}
                min={0}
                max={100}
                onChange={(value) => setCondition('relations', value)}
              />
              <RangeField
                label="الموارد الطبيعية"
                value={conditions.resources}
                min={0}
                max={100}
                onChange={(value) => setCondition('resources', value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="conditions-warning">
        <TriangleAlert size={16} />
        <span>
          هذه المرحلة تحفظ شروط البداية فقط. لا يوجد بعد نمو سكاني تلقائي، ولا ميزانية حية، ولا
          تجارة، ولا أحداث عالم مفروضة. المحرك الكامل يُبنى في المراحل القادمة.
        </span>
      </div>

      <p className="tiny faint" style={{ marginTop: '0.7rem', lineHeight: 1.7 }}>
        المصدر: السكان والدخل من مؤشرات البنك الدولي وبيانات world-countries، والدين العام من
        أحدث تقديرات متاحة. القيم النهائية تقديرية وقد تختلف عن الواقع. تُقرأ الموارد وفق مستوى{' '}
        {WORLDS_ABUNDANCE_LABEL[draft.world.abundance]}.
      </p>
    </div>
  )
}
