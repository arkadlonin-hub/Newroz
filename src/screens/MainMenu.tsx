import {
  ChevronLeft,
  Compass,
  FolderOpen,
  Play,
  ScrollText,
  Settings2,
  Sparkles,
} from 'lucide-react'
import { WorldGlobe } from '../components/WorldGlobe'
import { Brand } from '../components/Logo'
import { Flag } from '../components/Flag'
import { useGame } from '../game/GameProvider'
import { formatGameDate } from '../lib/format'
import type { WorldKind } from '../game/types'

interface MainMenuProps {
  onNewGame: (seed?: WorldKind | null) => void
  onContinue: () => void
  onSaves: () => void
  onScenarios: () => void
  onSettings: () => void
}

export function MainMenu({ onNewGame, onContinue, onSaves, onScenarios, onSettings }: MainMenuProps) {
  const { saves, settings } = useGame()
  const latest = saves[0]
  const hasSaves = saves.length > 0

  return (
    <div className="menu-screen">
      <div className="menu-scene" aria-hidden>
        <div className="menu-globe">
          <WorldGlobe motionEnabled={!settings.reducedMotion} />
        </div>
        <div className="menu-aurora menu-aurora--one" />
        <div className="menu-aurora menu-aurora--two" />
        <div className="menu-scrim" />
      </div>

      <header className="menu-topbar">
        <Brand />
        <span className="menu-stage">
          <span className="dot" />
          عالم حيّ · المرحلة الأولى
        </span>
      </header>

      <main className="menu-main">
        <div className="menu-content">
          <div className="menu-heading">
            <span className="menu-kicker">محاكاة دولة وحضارة</span>
            <h1 className="menu-title">نيـروز</h1>
            <p className="menu-tagline">عالمٌ حيّ. قرارٌ واحد. مصيرٌ كامل.</p>
            <p className="menu-desc">
              ابدأ من جغرافيا حقيقية، أو ابنِ دولة من نسج خيالك. اختر نظام الحكم، وحدّد شروط
              البداية، ثم امتلك القرار في عالم يكبر مع كل مرحلة.
            </p>
            <div className="menu-facts">
              <span className="chip">
                <span className="dot" /> خريطة عالم حقيقية
              </span>
              <span className="chip">
                <span className="dot dot--bronze" /> دولة خيالية
              </span>
              <span className="chip">
                <span className="dot" /> عربية · RTL كامل
              </span>
            </div>
          </div>

          <section className="menu-panel glass" aria-label="القائمة الرئيسية">
            <div className="menu-list">
              <button
                type="button"
                className="menu-row menu-row--primary"
                onClick={() => onNewGame(null)}
              >
                <span className="menu-row__icon">
                  <Sparkles size={20} strokeWidth={1.7} />
                </span>
                <span className="menu-row__text">
                  <strong>لعبة جديدة</strong>
                  <small>من العالم الحقيقي إلى دولة من ابتكارك</small>
                </span>
                <ChevronLeft className="menu-row__chevron" size={18} />
              </button>

              <button
                type="button"
                className="menu-row menu-row--continue"
                onClick={onContinue}
                disabled={!hasSaves}
              >
                <span className="menu-row__icon">
                  <Play size={18} strokeWidth={1.7} />
                </span>
                <span className="menu-row__text">
                  <strong>متابعة</strong>
                  <small>
                    {latest
                      ? `${latest.meta.countryName} · ${formatGameDate({
                          year: latest.meta.year,
                          month: latest.meta.month,
                          day: latest.meta.day,
                        })}`
                      : 'لا توجد لعبة محفوظة بعد'}
                  </small>
                </span>
                <ChevronLeft className="menu-row__chevron" size={18} />
              </button>

              <button type="button" className="menu-row" onClick={() => onNewGame('custom')}>
                <span className="menu-row__icon">
                  <Compass size={18} strokeWidth={1.7} />
                </span>
                <span className="menu-row__text">
                  <strong>عالم مخصص</strong>
                  <small>اسم العالم، السنة، التقنية، الموارد والمناخ</small>
                </span>
                <ChevronLeft className="menu-row__chevron" size={18} />
              </button>

              <button type="button" className="menu-row" onClick={onScenarios}>
                <span className="menu-row__icon">
                  <ScrollText size={18} strokeWidth={1.7} />
                </span>
                <span className="menu-row__text">
                  <strong>سيناريوهات</strong>
                  <small>لحظات تاريخية وعوالم حديثة مختارة</small>
                </span>
                <ChevronLeft className="menu-row__chevron" size={18} />
              </button>

              <button type="button" className="menu-row" onClick={onSettings}>
                <span className="menu-row__icon">
                  <Settings2 size={18} strokeWidth={1.7} />
                </span>
                <span className="menu-row__text">
                  <strong>الإعدادات</strong>
                  <small>حجم النص، الحركة، الحفظ التلقائي والبيانات</small>
                </span>
                <ChevronLeft className="menu-row__chevron" size={18} />
              </button>
            </div>

            <div className="menu-foot">
              <div className="menu-foot__links">
                <button type="button" onClick={onSaves}>
                  <FolderOpen size={12} style={{ display: 'inline', marginInlineEnd: 4, verticalAlign: -1 }} />
                  الحفظات {hasSaves ? `(${saves.length})` : ''}
                </button>
                <span>·</span>
                <span>المرحلة 0.1 — الأساس</span>
              </div>
              <span>محلي بالكامل</span>
            </div>
          </section>
        </div>
      </main>

      <div className="menu-corner">
        <span />
        NEWROZ · WORLD SIMULATION FOUNDATION
      </div>
    </div>
  )
}
