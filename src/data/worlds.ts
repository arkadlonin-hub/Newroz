import type { Difficulty, WorldConfig, WorldKind } from '../game/types'

export interface WorldKindDefinition {
  id: WorldKind
  title: string
  subtitle: string
  description: string
  icon: string
  accent: string
}

export const WORLD_KINDS: WorldKindDefinition[] = [
  {
    id: 'real',
    title: 'العالم الحقيقي',
    subtitle: 'جغرافيا وسكان واقتصادات اليوم',
    description:
      'اختر أي دولة في العالم، وابدأ من بياناتها الجغرافية والسكانية الفعلية. العالم كما هو، والقرار لك.',
    icon: 'Globe2',
    accent: '#9db8a4',
  },
  {
    id: 'fictional',
    title: 'عالم خيالي',
    subtitle: 'أرض لم توجد بعد',
    description:
      'ابنِ دولة على خريطة العالم الحقيقية، في موقع جغرافي تختاره، لكن بهوية ونظام وحكاية من ابتكارك.',
    icon: 'Sparkles',
    accent: '#c9a76e',
  },
  {
    id: 'custom',
    title: 'عالم مخصص',
    subtitle: 'قواعد وسنة وتقنية بيدك',
    description:
      'حدّد اسم العالم وسنته ومستواه التقني ووفرة موارده ومناخه. إعدادات أساس تُحفظ لمراحل المحاكاة القادمة.',
    icon: 'Compass',
    accent: '#b0a182',
  },
  {
    id: 'historical',
    title: 'سيناريو تاريخي',
    subtitle: 'لحظة فارقة من الماضي',
    description:
      'اختر بذرة سيناريو تاريخية جاهزة: سنة مختلفة، شروط بداية مختلفة، ودولة حقيقية تعيش لحظة تحول.',
    icon: 'Hourglass',
    accent: '#c0a074',
  },
  {
    id: 'modern',
    title: 'سيناريو حديث',
    subtitle: 'عالم اليوم ببذور مختلفة',
    description:
      'ابدأ من الحاضر مع بذور تحديات محددة: اقتصاد ما بعد النفط، دولة مدينة، أو قوة ناشئة.',
    icon: 'RadioTower',
    accent: '#9fb6ad',
  },
]

export const WORLD_KIND_BY_ID = Object.fromEntries(
  WORLD_KINDS.map((w) => [w.id, w]),
) as Record<WorldKind, WorldKindDefinition>

export const DIFFICULTIES: {
  id: Difficulty
  label: string
  description: string
  tone: string
}[] = [
  { id: 'easy', label: 'سهل', description: 'خزينة أوسع واستقرار أعلى وهامش خطأ أكبر.', tone: '#9fbd9b' },
  { id: 'balanced', label: 'متوازن', description: 'بداية عادلة بمؤشرات أساسية متوازنة.', tone: '#c8ab79' },
  { id: 'realistic', label: 'واقعي', description: 'موارد محدودة وضغوط أقرب إلى الواقع.', tone: '#bfa07b' },
  { id: 'hard', label: 'صعب', description: 'دين أعلى ومؤشرات أضعف وهامش خطأ ضيق.', tone: '#b47e69' },
]

export const DIFFICULTY_BY_ID = Object.fromEntries(
  DIFFICULTIES.map((d) => [d.id, d]),
) as Record<Difficulty, (typeof DIFFICULTIES)[number]>

export const TECH_LEVELS = [
  { id: 'low', label: 'منخفض', description: 'صناعة يدوية وبنية محدودة' },
  { id: 'medium', label: 'متوسط', description: 'تصنيع تقليدي وخدمات أساسية' },
  { id: 'high', label: 'متقدم', description: 'اقتصاد معرفي وبنية حديثة' },
  { id: 'advanced', label: 'متقدم جداً', description: 'تقنيات ناشئة وأتمتة واسعة' },
] as const

export const ABUNDANCE_LEVELS = [
  { id: 'scarce', label: 'شحيحة', description: 'موارد محدودة تتطلب تدبيراً حذراً' },
  { id: 'balanced', label: 'متوازنة', description: 'وفرة كافية مع ضغوط طبيعية' },
  { id: 'rich', label: 'وفيرة', description: 'موارد كبيرة وفرص تصدير واسعة' },
] as const

export const CLIMATES = [
  { id: 'temperate', label: 'معتدل' },
  { id: 'arid', label: 'جاف' },
  { id: 'tropical', label: 'استوائي' },
  { id: 'cold', label: 'بارد' },
  { id: 'varied', label: 'متنوع' },
] as const

export function defaultWorld(kind: WorldKind = 'real'): WorldConfig {
  return {
    kind,
    name: kind === 'real' ? 'العالم الحقيقي' : kind === 'modern' ? 'العالم الحديث' : kind === 'historical' ? 'عالم تاريخي' : 'عالم جديد',
    year: 2026,
    eraLabel: kind === 'historical' ? 'سيناريو تاريخي' : 'الحاضر',
    techLevel: 'high',
    abundance: 'balanced',
    climate: 'varied',
    difficulty: 'balanced',
    scenarioId: null,
    notes: '',
  }
}

export const START_YEAR = 2026
