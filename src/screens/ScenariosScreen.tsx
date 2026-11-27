import { useState } from 'react'
import { ArrowRight, ChevronLeft, Globe2, Landmark, Sparkles } from 'lucide-react'
import { Brand } from '../components/Logo'
import { Button } from '../components/ui/Controls'
import { SCENARIOS } from '../data/scenarios'
import { COUNTRY_BY_CCA2 } from '../data/countries'
import { DIFFICULTY_BY_ID } from '../data/worlds'
import type { Scenario } from '../game/types'

interface ScenariosScreenProps {
  onBack: () => void
  onStart: (scenarioId: string) => void
}

export function ScenariosScreen({ onBack, onStart }: ScenariosScreenProps) {
  const [filter, setFilter] = useState<'all' | 'historical' | 'modern'>('all')
  const scenarios = SCENARIOS.filter((s) => filter === 'all' || s.era === filter)

  return (
    <div className="screen">
      <div className="screen__ambient" aria-hidden />
      <header className="screen-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Button variant="glass" size="sm" icon={<ArrowRight size={15} />} onClick={onBack}>
            القائمة
          </Button>
          <Brand compact />
        </div>
        <span className="menu-stage">
          <span className="dot dot--bronze" /> بذور سيناريو
        </span>
      </header>

      <div className="screen__inner">
        <div className="screen-title-block">
          <span className="eyebrow">سيناريوهات مختارة</span>
          <h1>ابدأ من لحظة فارقة</h1>
          <p>
            كل سيناريو يضبط السنة، والدولة المقترحة، وشروط البداية. الأحداث التاريخية الحيّة
            والقرارات المفروضة ستُضاف في مراحل المحاكاة القادمة، وليس في هذه المرحلة.
          </p>
        </div>

        <div className="scenario-filters" role="group" aria-label="تصفية السيناريوهات">
          {[
            { id: 'all' as const, label: `الكل (${SCENARIOS.length})` },
            { id: 'historical' as const, label: 'تاريخي' },
            { id: 'modern' as const, label: 'حديث' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              className={filter === f.id ? 'is-active' : ''}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="scenario-grid">
          {scenarios.map((scenario) => {
            const country = scenario.countryCode ? COUNTRY_BY_CCA2.get(scenario.countryCode) : null
            const difficulty = DIFFICULTY_BY_ID[scenario.difficulty]
            return (
              <article
                key={scenario.id}
                className="scenario-card"
                style={{ '--card-accent': scenario.accent } as React.CSSProperties}
              >
                <span className="scenario-card__year">{scenario.year}</span>
                <div className="scenario-card__top">
                  <span className={`chip ${scenario.era === 'historical' ? 'chip--bronze' : 'chip--sage'}`}>
                    {scenario.era === 'historical' ? <Landmark size={11} /> : <Globe2 size={11} />}
                    {scenario.tag}
                  </span>
                  <span className="chip">{difficulty.label}</span>
                </div>
                <div>
                  <h3>{scenario.title}</h3>
                  <div className="scenario-card__subtitle">{scenario.subtitle}</div>
                </div>
                <p className="scenario-card__desc">{scenario.description}</p>
                <div className="scenario-card__meta">
                  {country ? (
                    <>
                      <span className="chip">
                        <span className="flag" style={{ width: 18, borderRadius: 3, display: 'inline-block' }}>
                          <img src={`/flags/${country.cca2.toLowerCase()}.svg`} alt="" />
                        </span>
                        {country.nameAr}
                      </span>
                      <span className="chip">{country.capitalAr}</span>
                    </>
                  ) : (
                    <span className="chip">
                      <Globe2 size={11} /> اختر دولتك في الخطوة الثانية
                    </span>
                  )}
                  {scenario.presets.guidance.slice(0, 1).map((g) => (
                    <span key={g} className="chip chip--sage">
                      {g}
                    </span>
                  ))}
                </div>
                <div className="scenario-card__footer">
                  <span className="scenario-card__country">
                    <Sparkles size={13} style={{ color: scenario.accent }} />
                    سنة البداية {scenario.year}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onStart(scenario.id)}
                    icon={<ChevronLeft size={15} />}
                  >
                    ابدأ السيناريو
                  </Button>
                </div>
              </article>
            )
          })}
        </div>

        <p className="tiny faint" style={{ marginTop: '1.4rem', lineHeight: 1.8, maxWidth: '72ch' }}>
          ملاحظة صريحة: شروط البداية في السيناريوهات التاريخية تقديرية لأغراض اللعب، وليست
          إحصاءات رسمية لتلك السنوات. السكان والمساحة في الدول الحقيقية مستندان إلى مصادر دولية
          حديثة عند اختيار دولتك.
        </p>
      </div>
    </div>
  )
}
