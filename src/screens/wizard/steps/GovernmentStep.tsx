import type { Dispatch, SetStateAction } from 'react'
import {
  Atom,
  Building2,
  Check,
  Crown,
  Flag,
  Landmark,
  Network,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Vote,
} from 'lucide-react'
import type { WizardDraft } from '../../../game/setup'
import type { GovernmentId } from '../../../game/types'
import {
  GOVERNMENTS,
  GOVERNMENT_BY_ID,
  governmentDifficultyLabel,
  powerProfile,
} from '../../../data/governments'
import { setGovernment } from '../../../game/draft'
import { Meter, RangeField, TextField } from '../../../components/ui/Controls'
import { SectionHead } from '../parts'

const GOV_ICONS = {
  Landmark,
  Vote,
  Building2,
  Crown,
  Network,
  Shield,
  ShieldAlert,
  Flag,
  Atom,
  SlidersHorizontal,
} as const

export function GovernmentStep({
  draft,
  setDraft,
}: {
  draft: WizardDraft
  setDraft: Dispatch<SetStateAction<WizardDraft>>
}) {
  const selected = GOVERNMENT_BY_ID[draft.government.id] ?? GOVERNMENT_BY_ID.republic
  const powers = powerProfile(draft.government)
  const Icon = GOV_ICONS[selected.icon as keyof typeof GOV_ICONS] ?? Landmark

  const selectGovernment = (id: GovernmentId) =>
    setDraft((current) => setGovernment(current, id))

  const setGovernmentField = (patch: Partial<WizardDraft['government']>) =>
    setDraft((current) => ({
      ...current,
      government: { ...current.government, ...patch },
    }))

  return (
    <div>
      <div className="gov-grid" role="list" aria-label="أنظمة الحكم">
        {GOVERNMENTS.map((government) => {
          const CardIcon = GOV_ICONS[government.icon as keyof typeof GOV_ICONS] ?? Landmark
          const active = draft.government.id === government.id
          return (
            <button
              key={government.id}
              type="button"
              role="listitem"
              className={`gov-card ${active ? 'is-active' : ''}`}
              style={{ '--gov-accent': government.accent } as React.CSSProperties}
              onClick={() => selectGovernment(government.id)}
              aria-pressed={active}
            >
              <div className="gov-card__top">
                <span className="gov-card__icon">
                  <CardIcon size={17} strokeWidth={1.6} />
                </span>
                <span className="gov-card__diff" title={`الصعوبة: ${governmentDifficultyLabel(government.difficulty)}`}>
                  {[1, 2, 3, 4].map((level) => (
                    <i key={level} className={level <= government.difficulty ? 'on' : ''} />
                  ))}
                </span>
              </div>
              <h3>{government.nameAr}</h3>
              <span className="gov-card__tag">{government.tagline}</span>
              <span className="gov-card__traits">
                {government.traits.map((trait) => (
                  <span key={trait}>{trait}</span>
                ))}
              </span>
              {active && (
                <span
                  className="chip chip--sage"
                  style={{ position: 'absolute', top: '0.6rem', insetInlineEnd: '0.7rem' }}
                >
                  <Check size={10} /> مختار
                </span>
              )}
            </button>
          )
        })}
      </div>

      {draft.government.id === 'custom' && (
        <section className="custom-gov">
          <SectionHead
            title="تصميم النظام المخصص"
            hint="هذه القيم ستشتق منها أدوات السياسة والأزمات في المراحل القادمة."
          />
          <div className="custom-gov__grid">
            <TextField
              label="اسم النظام"
              value={draft.government.customName}
              onChange={(value) => setGovernmentField({ customName: value })}
              placeholder="مثال: جمهورية المجالس المنتخبة"
              maxLength={40}
            />
            <TextField
              label="وصف مختصر"
              value={draft.government.customDescription}
              onChange={(value) => setGovernmentField({ customDescription: value })}
              placeholder="كيف تُتخذ القرارات؟ ومن يحاسب من؟"
              maxLength={120}
            />
          </div>
          <div className="power-grid" style={{ marginTop: '0.8rem' }}>
            <RangeField
              label="مركزية القرار"
              value={draft.government.centralization}
              min={0}
              max={100}
              onChange={(value) => setGovernmentField({ centralization: value })}
              hint="0 = صلاحيات واسعة للأقاليم · 100 = قرار مركزي بالكامل"
            />
            <RangeField
              label="شفافية الحكم"
              value={draft.government.transparency}
              min={0}
              max={100}
              onChange={(value) => setGovernmentField({ transparency: value })}
              hint="0 = قرارات مغلقة · 100 = إفصاح ومشاركة واسعة"
            />
            <RangeField
              label="نفوذ المؤسسة العسكرية"
              value={draft.government.militaryInfluence}
              min={0}
              max={100}
              onChange={(value) => setGovernmentField({ militaryInfluence: value })}
              hint="0 = سلطة مدنية كاملة · 100 = حضور عسكري مهيمن"
            />
          </div>
        </section>
      )}

      <div className="gov-detail">
        <div className="gov-detail__panel">
          <h3>
            <Icon size={16} style={{ color: selected.accent }} /> {selected.nameAr}
          </h3>
          <p className="gov-profile__desc">
            {draft.government.id === 'custom' && draft.government.customDescription
              ? draft.government.customDescription
              : selected.description}
          </p>
          <div className="gov-profile__traits" style={{ marginTop: '0.65rem' }}>
            {selected.traits.map((trait) => (
              <span className="chip" key={trait}>
                {trait}
              </span>
            ))}
            <span className="chip chip--bronze">
              صعوبة {governmentDifficultyLabel(selected.difficulty)}
            </span>
          </div>
          <div className="gov-future">
            <Sparkles size={15} />
            <span>{selected.future}</span>
          </div>
        </div>

        <div className="gov-detail__panel">
          <h3>
            <Landmark size={15} style={{ color: 'var(--bronze)' }} /> بنية الحكم
          </h3>
          <div className="gov-structure">
            <div className="gov-structure__item">
              <span>رأس الدولة</span>
              <strong>{selected.headOfState}</strong>
            </div>
            <div className="gov-structure__item">
              <span>السلطة التشريعية</span>
              <strong>{selected.legislature}</strong>
            </div>
            <div className="gov-structure__item">
              <span>السلطة التنفيذية</span>
              <strong>{selected.executive}</strong>
            </div>
            <div className="gov-structure__item">
              <span>مصدر الشرعية</span>
              <strong>{selected.legitimacy}</strong>
            </div>
          </div>

          <div className="power-grid" style={{ marginTop: '0.8rem' }}>
            <Meter
              label="مركزية القرار"
              value={powers.centralization}
              tone={powers.centralization > 65 ? 'bronze' : 'sage'}
              small
            />
            <Meter
              label="شفافية الحكم"
              value={powers.transparency}
              tone={powers.transparency > 55 ? 'sage' : 'stone'}
              small
            />
            <Meter
              label="نفوذ المؤسسة العسكرية"
              value={powers.militaryInfluence}
              tone={powers.militaryInfluence > 55 ? 'clay' : 'sage'}
              small
            />
          </div>
        </div>
      </div>

      <p className="tiny faint" style={{ marginTop: '0.7rem', lineHeight: 1.7 }}>
        هذه القيم توازنات بداية. الانتخابات والائتلافات والانقلابات والأزمات السياسية ستُضاف في
        مراحل المحاكاة القادمة، وليست فعّالة الآن.
      </p>
    </div>
  )
}
