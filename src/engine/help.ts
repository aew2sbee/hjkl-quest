/** A help page: the file name shown in its title bar, and its lines. */
export interface HelpPage {
  file: string;
  lines: string[];
}

// Short pages written for this site, not Vim's own help: only the topics the lessons point to.
const pages: Record<string, HelpPage> = {
  'help.txt': {
    file: 'help.txt',
    lines: [
      '*help.txt*  Vim のヘルプ',
      '',
      'ヘルプの見かた',
      '  :help          このページを開く',
      '  :help {題名}   題名のページを開く（例: :help w）',
      '  :q             ヘルプを閉じる',
      '',
      '題名の例',
      '  w              単語の先頭へ進む',
      '  c_CTRL-D       コマンドラインで候補の一覧を出す',
      '  insert-index   挿入モードで使えるキーの一覧',
      '  user-manual    ユーザーマニュアルの目次',
      '',
      '本物の Vim では CTRL-W CTRL-W でヘルプと元のファイルを行き来できます。',
    ],
  },
  w: {
    file: 'motion.txt',
    lines: [
      '*w*  [count]w   [count] 個あとの単語の先頭へ進む。',
      '',
      '単語は、英字・数字・_ が続いた所か、それ以外の記号が続いた所です。',
      '空白で区切られた所だけを単語として進むときは W を使います。',
      '',
      '関連: e（単語の終わりへ）、b（前の単語の先頭へ）',
    ],
  },
  'c_CTRL-D': {
    file: 'cmdline.txt',
    lines: [
      '*c_CTRL-D*  CTRL-D   コマンドラインで、カーソルの前の文字に合う候補を一覧にする。',
      '',
      '例: :e のあとで CTRL-D を押すと、e で始まるコマンドが並びます。',
      '    <Tab> を押すと、候補の1つが入ります。',
    ],
  },
  'insert-index': {
    file: 'index.txt',
    lines: [
      '*insert-index*  挿入モードのキー',
      '',
      '  <Esc>    ノーマルモードに戻る',
      '  <BS>     カーソルの前の文字を消す',
      '  CTRL-W   カーソルの前の単語を消す',
      '  CTRL-U   その行で打った文字を消す',
    ],
  },
  'user-manual': {
    file: 'usr_toc.txt',
    lines: [
      '*user-manual*  ユーザーマニュアル',
      '',
      '  usr_01.txt  このマニュアルについて',
      '  usr_02.txt  はじめの一歩',
      '  usr_03.txt  移動する',
      '  usr_04.txt  ちょっとした変更',
      '',
      'vimtutor を終えたら、ここから読み進めるのがおすすめです。',
    ],
  },
};

/** The page for `:help {topic}` (`:help` alone for the main page), or undefined when there is none. */
export const helpPage = (topic: string): HelpPage | undefined => pages[topic.trim() || 'help.txt'];
