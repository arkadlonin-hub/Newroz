import { useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FolderOpen,
  Globe2,
  Landmark,
  Pencil,
  Play,
  Plus,
  Trash2,
} from 'lucide-react'
import { Brand } from '../components/Logo'
import { FlagArt } from '../components/Flag'
import { Button, Modal, TextField } from '../components/ui/Controls'
import { useToast } from '../components/ui/Toast'
import { useGame } from '../game/GameProvider'
import { formatDuration, formatGameDate, formatRelative } from '../lib/format'
import type { SaveMeta } from '../game/types'

function SaveFlag({ meta }: { meta: SaveMeta }) {
  if (meta.cca2 && meta.flag.preset === 'official') {
    return (
      <span className="flag">
        <img src={`/flags/${meta.cca2.toLowerCase()}.svg`} alt="" />
      </span>
    )
  }
  return (
    <span className="flag">
      <FlagArt design={meta.flag} />
    </span>
  )
}

interface SavesScreenProps {
  onBack: () => void
  onLoad: (id: string) => void
  onNewGame: () => void
  storageAvailable: boolean
  storageWarning?: string
}

export function SavesScreen({
  onBack,
  onLoad,
  onNewGame,
  storageAvailable,
  storageWarning,
}: SavesScreenProps) {
  const { saves, removeSave, renameSave, game } = useGame()
  const { toast } = useToast()
  const [deleteTarget, setDeleteTarget] = useState<SaveMeta | null>(null)
  const [renameTarget, setRenameTarget] = useState<SaveMeta | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const confirmDelete = () => {
    if (!deleteTarget) return
    removeSave(deleteTarget.id)
    toast(`حُذفت الحفظة «${deleteTarget.name}»`, 'success')
    setDeleteTarget(null)
  }

  const openRename = (meta: SaveMeta) => {
    setRenameTarget(meta)
    setRenameValue(meta.name)
  }

  const confirmRename = () => {
    if (!renameTarget) return
    renameSave(renameTarget.id, renameValue)
    toast('تم تحديث اسم الحفظة', 'success')
    setRenameTarget(null)
  }

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
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={onNewGame}>
          لعبة جديدة
        </Button>
      </header>

      <div className="screen__inner">
        <div className="screen-title-block">
          <span className="eyebrow">الحفظ والاستمرارية</span>
          <h1>حفظاتك</h1>
          <p>
            كل حفظة تحتفظ بهوية الدولة، ونظام الحكم، وشروط البداية، وتاريخ المحاكاة، وإعدادات
            العالم. يمكنك الاحتفاظ بما يصل إلى 24 حفظة على هذا المتصفح.
          </p>
        </div>

        {!storageAvailable && (
          <div className="storage-warning" style={{ marginBottom: '1rem' }}>
            {storageWarning ?? 'التخزين المحلي غير متاح. قد لا تبقى الحفظات بعد إغلاق المتصفح.'}
          </div>
        )}

        {saves.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <FolderOpen size={26} />
            </div>
            <h3>لا توجد حفظات بعد</h3>
            <p>
              ابدأ لعبة جديدة واختر عالمك ودولتك. يستطيع النظام حفظ تلقائي أثناء اللعب، ويمكنك
              أيضاً الحفظ اليدوي في أي وقت من شريط المحاكاة.
            </p>
            <Button variant="primary" icon={<Plus size={16} />} onClick={onNewGame}>
              ابدأ لعبة جديدة
            </Button>
          </div>
        ) : (
          <div className="saves-list">
            {saves.map((save) => {
              const { meta } = save
              const isCurrent = game?.slotId === meta.id
              return (
                <article className="save-card" key={meta.id}>
                  <SaveFlag meta={meta} />
                  <div className="save-card__main">
                    <div className="save-card__name">
                      {meta.name}
                      {isCurrent && <span className="chip chip--sage">الجارية</span>}
                    </div>
                    <div className="save-card__meta">
                      <span>
                        <Globe2 size={11} /> {meta.worldName}
                      </span>
                      <span>
                        <Landmark size={11} /> {meta.governmentName}
                      </span>
                      <span>
                        <CalendarDays size={11} />
                        <span className="numeric">
                          {formatGameDate({ year: meta.year, month: meta.month, day: meta.day })}
                        </span>
                      </span>
                      <span>
                        <Clock3 size={11} /> {formatDuration(meta.playSeconds)}
                      </span>
                      <span>حُفظت {formatRelative(meta.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="save-card__actions">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Play size={14} />}
                      onClick={() => onLoad(meta.id)}
                    >
                      تحميل
                    </Button>
                    <Button
                      variant="glass"
                      size="sm"
                      icon={<Pencil size={13} />}
                      onClick={() => openRename(meta)}
                      aria-label={`إعادة تسمية ${meta.name}`}
                    >
                      تسمية
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} />}
                      onClick={() => setDeleteTarget(meta)}
                      aria-label={`حذف ${meta.name}`}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <p className="tiny faint" style={{ marginTop: '1.3rem', lineHeight: 1.8 }}>
          الحفظات محلية بالكامل في هذا المتصفح. مسح بيانات المتصفح أو استخدام وضع التصفح الخاص قد
          يؤدي إلى فقدانها. لا يوجد حساب سحابي في هذه المرحلة.
        </p>
      </div>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="حذف الحفظة؟"
        subtitle="لا يمكن التراجع عن هذا الإجراء."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              إلغاء
            </Button>
            <Button variant="danger" icon={<Trash2 size={15} />} onClick={confirmDelete}>
              حذف
            </Button>
          </>
        }
      >
        {deleteTarget && (
          <p className="small muted" style={{ lineHeight: 1.8 }}>
            ستُحذف الحفظة <strong style={{ color: 'var(--ivory)' }}>{deleteTarget.name}</strong> —
            {` ${deleteTarget.countryName}`}. تبقى الحفظات الأخرى كما هي.
          </p>
        )}
      </Modal>

      <Modal
        open={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        title="إعادة تسمية الحفظة"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={confirmRename}>
              حفظ الاسم
            </Button>
          </>
        }
      >
        <TextField
          label="اسم الحفظة"
          value={renameValue}
          onChange={setRenameValue}
          placeholder="مثال: السعودية — البداية"
          maxLength={48}
        />
      </Modal>
    </div>
  )
}
