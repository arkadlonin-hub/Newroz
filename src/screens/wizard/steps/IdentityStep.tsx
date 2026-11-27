import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import {
  Flag as FlagIcon,
  Globe2,
  Landmark,
  Languages,
  MapPin,
  Palette,
  Plus,
  Shapes,
  Sparkles,
} from 'lucide-react'
import type { WizardDraft } from '../../../game/setup'
import type {
  EmblemMetal,
  EmblemShape,
  EmblemSymbol,
  FlagPattern,
  FlagSymbol,
} from '../../../game/types'
import { COMMON_LANGUAGES, FLAG_PALETTE, IDENTITIES, IDENTITY_BY_ID } from '../../../data/identities'
import { Flag, FlagArt } from '../../../components/Flag'
import { Emblem } from '../../../components/Emblem'
import { WorldMap } from '../../../components/WorldMap'
import { Segmented, TextField } from '../../../components/ui/Controls'
import { formatArea, formatPopulation } from '../../../lib/format'
import { SectionHead } from '../parts'

const PATTERNS: { id: FlagPattern; label: string }[] = [
  { id: 'solid', label: 'لون واحد' },
  { id: 'horizontal', label: 'أشرطة أفقية' },
  { id: 'vertical', label: 'أشرطة رأسية' },
  { id: 'triband', label: 'شريط وسطي' },
  { id: 'canton', label: 'زاوية' },
  { id: 'diagonal', label: 'قطري' },
  { id: 'chevron', label: 'سهم' },
]

const FLAG_SYMBOLS: { id: FlagSymbol; label: string }[] = [
  { id: 'none', label: 'بلا رمز' },
  { id: 'star', label: 'نجمة' },
  { id: 'star8', label: 'نجمة ثمانية' },
  { id: 'crescent', label: 'هلال' },
  { id: 'sun', label: 'شمس' },
  { id: 'tree', label: 'شجرة' },
  { id: 'eagle', label: 'نسر' },
  { id: 'lion', label: 'أسد' },
  { id: 'wheat', label: 'سنابل' },
  { id: 'mountain', label: 'جبل' },
  { id: 'flame', label: 'لهب' },
]

const EMBLEM_SHAPES: { id: EmblemShape; label: string }[] = [
  { id: 'shield', label: 'درع' },
  { id: 'circle', label: 'دائرة' },
  { id: 'eight', label: 'نجمة ثمانية' },
]

const EMBLEM_SYMBOLS: { id: EmblemSymbol; label: string }[] = [
  { id: 'star', label: 'نجمة' },
  { id: 'crescent', label: 'هلال' },
  { id: 'sun', label: 'شمس' },
  { id: 'tree', label: 'شجرة' },
  { id: 'eagle', label: 'نسر' },
  { id: 'lion', label: 'أسد' },
  { id: 'wheat', label: 'سنابل' },
  { id: 'mountain', label: 'جبل' },
  { id: 'ship', label: 'سفينة' },
  { id: 'crown', label: 'تاج' },
]

const EMBLEM_METALS: { id: EmblemMetal; label: string; color: string }[] = [
  { id: 'bronze', label: 'برونزي', color: '#b48854' },
  { id: 'gold', label: 'ذهبي', color: '#c9a25c' },
  { id: 'ivory', label: 'عاجي', color: '#d6c8ad' },
  { id: 'emerald', label: 'زمردي', color: '#6f9c7f' },
]

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-row">
      <span className="info-row__label">{label}</span>
      <span className="info-row__value">{value}</span>
    </div>
  )
}

export function IdentityStep({
  draft,
  setDraft,
}: {
  draft: WizardDraft
  setDraft: Dispatch<SetStateAction<WizardDraft>>
}) {
  const identity = draft.identity
  const [customLanguage, setCustomLanguage] = useState('')

  const languages = useMemo(() => {
    const map = new Map<string, string>()
    for (const language of COMMON_LANGUAGES) map.set(language.code, language.nameAr)
    for (const language of identity.languages) map.set(language.code, language.nameAr)
    return Array.from(map.entries()).map(([code, nameAr]) => ({ code, nameAr }))
  }, [identity.languages])

  const setIdentity = (patch: Partial<WizardDraft['identity']>) =>
    setDraft((current) => ({
      ...current,
      identity: { ...current.identity, ...patch },
    }))

  const setFlag = (patch: Partial<WizardDraft['identity']['flag']>) =>
    setDraft((current) => ({
      ...current,
      identity: {
        ...current.identity,
        flag: { ...current.identity.flag, ...patch },
      },
    }))

  const setEmblem = (patch: Partial<WizardDraft['identity']['emblem']>) =>
    setDraft((current) => ({
      ...current,
      identity: {
        ...current.identity,
        emblem: { ...current.identity.emblem, ...patch },
      },
    }))

  const toggleLanguage = (code: string, nameAr: string) => {
    setDraft((current) => {
      const exists = current.identity.languages.some((language) => language.code === code)
      if (exists && current.identity.languages.length === 1) return current
      const next = exists
        ? current.identity.languages.filter((language) => language.code !== code)
        : [...current.identity.languages, { code, nameAr }]
      return { ...current, identity: { ...current.identity, languages: next } }
    })
  }

  const addLanguage = () => {
    const name = customLanguage.trim()
    if (!name) return
    const code = `custom_${name.slice(0, 4)}_${identity.languages.length}`
    setDraft((current) => ({
      ...current,
      identity: {
        ...current.identity,
        languages: [...current.identity.languages, { code, nameAr: name }],
      },
    }))
    setCustomLanguage('')
  }

  const setColor = (index: number, value: string) => {
    const colors = identity.flag.colors.map((color, i) =>
      i === index ? value : color,
    ) as [string, string, string]
    setFlag({ colors })
  }

  const canUseOfficial = identity.kind === 'real' && !!identity.cca2
  const showingOfficial = canUseOfficial && identity.flag.preset === 'official'
  const identityOption = IDENTITY_BY_ID[identity.identity]

  return (
    <div className="identity-layout">
      <div className="identity-form">
        <section className="form-section">
          <div className="form-section__head">
            <h2>
              <Landmark size={15} /> الاسم والعاصمة
            </h2>
            <span>تظهر في كل شاشات اللعبة</span>
          </div>
          <div className="form-grid">
            <TextField
              label="اسم الدولة بالعربية"
              value={identity.nameAr}
              onChange={(value) => setIdentity({ nameAr: value })}
              placeholder="مثال: جمهورية نيـروز"
              maxLength={42}
            />
            <TextField
              label="الاسم الدولي"
              value={identity.nameIntl}
              onChange={(value) => setIdentity({ nameIntl: value })}
              placeholder="Newroz Republic"
              maxLength={48}
            />
            <TextField
              label="العاصمة بالعربية"
              value={identity.capitalAr}
              onChange={(value) => setIdentity({ capitalAr: value })}
              placeholder="مثال: أور"
              maxLength={36}
            />
            <TextField
              label="اسم العاصمة الدولي"
              value={identity.capitalIntl}
              onChange={(value) => setIdentity({ capitalIntl: value })}
              placeholder="Ur"
              maxLength={40}
            />
            <TextField
              label="اسم العملة"
              value={identity.currencyName}
              onChange={(value) => setIdentity({ currencyName: value })}
              placeholder="دينار"
              maxLength={24}
            />
            <div className="form-grid--3" style={{ display: 'grid', gap: '0.65rem', gridTemplateColumns: '1fr 1fr' }}>
              <TextField
                label="رمز العملة"
                value={identity.currencyCode}
                onChange={(value) => setIdentity({ currencyCode: value.toUpperCase().slice(0, 4) })}
                placeholder="ND"
                maxLength={4}
              />
              <TextField
                label="إشارة العملة"
                value={identity.currencySymbol}
                onChange={(value) => setIdentity({ currencySymbol: value.slice(0, 3) })}
                placeholder="د"
                maxLength={3}
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>
              <Languages size={15} /> اللغات الوطنية
            </h2>
            <span>{identity.languages.length} لغة محددة</span>
          </div>
          <div className="language-chips" role="group" aria-label="اللغات الوطنية">
            {languages.map((language) => {
              const active = identity.languages.some((item) => item.code === language.code)
              return (
                <button
                  key={language.code}
                  type="button"
                  className={`language-chip ${active ? 'is-active' : ''}`}
                  onClick={() => toggleLanguage(language.code, language.nameAr)}
                  aria-pressed={active}
                >
                  {language.nameAr}
                </button>
              )
            })}
          </div>
          <div className="custom-add">
            <input
              value={customLanguage}
              onChange={(event) => setCustomLanguage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addLanguage()
                }
              }}
              placeholder="أضف لغة أخرى..."
              aria-label="إضافة لغة أخرى"
            />
            <button type="button" className="btn btn--outline btn--sm" onClick={addLanguage}>
              <Plus size={13} /> إضافة
            </button>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>
              <Sparkles size={15} /> الهوية الوطنية
            </h2>
            <span>{identityOption?.label ?? 'هوية مخصصة'}</span>
          </div>
          <div className="identity-options">
            {IDENTITIES.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`identity-option ${identity.identity === option.id ? 'is-active' : ''}`}
                onClick={() => setIdentity({ identity: option.id })}
                aria-pressed={identity.identity === option.id}
                title={option.description}
              >
                <strong style={{ color: identity.identity === option.id ? option.color : undefined }}>
                  <i style={{ color: option.color }} />
                  {option.label}
                </strong>
              </button>
            ))}
          </div>
          {identity.identity === 'custom' ? (
            <div style={{ marginTop: '0.65rem' }}>
              <TextField
                label="وصف الهوية المخصصة"
                value={identity.identityCustom}
                onChange={(value) => setIdentity({ identityCustom: value })}
                placeholder="ما الذي يجمع شعب دولتك؟"
                maxLength={160}
              />
            </div>
          ) : (
            <p className="tiny faint" style={{ marginTop: '0.55rem', lineHeight: 1.7 }}>
              {identityOption?.description}
            </p>
          )}
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>
              <FlagIcon size={15} /> العلم الوطني
            </h2>
            <span>{showingOfficial ? 'العلم الرسمي' : 'تصميم مخصص'}</span>
          </div>
          {canUseOfficial && (
            <div style={{ marginBottom: '0.7rem', maxWidth: 320 }}>
              <Segmented
                label="نوع العلم"
                value={identity.flag.preset}
                onChange={(value) => setFlag({ preset: value })}
                options={[
                  { value: 'official', label: 'العلم الرسمي' },
                  { value: 'custom', label: 'تصميم مخصص' },
                ]}
              />
            </div>
          )}

          {showingOfficial ? (
            <div className="selected-country">
              <Flag identity={identity} />
              <div className="selected-country__text">
                <strong>{identity.nameAr}</strong>
                <span>يُعرض العلم الرسمي للدولة من حزمة flag-icons.</span>
                <span>يمكنك اختيار «تصميم مخصص» لبناء علم جديد بالكامل.</span>
              </div>
            </div>
          ) : (
            <div className="flag-designer">
              <div className="flag-designer__preview">
                <Flag identity={{ ...identity, flag: { ...identity.flag, preset: 'custom' } }} />
                <span>معاينة العلم</span>
              </div>
              <div className="flag-controls">
                <div>
                  <span className="control-label">نمط التقسيم</span>
                  <div className="flag-patterns">
                    {PATTERNS.map((pattern) => (
                      <button
                        key={pattern.id}
                        type="button"
                        className={`pattern-btn ${identity.flag.pattern === pattern.id ? 'is-active' : ''}`}
                        onClick={() => setFlag({ pattern: pattern.id })}
                        aria-label={pattern.label}
                        title={pattern.label}
                      >
                        <FlagArt
                          design={{
                            ...identity.flag,
                            pattern: pattern.id,
                            symbol: 'none',
                            preset: 'custom',
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="control-label">ألوان العلم</span>
                  {['اللون الأول', 'اللون الثاني', 'اللون الثالث'].map((label, index) => (
                    <div className="palette-row" key={label} style={{ marginBottom: '0.3rem' }}>
                      <span className="palette-row__label">{label}</span>
                      {FLAG_PALETTE.map((color) => (
                        <button
                          key={`${label}-${color.value}`}
                          type="button"
                          className={`swatch ${identity.flag.colors[index] === color.value ? 'is-active' : ''}`}
                          style={{ background: color.value }}
                          onClick={() => setColor(index, color.value)}
                          aria-label={`${label}: ${color.name}`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div>
                  <span className="control-label">الرمز</span>
                  <div className="symbol-grid">
                    {FLAG_SYMBOLS.map((symbol) => (
                      <button
                        key={symbol.id}
                        type="button"
                        className={`symbol-chip ${identity.flag.symbol === symbol.id ? 'is-active' : ''}`}
                        onClick={() => setFlag({ symbol: symbol.id })}
                        aria-pressed={identity.flag.symbol === symbol.id}
                      >
                        {symbol.label}
                      </button>
                    ))}
                  </div>
                </div>

                {identity.flag.symbol !== 'none' && (
                  <div>
                    <span className="control-label">لون الرمز</span>
                    <div className="palette-row">
                      {FLAG_PALETTE.map((color) => (
                        <button
                          key={`symbol-${color.value}`}
                          type="button"
                          className={`swatch ${identity.flag.symbolColor === color.value ? 'is-active' : ''}`}
                          style={{ background: color.value }}
                          onClick={() => setFlag({ symbolColor: color.value })}
                          aria-label={`لون الرمز: ${color.name}`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>
              <Shapes size={15} /> الشعار الوطني
            </h2>
            <span>عنصر تصميم داخل اللعبة</span>
          </div>
          <div className="emblem-designer">
            <div className="emblem-designer__preview">
              <Emblem design={identity.emblem} />
            </div>
            <div className="emblem-controls">
              <div>
                <span className="control-label">الشكل</span>
                <div className="metal-row">
                  {EMBLEM_SHAPES.map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      className={`metal-chip ${identity.emblem.shape === shape.id ? 'is-active' : ''}`}
                      onClick={() => setEmblem({ shape: shape.id })}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="control-label">الرمز</span>
                <div className="emblem-symbols">
                  {EMBLEM_SYMBOLS.map((symbol) => (
                    <button
                      key={symbol.id}
                      type="button"
                      className={`symbol-chip ${identity.emblem.symbol === symbol.id ? 'is-active' : ''}`}
                      onClick={() => setEmblem({ symbol: symbol.id })}
                    >
                      {symbol.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="control-label">المعدن</span>
                <div className="metal-row">
                  {EMBLEM_METALS.map((metal) => (
                    <button
                      key={metal.id}
                      type="button"
                      className={`metal-chip ${identity.emblem.metal === metal.id ? 'is-active' : ''}`}
                      onClick={() => setEmblem({ metal: metal.id })}
                    >
                      <i style={{ background: metal.color }} />
                      {metal.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section__head">
            <h2>
              <MapPin size={15} /> الأرض والموقع
            </h2>
            <span>مساحة تقديرية</span>
          </div>
          <div className="territory-area">
            <TextField
              label="المساحة (كم²)"
              value={String(identity.areaKm2)}
              onChange={(value) => {
                const parsed = Number(value.replace(/[^0-9]/g, ''))
                setIdentity({ areaKm2: Number.isFinite(parsed) ? parsed : 0 })
              }}
              type="number"
              suffix="كم²"
            />
            <TextField
              label="السكان"
              value={String(draft.conditions.population)}
              onChange={(value) =>
                setDraft((current) => {
                  const parsed = Number(value.replace(/[^0-9]/g, ''))
                  const population = Number.isFinite(parsed) ? parsed : 0
                  return {
                    ...current,
                    conditions: { ...current.conditions, population },
                    identity: { ...current.identity, population },
                    quickTouched: true,
                  }
                })
              }
              type="number"
              suffix="نسمة"
            />
            <TextField
              label="خط العرض"
              value={String(identity.latlng[0])}
              onChange={(value) =>
                setIdentity({ latlng: [Number(value) || 0, identity.latlng[1]] })
              }
              type="number"
              suffix="°"
            />
            <TextField
              label="خط الطول"
              value={String(identity.latlng[1])}
              onChange={(value) =>
                setIdentity({ latlng: [identity.latlng[0], Number(value) || 0] })
              }
              type="number"
              suffix="°"
            />
          </div>
          <div className="territory-map">
            <WorldMap
              selectedCode={identity.cca2}
              location={identity.latlng}
              picking={identity.kind === 'fictional'}
              onLocationChange={(coords) => setIdentity({ latlng: coords })}
              markerLabel={identity.nameAr || 'دولتك'}
              compact
            />
          </div>
        </section>
      </div>

      <aside className="identity-preview" aria-label="معاينة هوية الدولة">
        <div className="identity-preview__flag">
          <Flag identity={identity} />
        </div>
        <div className="identity-preview__body">
          <div className="identity-preview__name">{identity.nameAr || 'دولة بلا اسم'}</div>
          <div className="identity-preview__intl">{identity.nameIntl || 'STATE NAME'}</div>
          <span className="preview-badge">
            <Palette size={11} /> {identityOption?.label ?? 'هوية'}
          </span>

          <div className="identity-preview__emblem">
            <Emblem design={identity.emblem} />
            <div className="identity-preview__emblem-text">
              <strong>{identity.capitalAr || 'العاصمة غير محددة'}</strong>
              <span>{identity.regionAr || 'الموقع الجغرافي'}</span>
            </div>
          </div>

          <div className="identity-preview__rows">
            <InfoRow label="العاصمة" value={identity.capitalAr || '—'} />
            <InfoRow label="المنطقة" value={identity.regionAr || '—'} />
            <InfoRow label="المساحة" value={formatArea(identity.areaKm2)} />
            <InfoRow label="السكان" value={formatPopulation(draft.conditions.population)} />
            <InfoRow
              label="العملة"
              value={`${identity.currencyName || '—'} (${identity.currencyCode || '—'})`}
            />
            <InfoRow
              label="اللغات"
              value={identity.languages.map((language) => language.nameAr).join('، ') || '—'}
            />
          </div>

          <p className="preview-note">
            الشعار عنصر تصميم داخل نيـروز وليس شعاراً رسمياً للدول الحقيقية. جغرافيا الدولة من
            خريطة العالم الحقيقية، أما الهوية فمن اختيارك.
          </p>
        </div>
      </aside>
    </div>
  )
}
