export const languages = {
  ja: '日本語',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const langs = Object.keys(languages) as Lang[];

export const ui = {
  ja: {
    'site.tagline': 'TODOをクリアしながら、ブラウザで楽しくVimを覚えよう',
    'home.comingSoon': '現在準備中です。もうすぐ最初のクエストが遊べるようになります。',
  },
  en: {
    'site.tagline': 'Learn Vim by playing — clear TODOs one by one in your browser',
    'home.comingSoon': 'Coming soon. The first quests will be playable shortly.',
  },
} as const satisfies Record<Lang, Record<string, string>>;

export function t(lang: Lang, key: keyof (typeof ui)['ja']): string {
  return ui[lang][key];
}
