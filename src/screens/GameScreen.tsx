import { useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, Gauge, Pause, Play, Save, Settings2 } from 'lucide-react'
import { Brand } from '../components/Logo'
import { Flag } from '../components/Flag'
import { Button, Modal } from '../components/ui/Controls'
import { useGame } from '../game/GameProvider'
import { formatGameDate, formatPopulation } from '../lib/format'
import { governmentDisplayName } from '../data/governments'

export function GameScreen({ onExit, onSettings }: { onExit: () => void; onSettings: () => void }) {
  const { game, paused, speed, setPaused, setSpeed, saveCurrent, simulationNote } = useGame()
  const [saveOpen, setSaveOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!game) return null

  const save = () => {
    setSaved(saveCurrent(`${game.country.nameAr} — ${formatGameDate(game.calendar)}`, 'update'))
  }

  return (
    <div className="game-shell">
      <header className="simbar glass">
        <Brand compact />
        <div className="simbar-country">
          <Flag identity={game.country} />
          <div>
            <strong>{game.country.nameAr}</strong>
            <span>{governmentDisplayName(game.government)}</span>
          </div>
        </div>
        <div className="simbar-date">
          <CalendarDays size={16} />
          <strong>{formatGameDate(game.calendar)}</strong>
        </div>
        <div className="clock-controls">
          <Button variant="glass" size="sm" icon={paused ? <Play size={14} /> : <Pause size={14} />} onClick={() => setPaused(!paused)}>
            {paused ? 'تشغيل' : 'إيقاف'}
          </Button>
          <div className="speed-pills" aria-label="سرعة الزمن">
            {([1, 2, 3] as const).map((value) => (
              <button key={value} type="button" className={speed === value ? 'is-active' : ''} onClick={() => setSpeed(value)}>{value}×</button>
            ))}
          </div>
        </div>
        <div className="simbar-actions">
          <Button variant="glass" size="sm" icon={<Save size={14} />} onClick={() => setSaveOpen(true)}>حفظ</Button>
          <Button variant="glass" size="sm" icon={<Settings2 size={14} />} onClick={onSettings} aria-label="الإعدادات" />
        </div>
      </header>

      <main className="game-main">
        <section className="game-map-panel">
          <div className="game-map-placeholder">
            <Gauge size={30} />
            <h1>{game.world.name}</h1>
            <p>{simulationNote}</p>
          </div>
        </section>
        <aside className="game-state-panel glass">
          <span className="eyebrow">ملخص البداية</span>
          <h2>{game.country.nameAr}</h2>
          <dl className="game-stat-list">
            <div><dt>السكان</dt><dd>{formatPopulation(game.conditions.population)}</dd></div>
            <div><dt>الخزينة</dt><dd>{game.conditions.treasury.toLocaleString('ar')} مليار</dd></div>
            <div><dt>الدين</dt><dd>{game.conditions.debtPct}%</dd></div>
            <div><dt>الاستقرار</dt><dd>{game.conditions.stability}/100</dd></div>
            <div><dt>العلاقات</dt><dd>{game.conditions.relations}/100</dd></div>
          </dl>
        </aside>
      </main>

      <footer className="game-footer">
        <span><Clock3 size={13} /> الوقت يعمل فقط كساعة؛ الأنظمة الاقتصادية والسياسية لم تُفعّل بعد.</span>
        <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} onClick={onExit}>الخروج إلى القائمة</Button>
      </footer>

      <Modal open={saveOpen} title="حفظ اللعبة" onClose={() => setSaveOpen(false)}>
        <p>{saved ? 'تم الحفظ بنجاح في الجهاز.' : 'سيتم تحديث الحفظ المحلي الحالي أو إنشاء نسخة جديدة.'}</p>
        <div className="modal-actions">
          <Button variant="glass" onClick={() => setSaveOpen(false)}>إلغاء</Button>
          <Button variant="primary" icon={<Save size={14} />} onClick={save}>حفظ الآن</Button>
        </div>
      </Modal>
    </div>
  )
}
