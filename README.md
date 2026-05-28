# pinyin-tone2

Convert between numbered pinyin and diacritic pinyin, in both directions.

This package is adapted from the [pinyin-tone](https://github.com/mrchenguozheng/pinyin-tone) package by [@mrchenguozheng](https://github.com/mrchenguozheng)

```
huar1  ⟺  huār
chu1 yin1 wei4 lai2  ⟺  chū yīn wèi lái
```

## Installation

```bash
npm install pinyin-tone2
```

## API

```js
import {
    toPinyinToneNumbers,
    fromPinyinToneNumbers,
    splitUnspacedSyllables,
    convertUnspacedPinyin,
    markSinglePinyinVowel,
    parseDiacriticVowel,
} from 'pinyin-tone2';
```

### `fromPinyinToneNumbers(input, options?)` — numbered → diacritics

Both `0` and `5` are accepted as the neutral tone (no diacritic applied).

```js
fromPinyinToneNumbers('chu1 yin1 wei4 lai2')        // → 'chū yīn wèi lái'
fromPinyinToneNumbers('xun2 yin1 liu2 ge1')         // → 'xún yīn liú gē'
fromPinyinToneNumbers('an1 vn2 ong3 uen4')          // → 'ān ǘn ǒng uèn'
fromPinyinToneNumbers('b p m f')                    // → 'b p m f'
fromPinyinToneNumbers('ma0')                        // → 'ma'  (neutral tone)
fromPinyinToneNumbers('ma5')                        // → 'ma'  (neutral tone)
fromPinyinToneNumbers('nu:3')                       // → 'nǚ'  (u: is the ASCII form of ü)
fromPinyinToneNumbers('lu:e4')                       // → 'lüè'

// Erhua — r-number format (default)
fromPinyinToneNumbers('huar1 renr2 shuir3 yuer4')   // → 'huār rénr shuǐr yuèr'

// Erhua — number-r format
fromPinyinToneNumbers('hua1r ren2r', { erhua: 'number-r' })  // → 'huār rénr'
```

### `toPinyinToneNumbers(input, options?)` — diacritics → numbered

Neutral-tone syllables (no diacritic marks) have no number suffix by default.
Use the `neutralToneNumber` option to append `'0'` or `'5'` instead.

```js
toPinyinToneNumbers('chū yīn wèi lái')          // → 'chu1 yin1 wei4 lai2'
toPinyinToneNumbers('xún yīn liú gē')           // → 'xun2 yin1 liu2 ge1'
toPinyinToneNumbers('ān ǘn ǒng uèn')            // → 'an1 vn2 ong3 uen4'

// Neutral tone — no suffix (default)
toPinyinToneNumbers('nǐ hǎo ma')                // → 'ni3 hao3 ma'

// Neutral tone — append 0
toPinyinToneNumbers('nǐ hǎo ma', { neutralToneNumber: '0' })  // → 'ni3 hao3 ma0'

// Neutral tone — append 5
toPinyinToneNumbers('nǐ hǎo ma', { neutralToneNumber: '5' })  // → 'ni3 hao3 ma5'

// Erhua — r-number output (default)
toPinyinToneNumbers('huār rénr shuǐr yuèr')     // → 'huar1 renr2 shuir3 yuer4'

// Erhua — number-r output
toPinyinToneNumbers('huār rénr', { erhua: 'number-r' })  // → 'hua1r ren2r'
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `erhua` | `'r-number' \| 'number-r'` | `'r-number'` | Position of the tone digit relative to the erhua `r`. `'r-number'` → `huar1`; `'number-r'` → `hua1r`. |
| `neutralToneNumber` | `'0' \| '5' \| 'none'` | `'none'` | Tone number appended to neutral-tone syllables by `toPinyinToneNumbers`. `'none'` omits the suffix entirely. |

### `splitUnspacedSyllables(text)` — insert spaces after tone digits

```js
splitUnspacedSyllables('han4yu3pin1yin1')  // → 'han4 yu3 pin1 yin1'
```

### `convertUnspacedPinyin(input)` — unspaced numbered → unspaced diacritics

```js
convertUnspacedPinyin('han4yu3pin1yin1')  // → 'hànyǔpīnyīn'
convertUnspacedPinyin('han4 yu3pin1yin1') // → 'hànyǔpīnyīn'
```

### `markSinglePinyinVowel(input)` — mark a single vowel

Marks a single vowel character (`a o e i u v`) with a tone number (0–5).
Both `0` and `5` are treated as the neutral tone.

```js
markSinglePinyinVowel('a1')  // → 'ā'
markSinglePinyinVowel('v3')  // → 'ǚ'   (v is the ASCII alias for ü)
markSinglePinyinVowel('u4')  // → 'ù'
markSinglePinyinVowel('a5')  // → 'a'   (neutral tone)
```

### `parseDiacriticVowel(char)` — single diacritic char → `{ letter, tone }`

Parses a single pinyin vowel character — toned (`á`, `ǚ`), bare diacritic
(`ü`, `ê`), or plain ASCII (`a`, `v`) — into its ASCII base letter and tone
number, so you don't have to hardcode a lookup table in your own app. `tone`
is `0` for a bare vowel / neutral tone, and `ü` (with its toned forms) maps to
the `v` alias used throughout this library. Unknown characters are returned as
`letter` with `tone: 0`.

```js
parseDiacriticVowel('á')  // → { letter: 'a', tone: 2 }
parseDiacriticVowel('ǚ')  // → { letter: 'v', tone: 3 }
parseDiacriticVowel('ü')  // → { letter: 'v', tone: 0 }
parseDiacriticVowel('a')  // → { letter: 'a', tone: 0 }
```

## Interjection syllables

The rare syllabic-consonant interjections (`m̄ ḿ m̌ m̀`, `n̄ ń ň ǹ`, `n̄g ńg ňg ǹg`, `hḿ`, `hńg`) and the standalone vowel `ê` (`ê̄ ế ê̌ ề`) round-trip too:

```js
toPinyinToneNumbers('ḿ')    // → 'm2'        (呒 / 嘸)
toPinyinToneNumbers('ǹ')    // → 'n4'        (嗯)
toPinyinToneNumbers('ňg')   // → 'ng3'       (嗯)
toPinyinToneNumbers('ế')    // → 'e^2'       (欸)
toPinyinToneNumbers('ê̄')    // → 'e^1'       (combining-mark form)

fromPinyinToneNumbers('e^2') // → 'ế'
fromPinyinToneNumbers('ng3') // → 'ňg'
```

`e^` is used as the ASCII alias for `ê` in numbered input/output, mirroring how `v` is used for `ü`.

## Notes

- `v` is used as the ASCII alias for `ü` in numbered input/output (e.g. `vn2` → `ǘn`). The legacy `u:` colon spelling is also accepted on input (e.g. `nu:3` → `nǚ`).
- `e^` is used as the ASCII alias for `ê` (e.g. `e^2` → `ế`).
- Combining-diacritic and precomposed forms (`ê̄` and `ế`, `m̄` and `ḿ`, etc.) are both accepted as input and normalised via NFC.
- Both `0` and `5` are accepted as the neutral tone number in all functions.
- Non-pinyin tokens are passed through unchanged.
- The package is ESM-only.

## License

MIT © [Leon Si](https://github.com/leonsilicon)
