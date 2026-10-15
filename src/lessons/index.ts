import lesson1_1 from './1-1';
import lesson1_2 from './1-2';
import lesson1_3 from './1-3';
import lesson1_4 from './1-4';
import lesson1_5 from './1-5';
import lesson1_6 from './1-6';
import lesson2_1 from './2-1';
import lesson2_2 from './2-2';
import lesson2_3 from './2-3';
import lesson2_4 from './2-4';
import lesson2_5 from './2-5';
import lesson2_6 from './2-6';
import lesson2_7 from './2-7';
import lesson3_1 from './3-1';
import lesson3_2 from './3-2';
import lesson3_3 from './3-3';
import lesson3_4 from './3-4';
import lesson4_1 from './4-1';
import lesson4_2 from './4-2';
import lesson4_3 from './4-3';
import lesson4_4 from './4-4';
import lesson5_1 from './5-1';
import lesson5_2 from './5-2';
import lesson5_3 from './5-3';
import lesson5_4 from './5-4';
import lesson6_1 from './6-1';
import lesson6_2 from './6-2';
import lesson6_3 from './6-3';
import lesson6_4 from './6-4';
import type { Lesson } from './types';

/** Lessons that can be played, keyed by id. */
export const lessons: Record<string, Lesson> = Object.fromEntries(
  [lesson1_1, lesson1_2, lesson1_3, lesson1_4, lesson1_5, lesson1_6, lesson2_1, lesson2_2, lesson2_3, lesson2_4, lesson2_5, lesson2_6, lesson2_7, lesson3_1, lesson3_2, lesson3_3, lesson3_4, lesson4_1, lesson4_2, lesson4_3, lesson4_4, lesson5_1, lesson5_2, lesson5_3, lesson5_4, lesson6_1, lesson6_2, lesson6_3, lesson6_4].map((l) => [l.id, l]),
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
  {
    no: 3,
    title: '置換と変更',
    lessons: [
      { id: '3-1', title: 'p で貼り付け' },
      { id: '3-2', title: 'r で1文字置き換え' },
      { id: '3-3', title: 'ce で単語を変更' },
      { id: '3-4', title: 'c$ で行末まで変更' },
    ],
  },
  {
    no: 4,
    title: '検索と移動',
    lessons: [
      { id: '4-1', title: '位置とファイルの情報' },
      { id: '4-2', title: '/ で検索' },
      { id: '4-3', title: '% で対応する括弧へ' },
      { id: '4-4', title: ':s で置換' },
    ],
  },
  {
    no: 5,
    title: 'ファイル操作',
    lessons: [
      { id: '5-1', title: ':! で外部コマンド' },
      { id: '5-2', title: ':w で名前を付けて保存' },
      { id: '5-3', title: '選んだ行だけ保存' },
      { id: '5-4', title: ':r でファイルを読み込む' },
    ],
  },
  {
    no: 6,
    title: 'その他の編集',
    lessons: [
      { id: '6-1', title: 'o と O で行を開く' },
      { id: '6-2', title: 'a で後ろに追加' },
      { id: '6-3', title: 'R で上書き' },
      { id: '6-4', title: 'y と p でコピー' },
      { id: '6-5', title: ':set で設定' },
    ],
  },
  { no: 7, title: 'ヘルプと設定', lessons: [] },
];

/** The lesson after `id` in the chapter list, built or not. Undefined after the last one. */
export function nextLesson(id: string): { id: string; title: string; ready: boolean } | undefined {
  const all = chapters.flatMap((ch) => ch.lessons);
  const next = all[all.findIndex((l) => l.id === id) + 1];
  return next && { ...next, ready: next.id in lessons };
}
