export interface IdentityOption {
  id: string
  label: string
  description: string
  color: string
}

export const IDENTITIES: IdentityOption[] = [
  {
    id: 'arab',
    label: 'هوية عربية',
    description: 'اللغة والثقافة العربية في صميم المشروع الوطني.',
    color: '#c8a46c',
  },
  {
    id: 'islamic',
    label: 'هوية إسلامية',
    description: 'القيم والمؤسسات الإسلامية مرجعية للهوية العامة.',
    color: '#8fae8b',
  },
  {
    id: 'mediterranean',
    label: 'هوية متوسطية',
    description: 'تقاطع حضارات البحر المتوسط ولغاته وتجارته.',
    color: '#9db4a9',
  },
  {
    id: 'african',
    label: 'هوية إفريقية',
    description: 'التنوع الإفريقي والانتماء القاري والموارد الطبيعية.',
    color: '#b98c5e',
  },
  {
    id: 'asian',
    label: 'هوية آسيوية',
    description: 'تراث آسيوي متنوع وتقاليد مؤسسية واقتصادية خاصة.',
    color: '#a6b095',
  },
  {
    id: 'western',
    label: 'هوية غربية',
    description: 'مؤسسات ليبرالية وتراث دستوري وتكامل أوروبي أو أطلسي.',
    color: '#a9b4b0',
  },
  {
    id: 'plural',
    label: 'هوية تعددية',
    description: 'دولة تقوم على التنوع اللغوي والثقافي والاعتراف المتبادل.',
    color: '#c2aa7d',
  },
  {
    id: 'custom',
    label: 'هوية مخصصة',
    description: 'اكتب وصف الهوية التي تريد بناء الدولة حولها.',
    color: '#b9a88d',
  },
]

export const IDENTITY_BY_ID = Object.fromEntries(
  IDENTITIES.map((i) => [i.id, i]),
) as Record<string, IdentityOption>

export const COMMON_LANGUAGES = [
  { code: 'ara', nameAr: 'العربية' },
  { code: 'eng', nameAr: 'الإنجليزية' },
  { code: 'fra', nameAr: 'الفرنسية' },
  { code: 'spa', nameAr: 'الإسبانية' },
  { code: 'tur', nameAr: 'التركية' },
  { code: 'fas', nameAr: 'الفارسية' },
  { code: 'urd', nameAr: 'الأردية' },
  { code: 'zho', nameAr: 'الصينية' },
  { code: 'rus', nameAr: 'الروسية' },
  { code: 'deu', nameAr: 'الألمانية' },
  { code: 'por', nameAr: 'البرتغالية' },
  { code: 'hin', nameAr: 'الهندية' },
  { code: 'swa', nameAr: 'السواحيلية' },
  { code: 'jpn', nameAr: 'اليابانية' },
  { code: 'kor', nameAr: 'الكورية' },
  { code: 'ind', nameAr: 'الإندونيسية' },
  { code: 'ber', nameAr: 'الأمازيغية' },
  { code: 'kur', nameAr: 'الكردية' },
  { code: 'heb', nameAr: 'العبرية' },
  { code: 'ell', nameAr: 'اليونانية' },
]

export const FLAG_PALETTE = [
  { name: 'أخضر عميق', value: '#1e4d3a' },
  { name: 'أخضر فاتح', value: '#7fa58b' },
  { name: 'عاجي دافئ', value: '#efe4d1' },
  { name: 'برونزي', value: '#b48854' },
  { name: 'ذهبي', value: '#d6b477' },
  { name: 'حجري', value: '#8d948b' },
  { name: 'أحمر طيني', value: '#9e4f3f' },
  { name: 'أزرق ليلي', value: '#263e4b' },
  { name: 'أسود فحمي', value: '#15201b' },
  { name: 'أبيض ثلجي', value: '#f7f2e8' },
]

export const DEFAULT_FLAG = {
  preset: 'custom' as const,
  pattern: 'horizontal' as const,
  colors: ['#1e4d3a', '#efe4d1', '#b48854'] as [string, string, string],
  symbol: 'star8' as const,
  symbolColor: '#b48854',
}

export const DEFAULT_EMBLEM = {
  shape: 'shield' as const,
  symbol: 'wheat' as const,
  metal: 'bronze' as const,
}
