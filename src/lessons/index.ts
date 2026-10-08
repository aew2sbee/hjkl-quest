import lesson1_1 from './1-1';
import lesson1_2 from './1-2';
import lesson1_3 from './1-3';
import lesson1_4 from './1-4';
import lesson1_5 from './1-5';
import lesson1_6 from './1-6';
import lesson2_1 from './2-1';
import type { Lesson } from './types';

/** Lessons that can be played, keyed by id. */
export const lessons: Record<string, Lesson> = Object.fromEntries(
  [lesson1_1, lesson1_2, lesson1_3, lesson1_4, lesson1_5, lesson1_6, lesson2_1].map((l) => [l.id, l]),
);

export interface ChapterOutline {
  no: number;
  title: string;
  /** Planned lessons. Only ids found in `lessons` can be played. */
  lessons: { id: string; title: string }[];
}

/** The chapter list from docs/lessons.md, including lessons not built yet. */
export const chapters: ChapterOutline[] = [
  {
    no: 1,
    title: '基本操作',
    lessons: [
      { id: '1-1', title: 'カーソルの移動' },
      { id: '1-2', title: '起動と終了' },
      { id: '1-3', title: 'x で削除' },
      { id: '1-4', title: 'i で挿入' },
      { id: '1-5', title: 'A で追記' },
      { id: '1-6', title: '保存して終了' },
    ],
  },
  {
    no: 2,
    title: '削除コマンド',
    lessons: [
      { id: '2-1', title: 'dw で単語を削除' },
      { id: '2-2', title: 'd$ で行末まで削除' },
      { id: '2-3', title: 'オペレータとモーション' },
      { id: '2-4', title: 'カウントで移動' },
      { id: '2-5', title: 'カウント付きの削除' },
      { id: '2-6', title: 'dd で行を削除' },
      { id: '2-7', title: '取り消しとやり直し' },
    ],
  },
  { no: 3, title: '置換と変更', lessons: [] },
  { no: 4, title: '検索と移動', lessons: [] },
  { no: 5, title: 'ファイル操作', lessons: [] },
  { no: 6, title: 'その他の編集', lessons: [] },
  { no: 7, title: 'ヘルプと設定', lessons: [] },
];

/** The lesson after `id` in the chapter list, built or not. Undefined after the last one. */
export function nextLesson(id: string): { id: string; title: string; ready: boolean } | undefined {
  const all = chapters.flatMap((ch) => ch.lessons);
  const next = all[all.findIndex((l) => l.id === id) + 1];
  return next && { ...next, ready: next.id in lessons };
}
