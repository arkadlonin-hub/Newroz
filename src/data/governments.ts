import type { GovernmentConfig, GovernmentId } from '../game/types'

export interface GovernmentDefinition {
  id: GovernmentId
  nameAr: string
  nameEn: string
  tagline: string
  description: string
  icon: string
  accent: string
  difficulty: 1 | 2 | 3 | 4
  headOfState: string
  legislature: string
  executive: string
  legitimacy: string
  stabilityBias: number
  traits: string[]
  future: string
}

export const GOVERNMENTS: GovernmentDefinition[] = [
  {
    id: 'republic',
    nameAr: 'جمهورية',
    nameEn: 'Republic',
    tagline: 'مؤسسات منتخبة وسيادة للقانون',
    description:
      'نظام تقوم فيه السيادة على إرادة الشعب، وتتوزع السلطات بين رئاسة منتخبة وبرلمان وحكومة مسؤولة. التوازن بين المؤسسات هو مصدر قوتك وأكبر اختبار لك.',
    icon: 'Landmark',
    accent: '#8fae8b',
    difficulty: 2,
    headOfState: 'رئيس الجمهورية',
    legislature: 'برلمان منتخب',
    executive: 'حكومة مسؤولة أمام البرلمان',
    legitimacy: 'صناديق الاقتراع والالتزام الدستوري',
    stabilityBias: 6,
    traits: ['فصل السلطات', 'انتخابات دورية', 'مساءلة عامة'],
    future: 'ستؤثر نتائج الانتخابات، وشعبية الرئيس، وقرارات البرلمان على استقرار حكمك.',
  },
  {
    id: 'presidential',
    nameAr: 'نظام رئاسي',
    nameEn: 'Presidential',
    tagline: 'رئيس قوي ومسؤولية مباشرة',
    description:
      'رئيس منتخب مباشرة يقود السلطة التنفيذية ويوازن برلماناً مستقلاً. القرار أسرع، لكن أي أزمة بين الرئاسة والبرلمان قد تتحول إلى شلل سياسي.',
    icon: 'Vote',
    accent: '#c7a269',
    difficulty: 2,
    headOfState: 'رئيس منتخب مباشرة',
    legislature: 'برلمان مستقل',
    executive: 'الرئيس وحكومته',
    legitimacy: 'تفويض انتخابي شخصي',
    stabilityBias: 3,
    traits: ['قرار تنفيذي سريع', 'فصل صارم للسلطات', 'تركيز شخصي للسلطة'],
    future: 'ستكون العلاقة بين الرئيس والبرلمان محور الأزمات والتشريعات القادمة.',
  },
  {
    id: 'parliamentary',
    nameAr: 'نظام برلماني',
    nameEn: 'Parliamentary',
    tagline: 'الحكومة تولد من البرلمان',
    description:
      'البرلمان هو مركز الثقل: يمنح الثقة للحكومة ويسحبها. الحكومات الائتلافية تصنع توافقاً أوسع، لكنها قد تكون أبطأ وأكثر عرضة للاهتزاز.',
    icon: 'Building2',
    accent: '#9fb6a3',
    difficulty: 2,
    headOfState: 'رئيس دولة رمزي',
    legislature: 'برلمان يمنح الثقة',
    executive: 'رئيس وزراء وحكومة ائتلافية',
    legitimacy: 'الأغلبية البرلمانية',
    stabilityBias: 4,
    traits: ['حكومات ائتلافية', 'ثقة برلمانية', 'مرونة سياسية'],
    future: 'ستُدار الحكومات عبر الائتلافات والتصويت على الثقة في المراحل القادمة.',
  },
  {
    id: 'constitutional_monarchy',
    nameAr: 'ملكية دستورية',
    nameEn: 'Constitutional Monarchy',
    tagline: 'تاج رمزي ودستور يحكم',
    description:
      'الملك رأس الدولة ورمز الوحدة، بينما تمارس الحكومة المنتخبة السلطة الفعلية تحت دستور مكتوب. الاستقرار مرتفع، لكن الشرعية تعتمد على الحياد الملكي.',
    icon: 'Crown',
    accent: '#caa66d',
    difficulty: 1,
    headOfState: 'ملك دستوري',
    legislature: 'برلمان منتخب',
    executive: 'حكومة برئاسة رئيس الوزراء',
    legitimacy: 'الدستور والتقاليد والانتخابات',
    stabilityBias: 9,
    traits: ['تاج رمزي', 'حكومة منتخبة', 'استمرارية مؤسسية'],
    future: 'ستختبر قدرتك على حفظ حياد التاج أمام صعود الأحزاب وتغير الحكومات.',
  },
  {
    id: 'absolute_monarchy',
    nameAr: 'ملكية مطلقة',
    nameEn: 'Absolute Monarchy',
    tagline: 'قرار الملك هو القرار',
    description:
      'الملك يجمع السلطات التشريعية والتنفيذية، وتعمل الحكومة بتفويض منه. القرار سريع والاستقرار يعتمد على شرعية التاج وكفاءة البلاط.',
    icon: 'Crown',
    accent: '#b78d56',
    difficulty: 3,
    headOfState: 'ملك',
    legislature: 'مجلس استشاري أو معيّن',
    executive: 'الملك وحكومته',
    legitimacy: 'التقاليد والولاء والنتائج',
    stabilityBias: 5,
    traits: ['سلطة مركزية', 'قرار سريع', 'مؤسسات استشارية'],
    future: 'ستكون خلافة العرش، واستشارات البلاط، وضغط الإصلاح من أبرز محاور الحكم.',
  },
  {
    id: 'federal',
    nameAr: 'فيدرالية',
    nameEn: 'Federal',
    tagline: 'مركز وأقاليم في توازن دقيق',
    description:
      'السلطة موزعة دستورياً بين حكومة اتحادية وأقاليم ذات صلاحيات واسعة. التنوع يصبح مصدر قوة، لكن التنسيق بين المستويات يحتاج جهداً دائماً.',
    icon: 'Network',
    accent: '#93ad9b',
    difficulty: 3,
    headOfState: 'رئيس اتحادي أو ملك اتحادي',
    legislature: 'مجلسان: اتحادي وأقاليمي',
    executive: 'حكومة اتحادية وحكومات أقاليم',
    legitimacy: 'عقد دستوري متعدد المستويات',
    stabilityBias: 2,
    traits: ['توزيع الصلاحيات', 'تمثيل الأقاليم', 'تنوع إداري'],
    future: 'ستدير علاقات المركز بالأقاليم، وميزانياتها، ومطالبها المحلية.',
  },
  {
    id: 'military',
    nameAr: 'حكم عسكري',
    nameEn: 'Military Government',
    tagline: 'المؤسسة العسكرية في قلب القرار',
    description:
      'يتولى المجلس العسكري أو القيادة العسكرية السلطة، غالباً بعد أزمة أو انقلاب. الأمن قد يتقدم على الحريات، والشرعية الدولية تكون هشة.',
    icon: 'Shield',
    accent: '#a99b7f',
    difficulty: 4,
    headOfState: 'مجلس أو قائد عسكري',
    legislature: 'معلّق أو معيّن',
    executive: 'قيادة عسكرية',
    legitimacy: 'الأمن والانضباط والنتائج',
    stabilityBias: -2,
    traits: ['أولوية أمنية', 'قيود على المعارضة', 'حساسية دولية'],
    future: 'ستتعامل مع ضغط الانتقال المدني، وحرية الصحافة، والعقوبات الدولية المحتملة.',
  },
  {
    id: 'dictatorship',
    nameAr: 'ديكتاتورية',
    nameEn: 'Dictatorship',
    tagline: 'سلطة فردية بلا موازنات',
    description:
      'تتمركز السلطة في يد فرد أو دائرة ضيقة، مع رقابة محدودة على القرار. السرعة عالية، لكن المعلومات الصادقة والشرعية على المدى الطويل تصبحان نادرتين.',
    icon: 'ShieldAlert',
    accent: '#b07a62',
    difficulty: 4,
    headOfState: 'حاكم فردي',
    legislature: 'شكلي أو معيّن',
    executive: 'دائرة الحاكم',
    legitimacy: 'القوة والأداء والولاء',
    stabilityBias: -4,
    traits: ['مركزية شديدة', 'رقابة محدودة', 'اعتماد على الولاء'],
    future: 'ستواجه مخاطر الانشقاق الداخلي، وتداول السلطة، وضغط الرأي العام.',
  },
  {
    id: 'one_party',
    nameAr: 'نظام حزب واحد',
    nameEn: 'One-Party State',
    tagline: 'الحزب الحاكم يصوغ الدولة',
    description:
      'يحتكر حزب واحد السلطة السياسية ويمتد نفوذه إلى المؤسسات والاقتصاد. التعبئة والتنظيم قويان، لكن التجديد الداخلي وقبول التعددية تحدٍ دائم.',
    icon: 'Flag',
    accent: '#b38d63',
    difficulty: 4,
    headOfState: 'أمين الحزب أو رئيس الدولة',
    legislature: 'مجلس يهيمن عليه الحزب',
    executive: 'قيادة الحزب والدولة',
    legitimacy: 'الأيديولوجيا والتنظيم والنتائج',
    stabilityBias: 0,
    traits: ['هيمنة حزبية', 'تعبئة جماهيرية', 'تضييق على التعددية'],
    future: 'ستدير صراعات الأجنحة داخل الحزب وضغوط الإصلاح والتعددية.',
  },
  {
    id: 'technocratic',
    nameAr: 'حكومة تكنوقراطية',
    nameEn: 'Technocracy',
    tagline: 'الخبرة قبل الأيديولوجيا',
    description:
      'تتولى نخبة من الخبراء إدارة الدولة وفق معايير فنية وكفاءة. الإنجاز التنموي قد يكون سريعاً، لكن الشراكة السياسية والتمثيل الشعبي قد يضعفان.',
    icon: 'Atom',
    accent: '#8fb4ac',
    difficulty: 2,
    headOfState: 'مجلس خبراء أو رئيس تقني',
    legislature: 'مجلس مهني أو استشاري',
    executive: 'حكومة خبراء',
    legitimacy: 'الكفاءة والنتائج والمؤشرات',
    stabilityBias: 5,
    traits: ['قيادة بالبيانات', 'أولويات تنموية', 'شرعية أدائية'],
    future: 'ستوازن بين كفاءة القرار والمطالب الشعبية بالمشاركة السياسية.',
  },
  {
    id: 'custom',
    nameAr: 'نظام مخصص',
    nameEn: 'Custom System',
    tagline: 'ابنِ توازنك السياسي بنفسك',
    description:
      'صمّم نظاماً لا يشبه القوالب الجاهزة: حدّد مركزية القرار، وشفافية الحكم، ووزن المؤسسة العسكرية. ستُبنى عليه قواعد السياسة في المراحل القادمة.',
    icon: 'SlidersHorizontal',
    accent: '#c2a06e',
    difficulty: 3,
    headOfState: 'حسب تصميمك',
    legislature: 'حسب تصميمك',
    executive: 'حسب تصميمك',
    legitimacy: 'حسب تصميمك',
    stabilityBias: 0,
    traits: ['تصميم حر', 'توازن قابل للضبط', 'قواعد مفتوحة'],
    future: 'ستُشتق أدوات السياسة والأزمات من القيم التي تختارها هنا.',
  },
]

export const GOVERNMENT_BY_ID = Object.fromEntries(
  GOVERNMENTS.map((g) => [g.id, g]),
) as Record<GovernmentId, GovernmentDefinition>

export function defaultGovernment(): GovernmentConfig {
  return {
    id: 'republic',
    customName: '',
    customDescription: '',
    centralization: 55,
    transparency: 60,
    militaryInfluence: 25,
  }
}

export function governmentDisplayName(config: GovernmentConfig): string {
  if (config.id === 'custom') {
    return config.customName.trim() || 'نظام مخصص'
  }
  return GOVERNMENT_BY_ID[config.id]?.nameAr ?? 'نظام حكومي'
}

export function governmentDifficultyLabel(d: 1 | 2 | 3 | 4): string {
  return ['متوازن', 'متوسط', 'صعب', 'شديد'][d - 1]
}

const POWER_PRESETS: Record<GovernmentId, [number, number, number]> = {
  republic: [56, 66, 30],
  presidential: [72, 58, 34],
  parliamentary: [46, 74, 24],
  constitutional_monarchy: [44, 72, 22],
  absolute_monarchy: [88, 22, 48],
  federal: [38, 70, 26],
  military: [88, 24, 90],
  dictatorship: [95, 12, 62],
  one_party: [86, 20, 44],
  technocratic: [64, 46, 20],
  custom: [55, 60, 25],
}

export function powerProfile(config: GovernmentConfig): {
  centralization: number
  transparency: number
  militaryInfluence: number
} {
  if (config.id === 'custom') {
    return {
      centralization: config.centralization,
      transparency: config.transparency,
      militaryInfluence: config.militaryInfluence,
    }
  }
  const [centralization, transparency, militaryInfluence] = POWER_PRESETS[config.id]
  return { centralization, transparency, militaryInfluence }
}

