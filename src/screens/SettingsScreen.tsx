import { ArrowRight } from 'lucide-react'
import { Brand } from '../components/Logo'
import { Button } from '../components/ui/Controls'
import { SettingsFooterNote, SettingsPanel } from './settings/SettingsPanel'

export function SettingsScreen({
  onBack,
  onOpenSaves,
}: {
  onBack: () => void
  onOpenSaves: () => void
}) {
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
          <span className="dot" /> إعدادات محلية
        </span>
      </header>

      <div className="screen__inner">
        <div className="screen-title-block">
          <span className="eyebrow">الإعدادات</span>
          <h1>اجعل اللعبة مريحة لك</h1>
          <p>
            تحكم في حجم النص والحركة والحفظ التلقائي. تذكّر أن واجهة اللعبة عربية بالكامل، وأن
            جميع بياناتك تبقى داخل متصفحك.
          </p>
        </div>

        <SettingsPanel onOpenSaves={onOpenSaves} />
        <div style={{ marginTop: '1rem' }}>
          <SettingsFooterNote />
        </div>
      </div>
    </div>
  )
}
