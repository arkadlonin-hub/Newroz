import type { Conditions, Scenario } from '../game/types'

export const SCENARIOS: Scenario[] = [
  {
    id: 'egypt-1952',
    title: 'القاهرة ١٩٥٢',
    subtitle: 'ولادة جمهورية',
    description:
      'بعد حركة يوليو، تقف مصر أمام مفترق تاريخي: بناء مؤسسات جديدة، وإصلاح زراعي، وتحديد موقعها في عالم ما بعد الحرب.',
    era: 'historical',
    year: 1952,
    countryCode: 'EG',
    tag: 'تاريخي',
    accent: '#c8a46c',
    difficulty: 'realistic',
    conditions: {
      population: 21_500_000,
      treasury: 3.2,
      debtPct: 18,
      economy: 34,
      infrastructure: 38,
      education: 30,
      healthcare: 28,
      energy: 32,
      agriculture: 58,
      industry: 22,
      resources: 30,
      stability: 48,
      relations: 44,
    },
    presets: {
      identity: 'arab',
      government: 'presidential',
      guidance: ['سكان وسنة السيناريو مثبّتون', 'شروط بداية تاريخية تقديرية', 'يمكن تعديل كل قيمة في الإعداد المتقدم'],
    },
  },
  {
    id: 'turkey-1923',
    title: 'أنقرة ١٩٢٣',
    subtitle: 'الجمهورية الفتية',
    description:
      'جمهورية حديثة تخرج من رماد الإمبراطورية. أمامك تحديات بناء دولة علمانية مركزية، وتعليم واسع، واقتصاد مستقل.',
    era: 'historical',
    year: 1923,
    countryCode: 'TR',
    tag: 'تاريخي',
    accent: '#a7b39a',
    difficulty: 'hard',
    conditions: {
      population: 13_000_000,
      treasury: 1.1,
      debtPct: 32,
      economy: 28,
      infrastructure: 24,
      education: 22,
      healthcare: 20,
      energy: 18,
      agriculture: 68,
      industry: 16,
      resources: 24,
      stability: 52,
      relations: 38,
    },
    presets: {
      identity: 'custom',
      government: 'republic',
      guidance: ['دولة مركزية حديثة', 'أولوية التعليم والصناعة', 'شرط بداية أصعب من المتوازن'],
    },
  },
  {
    id: 'japan-1955',
    title: 'طوكيو ١٩٥٥',
    subtitle: 'المعجزة القادمة',
    description:
      'اقتصاد يتعافى بسرعة، وشعب يضحي من أجل المستقبل. السؤال ليس هل ستنمو اليابان، بل من سيدفع ثمن النمو وكيف ستوزع ثماره.',
    era: 'historical',
    year: 1955,
    countryCode: 'JP',
    tag: 'تاريخي',
    accent: '#b78d64',
    difficulty: 'balanced',
    conditions: {
      population: 89_000_000,
      treasury: 9,
      debtPct: 40,
      economy: 48,
      infrastructure: 55,
      education: 66,
      healthcare: 52,
      energy: 45,
      agriculture: 34,
      industry: 52,
      resources: 18,
      stability: 66,
      relations: 40,
    },
    presets: {
      identity: 'asian',
      government: 'parliamentary',
      guidance: ['قاعدة صناعية قوية', 'اعتماد كبير على الاستيراد', 'فرصة لبناء نموذج تنموي'],
    },
  },
  {
    id: 'saudi-1973',
    title: 'الرياض ١٩٧٣',
    subtitle: 'عصر النفط',
    description:
      'عائدات النفط تتضاعف، والمدن تتوسع، والوعود التنموية تتسابق. اختر كيف تحوّل الثروة إلى مؤسسات تدوم بعد النفط.',
    era: 'historical',
    year: 1973,
    countryCode: 'SA',
    tag: 'تاريخي',
    accent: '#d0aa6e',
    difficulty: 'easy',
    conditions: {
      population: 6_500_000,
      treasury: 6,
      debtPct: 8,
      economy: 42,
      infrastructure: 36,
      education: 30,
      healthcare: 28,
      energy: 60,
      agriculture: 20,
      industry: 22,
      resources: 88,
      stability: 62,
      relations: 48,
    },
    presets: {
      identity: 'arab',
      government: 'absolute_monarchy',
      guidance: ['خزينة قوية وموارد استثنائية', 'بنية تحتية ما زالت في طور البناء', 'عليك تنويع الاقتصاد مبكراً'],
    },
  },
  {
    id: 'korea-1961',
    title: 'سيول ١٩٦١',
    subtitle: 'نقطة الانطلاق',
    description:
      'بلد فقير بعد الحرب، لكنه يملك شعباً متعلماً ورغبة جامحة في اللحاق بالعالم. كل قرار تنموي سيترك أثراً لأجيال.',
    era: 'historical',
    year: 1961,
    countryCode: 'KR',
    tag: 'تاريخي',
    accent: '#95aea0',
    difficulty: 'hard',
    conditions: {
      population: 26_000_000,
      treasury: 1.5,
      debtPct: 24,
      economy: 26,
      infrastructure: 28,
      education: 48,
      healthcare: 30,
      energy: 24,
      agriculture: 52,
      industry: 20,
      resources: 12,
      stability: 40,
      relations: 36,
    },
    presets: {
      identity: 'asian',
      government: 'military',
      guidance: ['موارد طبيعية شحيحة', 'رأس مال بشري هو أفضل أصولك', 'الاستقرار السياسي هش'],
    },
  },
  {
    id: 'world-2026',
    title: 'العالم ٢٠٢٦',
    subtitle: 'لوحة بيضاء',
    description:
      'ابدأ من عالم اليوم: اقتصادات مترابطة، تحول رقمي، وضغوط مناخية. اختر أي دولة وواجه واقعها كما هو، أو أعد تشكيله.',
    era: 'modern',
    year: 2026,
    countryCode: null,
    tag: 'حديث',
    accent: '#a3b6a5',
    difficulty: 'balanced',
    presets: {
      guidance: ['بيانات السكان والاقتصاد من مؤشرات دولية حديثة', 'كل المؤشرات قابلة للتعديل', 'لا أحداث عالمية مفروضة في هذه المرحلة'],
    },
  },
  {
    id: 'gulf-2026',
    title: 'الخليج ٢٠٢٦',
    subtitle: 'ما بعد النفط',
    description:
      'ثروة كبيرة وبنية تحتية متقدمة، لكن السؤال هو التنويع: صناديق سيادية، مدن جديدة، واقتصاد لا يعتمد على مورد واحد.',
    era: 'modern',
    year: 2026,
    countryCode: 'SA',
    tag: 'حديث',
    accent: '#d3b078',
    difficulty: 'easy',
    conditions: {
      resources: 78,
      infrastructure: 84,
      economy: 74,
      education: 72,
      healthcare: 74,
      stability: 70,
      relations: 66,
    },
    presets: {
      identity: 'arab',
      government: 'absolute_monarchy',
      guidance: ['مؤشرات تنمية مرتفعة', 'موارد طبيعية وفيرة', 'تحدٍ أساسي: تنويع الاقتصاد'],
    },
  },
  {
    id: 'singapore-2026',
    title: 'سنغافورة ٢٠٢٦',
    subtitle: 'دولة المدينة',
    description:
      'مساحة صغيرة، موارد شبه معدومة، ومؤسسات من الطراز الأول. قوتك في التعليم والتجارة والانضباط، لا في الأرض.',
    era: 'modern',
    year: 2026,
    countryCode: 'SG',
    tag: 'حديث',
    accent: '#a0b8ad',
    difficulty: 'hard',
    conditions: {
      resources: 8,
      infrastructure: 96,
      economy: 92,
      education: 94,
      healthcare: 88,
      stability: 86,
      relations: 84,
      agriculture: 6,
      industry: 72,
    },
    presets: {
      identity: 'plural',
      government: 'parliamentary',
      guidance: ['اقتصاد متقدم جداً', 'موارد طبيعية شبه معدومة', 'اعتماد كامل على التجارة والكفاءة'],
    },
  },
  {
    id: 'brazil-2026',
    title: 'برازيل ٢٠٢٦',
    subtitle: 'قوة الجنوب',
    description:
      'قارة داخل دولة: زراعة قوية، موارد هائلة، ومجتمع متنوع. التحدي هو تحويل الحجم إلى ازدهار عادل ومؤسسات مستقرة.',
    era: 'modern',
    year: 2026,
    countryCode: 'BR',
    tag: 'حديث',
    accent: '#b6a878',
    difficulty: 'realistic',
    conditions: {
      resources: 82,
      agriculture: 88,
      industry: 52,
      infrastructure: 54,
      economy: 58,
      education: 58,
      healthcare: 56,
      stability: 54,
      relations: 62,
    },
    presets: {
      identity: 'plural',
      government: 'federal',
      guidance: ['موارد وزراعة استثنائية', 'تفاوت إقليمي كبير', 'مؤسسات تحتاج إلى ترسيخ'],
    },
  },
]

export const SCENARIO_BY_ID = Object.fromEntries(
  SCENARIOS.map((s) => [s.id, s]),
) as Record<string, Scenario>

export function fullScenarioConditions(scenario: Scenario): Conditions | null {
  if (!scenario.conditions) return null
  const c = scenario.conditions
  if (
    c.population == null ||
    c.treasury == null ||
    c.debtPct == null ||
    c.economy == null ||
    c.infrastructure == null ||
    c.education == null ||
    c.healthcare == null ||
    c.energy == null ||
    c.agriculture == null ||
    c.industry == null ||
    c.resources == null ||
    c.stability == null ||
    c.relations == null
  ) {
    return null
  }
  return c as Conditions
}
