/**
 * Arabic ↔ English keyword mappings for screenplay elements.
 *
 * These centralize all language-specific detection terms so that
 * rules.ts can reference them without hardcoding strings.
 */

/**
 * Arabic scene heading keywords mapped to their English equivalents.
 *
 * Note: EST (establishing shot) has no standard Arabic screenplay keyword.
 * The Arabic term is "لقطة تأسيسية" but it's a shot type, not a scene heading
 * prefix. Egyptian screenwriters just write wide scene headings for establishing shots.
 * English EST still works via SCENE_HEADING_KEYWORDS_EN for Fountain compatibility.
 */
export const SCENE_HEADING_KEYWORDS_AR: Record<string, string> = {
  داخلي: 'INT',
  خارجي: 'EXT',
  تأسيس: 'EST',
  'داخلي/خارجي': 'INT/EXT',
  'خارجي/داخلي': 'EXT/INT',
  'د/خ': 'I/E',
};

/** English scene heading keywords (standard Fountain). */
export const SCENE_HEADING_KEYWORDS_EN: string[] = [
  'INT',
  'EXT',
  'EST',
  'INT./EXT',
  'INT/EXT',
  'EXT/INT',
  'EXT./INT',
  'I/E',
];

/** Arabic title page key mappings to normalized English keys. */
export const TITLE_KEYS_AR: Record<string, string> = {
  العنوان: 'title',
  المؤلف: 'author',
  المؤلفون: 'authors',
  المصدر: 'source',
  مسودة: 'draft date',
  تاريخ: 'date',
  تواصل: 'contact',
  حقوق: 'copyright',
  ملاحظات: 'notes',
  ائتمان: 'credit',
  اتجاه: 'direction',
};

/** English title page keys (standard Fountain) mapped to normalized form. */
export const TITLE_KEYS_EN: Record<string, string> = {
  title: 'title',
  author: 'author',
  authors: 'authors',
  source: 'source',
  'draft date': 'draft date',
  date: 'date',
  contact: 'contact',
  copyright: 'copyright',
  notes: 'notes',
  credit: 'credit',
  direction: 'direction',
};

/**
 * Arabic transition keywords — verified from:
 *   1. Real Egyptian production scripts (الشيخ جاكسون, هيبتا, سهر الليالي, دم الغزال, ابراهيم الابيض)
 *   2. Arabic film terminology sources (Wikipedia Arabic, Pandaify, Hindawi)
 *
 * Key terms:
 *   قطع — most common (CUT TO) — from production scripts
 *   القطع المفاجئ / قطع مفاجئ — smash cut (Pandaify)
 *   القطع المتطابق / قطع متطابق — match cut (Pandaify)
 *   اختفاء تدريجي / التلاشي الخارجي — fade out (production scripts + Pandaify)
 *   ظهور تدريجي / التلاشي الداخلي — fade in (production scripts + Pandaify)
 *   الذوبان / المزج — dissolve (yabeyrouth + Pandaify)
 *   عودة للمشهد — back to scene (هيبتا)
 *
 * No `>` prefix or `:` suffix — transitions appear as standalone
 * centered text, sometimes with dashes: `- قطع -`
 */
export const TRANSITION_KEYWORDS_AR: string[] = [
  'قطع',
  'قطع إلى',
  'قطع مفاجئ',
  'قطع متطابق',
  'اختفاء تدريجي',
  'ظهور تدريجي',
  'مزج',
  'مزج إلى',
  'ذوبان',
  'عودة للمشهد',
  'تلاشي إلى أسود',
  'تلاشي إلى',
];

/**
 * Full Arabic↔English transition mapping for autocomplete and export.
 * Covers all StudioBinder/Final Draft transition types.
 * Terms verified from Arabic film terminology sources.
 */
export const TRANSITION_MAP_AR_EN: Record<string, string> = {
  قطع: 'CUT TO',
  'قطع إلى': 'CUT TO',
  'قطع مفاجئ': 'SMASH CUT TO',
  'قطع متطابق': 'MATCH CUT TO',
  'اختفاء تدريجي': 'FADE OUT',
  'ظهور تدريجي': 'FADE IN',
  مزج: 'DISSOLVE TO',
  'مزج إلى': 'DISSOLVE TO',
  ذوبان: 'DISSOLVE TO',
  'عودة للمشهد': 'BACK TO',
  'تلاشي إلى أسود': 'FADE TO BLACK',
  'تلاشي إلى': 'FADE TO',
};

/** Arabic character extensions mapped to English equivalents. */
export const CHARACTER_EXTENSIONS_AR: Record<string, string> = {
  'صوت خارجي': 'V.O.',
  'ص.خ': 'V.O.',
  'خارج الشاشة': 'O.S.',
  'خ.ش': 'O.S.',
  تابع: "CONT'D",
};

/** Arabic time-of-day terms (for scene headings). */
export const TIME_OF_DAY_AR: string[] = [
  'نهار',
  'ليل',
  'صباح',
  'مساء',
  'غروب',
  'فجر',
  'ظهر',
  'عصر',
];

/** Arabic direction values for title page. */
export const DIRECTION_VALUES_AR: Record<string, string> = {
  'يمين-لليسار': 'rtl',
  'يسار-لليمين': 'ltr',
};
