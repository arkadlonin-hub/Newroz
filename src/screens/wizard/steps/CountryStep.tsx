import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import {
  CheckCircle2,
  Globe2,
  Landmark,
  MapPin,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import type { WizardDraft } from '../../../game/setup'
import { SELECTABLE_COUNTRIES, COUNTRY_BY_CCA2, emptyFictionalIdentity } from '../../../data/countries'
import { formatArea, formatPopulation } from '../../../lib/format'
import { selectFictionalCountry, selectRealCountry } from '../../../game/draft'
import { Flag } from '../../../components/Flag'
import { Emblem } from '../../../components/Emblem'
import { WorldMap } from '../../../components/WorldMap'
import { Segmented } from '../../../components/ui/Controls'
import { SectionHead } from '../parts'

export function CountryStep({
  draft,
  setDraft,
}: {
  draft: WizardDraft
  setDraft: Dispatch<SetStateAction<WizardDraft>>
}) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('الكل')

  const regions = useMemo(() => {
    const values = new Set(SELECTABLE_COUNTRIES.map((country) => country.regionAr))
    return ['الكل', ...Array.from(values)]
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return SELECTABLE_COUNTRIES.filter((country) => {
      if (region !== 'الكل' && country.regionAr !== region) return false
      if (!needle) return true
      return (
        country.nameAr.includes(needle) ||
        country.nameEn.toLowerCase().includes(needle) ||
        country.capitalAr.includes(needle) ||
        country.cca2.toLowerCase() === needle
      )
    }).sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'))
  }, [query, region])

  const selected = draft.selectedCode ? COUNTRY_BY_CCA2.get(draft.selectedCode) : null

  const switchKind = (kind: 'real' | 'fictional') => {
    if (kind === draft.countryKind) return
    if (kind === 'fictional') {
      setDraft((current) => selectFictionalCountry(current))
    } else {
      setDraft((current) => ({
        ...current,
        countryKind: 'real',
        selectedCode: null,
        identity: { ...emptyFictionalIdentity(), kind: 'real' },
      }))
    }
  }

  return (
    <div>
      <div className="country-kind-tabs">
        <Segmented
          label="نوع الدولة"
          value={draft.countryKind}
          onChange={switchKind}
          options={[
            { value: 'real', label: 'دولة حقيقية', icon: <Globe2 size={14} /> },
            { value: 'fictional', label: 'دولة خيالية', icon: <Sparkles size={14} /> },
          ]}
        />
      </div>

      {draft.countryKind === 'real' ? (
        <div className="country-picker">
          <div className="country-side">
            <div className="country-search">
              <Search size={15} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث باسم الدولة أو العاصمة..."
                aria-label="البحث عن دولة"
              />
            </div>
            <div className="region-chips" role="group" aria-label="تصفية حسب المنطقة">
              {regions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={region === item ? 'is-active' : ''}
                  onClick={() => setRegion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="country-list" role="listbox" aria-label="قائمة الدول">
              {filtered.map((country) => {
                const active = draft.selectedCode === country.cca2
                return (
                  <button
                    key={country.cca2}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`country-option ${active ? 'is-active' : ''}`}
                    onClick={() => setDraft((current) => selectRealCountry(current, country))}
                  >
                    <span className="flag country-option__flag">
                      <img src={`/flags/${country.cca2.toLowerCase()}.svg`} alt="" loading="lazy" />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span className="country-option__name">{country.nameAr}</span>
                      <span className="country-option__meta">
                        {country.capitalAr} · {country.regionAr}
                        {country.population ? ` · ${formatPopulation(country.population)}` : ''}
                      </span>
                    </span>
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <p className="tiny faint" style={{ padding: '1rem 0.5rem', lineHeight: 1.7 }}>
                  لا توجد دولة تطابق هذا البحث. جرّب اسماً آخر أو أزل تصفية المنطقة.
                </p>
              )}
            </div>
            <p className="tiny faint" style={{ lineHeight: 1.6 }}>
              {filtered.length} دولة قابلة للاختيار. البيانات السكانية والاقتصادية من مصادر دولية حديثة.
            </p>
          </div>

          <div className="country-map-wrap">
            <WorldMap
              selectedCode={draft.selectedCode}
              onSelect={(country) => setDraft((current) => selectRealCountry(current, country))}
              className="country-map"
            />
            {selected ? (
              <div className="selected-country">
                <Flag identity={draft.identity} />
                <div className="selected-country__text">
                  <strong>{selected.nameAr}</strong>
                  <span>
                    {selected.capitalAr} · {selected.regionAr}
                    {selected.subregionAr ? ` / ${selected.subregionAr}` : ''}
                  </span>
                  <span>{formatPopulation(selected.population ?? draft.conditions.population)}</span>
                </div>
                <span className="chip chip--sage">
                  <CheckCircle2 size={11} /> محددة
                </span>
              </div>
            ) : (
              <div className="country-empty">
                <MapPin size={22} />
                <span>اضغط على أي دولة في الخريطة أو القائمة لاختيارها.</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="fictional-panel">
            <div className="fictional-panel__visual">
              <Flag identity={draft.identity} />
              <Emblem design={draft.identity.emblem} />
            </div>
            <div>
              <span className="eyebrow eyebrow--plain">دولة من ابتكارك</span>
              <h3>أرض بلا حدود سابقة</h3>
              <p>
                ستكون دولتك على خريطة العالم الحقيقية، في الموقع الذي تختاره. الاسم والعلم والنظام
                والحكاية كلها لك، أما الجغرافيا فتبقى حقيقية.
              </p>
              <ul className="fictional-features">
                <li>
                  <CheckCircle2 size={14} /> اختر أي موقع جغرافي على الخريطة.
                </li>
                <li>
                  <CheckCircle2 size={14} /> صمّم العلم والشعار والهوية في الخطوة التالية.
                </li>
                <li>
                  <CheckCircle2 size={14} /> السكان والاقتصاد يبدآن من مستوى تنمية تختاره.
                </li>
              </ul>
            </div>
          </div>

          <section className="step-section">
            <SectionHead
              title="موقع الدولة على الخريطة"
              hint="انقر على الموقع التقريبي. تُحفظ الإحداثيات مع هوية الدولة."
            />
            <div className="country-map-wrap">
              <WorldMap
                picking
                location={draft.identity.latlng}
                onLocationChange={(coords) =>
                  setDraft((current) => ({
                    ...current,
                    identity: { ...current.identity, latlng: coords },
                  }))
                }
                markerLabel={draft.identity.nameAr || 'دولتك'}
              />
              <div className="selected-country">
                <Emblem design={draft.identity.emblem} />
                <div className="selected-country__text">
                  <strong>{draft.identity.nameAr || 'دولة بلا اسم بعد'}</strong>
                  <span>
                    <MapPin size={11} style={{ display: 'inline', verticalAlign: -1 }} />{' '}
                    {draft.identity.latlng[0].toFixed(1)}° شمالاً ·{' '}
                    {draft.identity.latlng[1].toFixed(1)}° شرقاً
                  </span>
                  <span>
                    <Landmark size={11} style={{ display: 'inline', verticalAlign: -1 }} />{' '}
                    {draft.identity.capitalAr || 'العاصمة تُحدد في الخطوة التالية'}
                  </span>
                  <span>
                    <Users size={11} style={{ display: 'inline', verticalAlign: -1 }} />{' '}
                    {formatPopulation(draft.conditions.population)} · مساحة{' '}
                    {formatArea(draft.identity.areaKm2)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
