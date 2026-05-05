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

All exports are named except the default, which is `toPinyinTones`.

```js
import toPinyinTones, {
    fromPinyinTones,
    splitUnspacedSyllables,
    convertUnspacedPinyin,
    markSinglePinyinVowel,
} from 'pinyin-tone2';
```

### `toPinyinTones(input, options?)` — numbered → diacritics

```js
toPinyinTones('chu1 yin1 wei4 lai2')        // → 'chū yīn wèi lái'
toPinyinTones('xun2 yin1 liu2 ge1')         // → 'xún yīn liú gē'
toPinyinTones('an1 vn2 ong3 uen4')          // → 'ān ǘn ǒng uèn'
toPinyinTones('b p m f')                    // → 'b p m f'

// Erhua — r-number format (default)
toPinyinTones('huar1 renr2 shuir3 yuer4')   // → 'huār rénr shuǐr yuèr'

// Erhua — number-r format
toPinyinTones('hua1r ren2r', { erhua: 'number-r' })  // → 'huār rénr'
```

### `fromPinyinTones(input, options?)` — diacritics → numbered

```js
fromPinyinTones('chū yīn wèi lái')          // → 'chu1 yin1 wei4 lai2'
fromPinyinTones('xún yīn liú gē')           // → 'xun2 yin1 liu2 ge1'
fromPinyinTones('ān ǘn ǒng uèn')            // → 'an1 vn2 ong3 uen4'

// Erhua — r-number output (default)
fromPinyinTones('huār rénr shuǐr yuèr')     // → 'huar1 renr2 shuir3 yuer4'

// Erhua — number-r output
fromPinyinTones('huār rénr', { erhua: 'number-r' })  // → 'hua1r ren2r'
```

Neutral-tone syllables (no diacritic marks) are passed through unchanged without a number suffix.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `erhua` | `'r-number' \| 'number-r'` | `'r-number'` | Position of the tone digit relative to the erhua `r`. `'r-number'` → `huar1`; `'number-r'` → `hua1r`. |

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

Marks a single vowel character (`a o e i u v`) with a tone number (0–4).

```js
markSinglePinyinVowel('a1')  // → 'ā'
markSinglePinyinVowel('v3')  // → 'ǚ'   (v is the ASCII alias for ü)
markSinglePinyinVowel('u4')  // → 'ù'
```

## Notes

- `v` is used as the ASCII alias for `ü` in numbered input/output (e.g. `vn2` → `ǘn`).
- Non-pinyin tokens are passed through unchanged.
- The package is ESM-only.

## License

MIT © [Leon Si](https://github.com/leonsilicon)
