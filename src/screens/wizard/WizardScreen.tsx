import { useEffect, useState } from 'react'
import { Brand } from '../../components/Logo'
import { useGame } from '../../game/GameProvider'
import { applyScenario } from '../../game/draft'
import { buildGameState, newDraft, validateStep } from '../../game/setup'
import type { WizardDraft } from '../../game/setup'
import type { WorldKind } from '../../game/types'
import { Button } from '../../components/ui/Controls'
import { StepHead, WizardFooter, WizardProgress } from './parts'
import { WorldStep } from './steps/WorldStep'
import { CountryStep } from './steps/CountryStep'
import { IdentityStep } from './steps/IdentityStep'
import { GovernmentStep } from './steps/GovernmentStep'
import { ConditionsStep } from './steps/ConditionsStep'

export function WizardScreen({
  seed,
  scenarioId,
  onExit,
  onStarted,
}: {
  seed?: WorldKind | null
  scenarioId?: string | null
  onExit: () => void
  onStarted: () => void
}) {
  const { createGame } = useGame()
  const [draft, setDraft] = useState<WizardDraft>(() => {
    let next = newDraft(seed ? undefined : undefined)
    if (seed) {
      const { defaultWorld } = requireWorlds()
      next = newDraft(defaultWorld(seed))
    }
    if (scenarioId) next = applyScenario(next, scenarioId)
    return next
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => setError(null), [draft.step])

  const next = () => {
    const result = validateStep(draft.step, draft)
    if (!result.ok) {
      setError(result.message ?? 'أكمل البيانات المطلوبة.')
      return
    }
    if (draft.step < 5) {
      setDraft((current) => ({ ...current, step: (current.step + 1) as 2 | 3 | 4 | 5 }))
      return
    }
    createGame(buildGameState(draft))
    onStarted()
  }

  const back = () => {
    if (draft.step > 1) {
      setDraft((current) => ({ ...current, step: (current.step - 1) as 1 | 2 | 3 | 4 }))
    } else onExit()
  }

  return (
    <div className="wizard-screen">
      <header className="wizard-top">
        <Brand compact />
        <div className="wizard-top__actions">
          <Button variant="glass" size="sm" onClick={onExit}>إلغاء</Button>
        </div>
      </header>
      <WizardProgress step={draft.step} />
      <main className="wizard-main">
        <StepHead step={draft.step} />
        {draft.step === 1 && <WorldStep draft={draft} setDraft={setDraft} />}
        {draft.step === 2 && <CountryStep draft={draft} setDraft={setDraft} />}
        {draft.step === 3 && <IdentityStep draft={draft} setDraft={setDraft} />}
        {draft.step === 4 && <GovernmentStep draft={draft} setDraft={setDraft} />}
        {draft.step === 5 && <ConditionsStep draft={draft} setDraft={setDraft} />}
      </main>
      <WizardFooter
        step={draft.step}
        error={error}
        onBack={back}
        onNext={next}
        onExit={onExit}
      />
    </div>
  )
}

function requireWorlds() {
  return {
    defaultWorld: (kind: WorldKind) => {
      const kindDefault = {
        real: 'العالم الحقيقي', fictional: 'عالم جديد', custom: 'عالم جديد', historical: 'عالم تاريخي', modern: 'العالم الحديث',
      }[kind]
      return {
        kind,
        name: kindDefault,
        year: kind === 'historical' ? 1945 : 2026,
        eraLabel: kind === 'historical' ? 'سيناريو تاريخي' : 'الحاضر',
        techLevel: 'high' as const,
        abundance: 'balanced' as const,
        climate: 'varied' as const,
        difficulty: 'balanced' as const,
        scenarioId: null,
        notes: '',
      }
    },
  }
}
