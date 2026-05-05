# pinyin-tone2

Convert between numbered pinyin and diacritic pinyin, in both directions.

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

## Notes

- `v` is used as the ASCII alias for `ü` in numbered input/output (e.g. `vn2` → `ǘn`).
- Both `0` and `5` are accepted as the neutral tone number in all functions.
- Non-pinyin tokens are passed through unchanged.
- The package is ESM-only.

## License

MIT © [Leon Si](https://github.com/leonsilicon)
