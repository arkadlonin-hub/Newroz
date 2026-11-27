import { useState } from 'react'
import { Database, HardDrive, Info, Languages, ShieldCheck, Trash2, TriangleAlert } from 'lucide-react'
import { useGame } from '../../game/GameProvider'
import { storageAvailableFlag } from '../../game/storage'
import { Button, Modal, Segmented, Toggle } from '../../components/ui/Controls'
import { useToast } from '../../components/ui/Toast'

export function SettingsPanel({ onOpenSaves }: { onOpenSaves?: () => void }) {
  const { settings, updateSettings, saves } = useGame()
  const { toast } = useToast()
  const [confirmClear, setConfirmClear] = useState(false)

  const clearEverything = () => {
    try {
      localStorage.removeItem('newroz.saves.v1')
      localStorage.removeItem('newroz.active.v1')
      localStorage.removeItem('newroz.settings.v1')
      toast('تم حذف بيانات اللعبة المحلية', 'success')
      window.setTimeout(() => window.location.reload(), 400)
    } catch {
      toast('تعذّر حذف البيانات من هذا المتصفح', 'error')
    }
  }

  return (
    <div className="settings-layout">
      <section className="settings-group glass">
        <h2>المظهر والراحة</h2>
        <p className="settings-group__hint">
          واجهة عربية كاملة من اليمين إلى اليسار. هذه الإعدادات تُحفظ تلقائياً في هذا المتصفح.
        </p>
        <div className="settings-row">
          <div>
            <div className="settings-row__label">حجم النص</div>
            <div className="settings-row__desc">مناسب للقراءة الطويلة على الهاتف والشاشة الكبيرة.</div>
          </div>
          <Segmented
            label="حجم النص"
            value={settings.textScale}
            onChange={(v) => updateSettings({ textScale: v })}
            options={[
              { value: 'normal', label: 'عادي' },
              { value: 'large', label: 'كبير' },
              { value: 'xlarge', label: 'أكبر' },
            ]}
          />
        </div>
        <div className="settings-row">
          <Toggle
            label="تقليل الحركة"
            description="يلغي الدوران التلقائي والانتقالات المتحركة، ويحافظ على الوضوح."
            checked={settings.reducedMotion}
            onChange={(v) => updateSettings({ reducedMotion: v })}
          />
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row__label">اللغة</div>
            <div className="settings-row__desc">العربية هي لغة الواجهة في هذه المرحلة.</div>
          </div>
          <span className="chip chip--bronze">
            <Languages size={12} /> العربية · RTL
          </span>
        </div>
      </section>

      <section className="settings-group glass">
        <h2>الحفظ والاستمرارية</h2>
        <p className="settings-group__hint">
          تُحفظ اللعبة محلياً داخل هذا المتصفح. لا يتم إرسال أي بيانات إلى خادم.
        </p>
        <div className="settings-row">
          <Toggle
            label="الحفظ التلقائي"
            description="حفظ دوري كل دقيقة أثناء تشغيل المحاكاة، بالإضافة إلى الحفظ عند الخروج."
            checked={settings.autosave}
            onChange={(v) => updateSettings({ autosave: v })}
          />
        </div>
        <div className="settings-row">
          <div>
            <div className="settings-row__label">الحفظات المحفوظة</div>
            <div className="settings-row__desc">{saves.length} من أصل 24 حفظة ممكنة.</div>
          </div>
          {onOpenSaves && (
            <Button size="sm" variant="outline" onClick={onOpenSaves}>
              إدارة الحفظات
            </Button>
          )}
        </div>
        {!storageAvailableFlag && (
          <div className="storage-warning">
            <TriangleAlert size={16} />
            <span>
              التخزين المحلي غير متاح في هذا المتصفح أو الوضع الحالي. يمكنك اللعب، لكن الحفظ قد لا
              يبقى بعد الإغلاق.
            </span>
          </div>
        )}
      </section>

      <section className="settings-group glass">
        <h2>حالة المحاكاة</h2>
        <p className="settings-group__hint">
          هذه المرحلة تبني الأساس. الزمن يتقدم فعلياً، أما الأنظمة الاقتصادية والديموغرافية
          والسياسية الكاملة فتُضاف في المراحل القادمة.
        </p>
        <div className="data-source">
          <strong>الزمن</strong>
          <span>يعمل الآن: تقدّم التقويم، السرعات الثلاث، والإيقاف المؤقت.</span>
        </div>
        <div className="data-source">
          <strong>الاقتصاد</strong>
          <span>قيد التطوير — يعرض حالياً شروط البداية التي أدخلتها، دون محاكاة حية.</span>
        </div>
        <div className="data-source">
          <strong>السياسة والأحداث</strong>
          <span>قيد التطوير — لا تُنشأ أحداث عالم أو قرارات سياسية في هذه المرحلة.</span>
        </div>
      </section>

      <section className="settings-group glass">
        <h2>حول اللعبة والبيانات</h2>
        <p className="settings-group__hint">نيـروز — المرحلة الأولى: أساس عالم حي.</p>
        <div className="data-source">
          <strong>الإصدار</strong>
          <span>0.1.0 · Foundation Build</span>
        </div>
        <div className="data-source">
          <strong>الحدود والجغرافيا</strong>
          <span>Natural Earth عبر world-atlas — خريطة العالم الحقيقية، بدقة 110m.</span>
        </div>
        <div className="data-source">
          <strong>السكان والدخل</strong>
          <span>مؤشرات البنك الدولي (2025) وبيانات world-countries، مع تصريح بالمصدر داخل اللعبة.</span>
        </div>
        <div className="data-source">
          <strong>العواصم</strong>
          <span>أسماء عربية مستمدة من Wikidata، مع العلم الرسمي لكل دولة من flag-icons.</span>
        </div>
        <div className="data-source">
          <strong>الشعارات</strong>
          <span>الشعار الوطني عنصر تصميم داخل اللعبة، وليس شعاراً رسمياً للدول الحقيقية.</span>
        </div>
        <div className="data-source">
          <strong>الخصوصية</strong>
          <span>كل البيانات محلية. لا حسابات ولا تتبع ولا خوادم.</span>
        </div>
      </section>

      <section className="settings-group glass danger-zone">
        <h2>منطقة الخطر</h2>
        <p className="settings-group__hint">
          حذف جميع الحفظات والإعدادات من هذا المتصفح. لا يمكن التراجع.
        </p>
        <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setConfirmClear(true)}>
          حذف جميع البيانات
        </Button>
      </section>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="حذف جميع البيانات؟"
        subtitle="ستُحذف كل الحفظات والإعدادات نهائياً من هذا المتصفح."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              إلغاء
            </Button>
            <Button variant="danger" icon={<Trash2 size={15} />} onClick={clearEverything}>
              حذف نهائي
            </Button>
          </>
        }
      >
        <div className="storage-warning" style={{ marginTop: 0 }}>
          <TriangleAlert size={16} />
          <span>
            لا يمكن استعادة البيانات المحذوفة. تأكد من رغبتك في البدء من جديد قبل المتابعة.
          </span>
        </div>
      </Modal>
    </div>
  )
}

export function SettingsFooterNote() {
  return (
    <div className="settings-group__hint" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
      <ShieldCheck size={13} /> محلي بالكامل
      <span>·</span>
      <HardDrive size={13} /> {storageAvailableFlag ? 'التخزين متاح' : 'التخزين غير متاح'}
      <span>·</span>
      <Database size={13} /> نسخة 0.1
      <span>·</span>
      <Info size={13} /> المرحلة الأولى
    </div>
  )
}
