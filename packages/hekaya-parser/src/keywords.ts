/**
 * Arabic ↔ English keyword mappings for screenplay elements.
 *
 * These centralize all language-specific detection terms so that
 * rules.ts can reference them without hardcoding strings.
 *
 * Terminology verified against:
 *   - Egyptian Film Institute (معهد السينما – القاهرة) academic manuals
 *   - MBC Academy screenwriting course materials
 *   - David Trottier — The Screenwriter's Bible, 7th Edition
 *   - Real Egyptian production scripts (الشيخ جاكسون, هيبتا, سهر الليالي, دم الغزال, ابراهيم الابيض)
 *   - Arabic film terminology sources (Wikipedia Arabic, Pandaify, Hindawi)
 */

/**
 * Arabic scene heading keywords mapped to their English equivalents.
 *
 * Note: "لقطة تأسيسية" (establishing shot) is the standard Arabic term
 * used in Egyptian film industry training materials.
 * English EST still works via SCENE_HEADING_KEYWORDS_EN for Fountain compatibility.
 */
export const SCENE_HEADING_KEYWORDS_AR: Record<string, string> = {
  داخلي: 'INT',
  خارجي: 'EXT',
  'لقطة تأسيسية': 'EST',
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

/**
 * Arabic title page key mappings to normalized English keys.
 *
 * Industry-standard terms:
 *   سيناريو / كتابة / تأليف — all map to 'author' (Egyptian film industry convention)
 *   مسودة — maps to 'draft' (not 'draft date')
 *   تاريخ المسودة — maps to 'draft date'
 *   حقوق النشر — full copyright phrase (not just حقوق)
 *   بيانات الاتصال — formal contact info (تواصل also accepted)
 */
export const TITLE_KEYS_AR: Record<string, string> = {
  العنوان: 'title',
  سيناريو: 'author',
  كتابة: 'author',
  تأليف: 'author',
  المصدر: 'source',
  مسودة: 'draft',
  'تاريخ المسودة': 'draft date',
  تاريخ: 'date',
  التاريخ: 'date',
  تواصل: 'contact',
  'بيانات الاتصال': 'contact',
  'حقوق النشر': 'copyright',
  ملاحظات: 'notes',
};

/** English title page keys (standard Fountain) mapped to normalized form. */
export const TITLE_KEYS_EN: Record<string, string> = {
  title: 'title',
  author: 'author',
  authors: 'authors',
  source: 'source',
  draft: 'draft',
  'draft date': 'draft date',
  date: 'date',
  contact: 'contact',
  copyright: 'copyright',
  notes: 'notes',
  direction: 'direction',
};

/**
 * Arabic transition keywords — verified from:
 *   1. Real Egyptian production scripts (الشيخ جاكسون, هيبتا, سهر الليالي, دم الغزال, ابراهيم الابيض)
 *   2. Arabic film terminology sources (Wikipedia Arabic, Pandaify, Hindawi)
 *   3. Egyptian Film Institute teaching materials
 *   4. MBC Academy screenplay courses
 *
 * Key terms:
 *   قطع — most common (CUT TO) — from production scripts
 *   قطع مفاجئ — smash cut (Pandaify)
 *   قطع متطابق — match cut (Pandaify)
 *   قطع قافز — jump cut
 *   تلاشي — fade out (industry standard)
 *   اختفاء تدريجي — fade out (alternate, production scripts)
 *   ظهور تدريجي — fade in (production scripts)
 *   ذوبان / مزج — dissolve (yabeyrouth + Pandaify)
 *   تداخل مع — intercut with
 *   تجميد الكادر — freeze frame
 *   عودة للمشهد — back to scene (هيبتا)
 *
 * No `>` prefix or `:` suffix — transitions appear as standalone
 * centered text, sometimes with dashes: `- قطع -`
 */
export const TRANSITION_KEYWORDS_AR: string[] = [
  // Core cuts
  'قطع',
  'قطع إلى',
  'قطع مباشر',
  'قطع مفاجئ',
  'قطع متطابق',
  'قطع قافز',
  'قطع خاطف',
  // Fades
  'تلاشي',
  'اختفاء تدريجي',
  'ظهور تدريجي',
  'تلاشي إلى أسود',
  'تلاشي إلى أبيض',
  'تلاشي إلى',
  // Dissolves
  'مزج',
  'مزج إلى',
  'مزج متطابق',
  'ذوبان',
  // Wipes & flashes
  'مسح',
  'مسح إلى',
  'وميض',
  'وميض إلى',
  // Iris
  'قزحية دخول',
  'قزحية خروج',
  // Structural
  'تداخل مع',
  'تجميد الكادر',
  'شاشة منقسمة',
  'تحول تدريجي',
  'انتقال',
  // Navigation
  'عودة للمشهد',
  'عودة إلى',
];

/**
 * Full Arabic↔English transition mapping for autocomplete and export.
 * Covers all standard professional screenplay transition types.
 * Terms verified from Arabic film terminology sources.
 */
export const TRANSITION_MAP_AR_EN: Record<string, string> = {
  // Core cuts
  قطع: 'CUT TO',
  'قطع إلى': 'CUT TO',
  'قطع مباشر': 'CUT TO',
  'قطع مفاجئ': 'SMASH CUT TO',
  'قطع متطابق': 'MATCH CUT TO',
  'قطع قافز': 'JUMP CUT TO',
  'قطع خاطف': 'FLASH CUT',
  // Fades
  تلاشي: 'FADE OUT',
  'اختفاء تدريجي': 'FADE OUT',
  'ظهور تدريجي': 'FADE IN',
  'تلاشي إلى أسود': 'FADE TO BLACK',
  'تلاشي إلى أبيض': 'FADE TO WHITE',
  'تلاشي إلى': 'FADE TO',
  // Dissolves
  مزج: 'DISSOLVE TO',
  'مزج إلى': 'DISSOLVE TO',
  'مزج متطابق': 'MATCH DISSOLVE',
  ذوبان: 'DISSOLVE TO',
  // Wipes & flashes
  مسح: 'WIPE TO',
  'مسح إلى': 'WIPE TO',
  وميض: 'FLASH TO',
  'وميض إلى': 'FLASH TO',
  // Iris
  'قزحية دخول': 'IRIS IN',
  'قزحية خروج': 'IRIS OUT',
  // Structural
  'تداخل مع': 'INTERCUT WITH',
  'تجميد الكادر': 'FREEZE FRAME',
  'شاشة منقسمة': 'SPLIT SCREEN',
  'تحول تدريجي': 'MORPH CUT',
  انتقال: 'TRANSITION',
  // Navigation
  'عودة للمشهد': 'BACK TO',
  'عودة إلى': 'BACK TO',
};

/** Arabic character extensions mapped to English equivalents. */
export const CHARACTER_EXTENSIONS_AR: Record<string, string> = {
  'صوت من خارج المشهد': 'V.O.',
  'ص.خ': 'V.O.',
  'خارج الكادر': 'O.S.',
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
  'منتصف الليل',
  'قبل الفجر',
  'بعد الغروب',
];
