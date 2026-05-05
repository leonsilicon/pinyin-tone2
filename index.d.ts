export interface PinyinTonesOptions {
    /**
     * Erhua (儿化音) format used when parsing or producing erhua syllables.
     * - `'r-number'` (default): r comes before the tone number, e.g. `huar1` → `huār`
     * - `'number-r'`: tone number comes before r, e.g. `hua1r` → `huār`
     */
    erhua?: 'r-number' | 'number-r';
    /**
     * Tone number appended to neutral-tone syllables in the output of
     * `toPinyinToneNumbers`. Has no effect on `fromPinyinToneNumbers`.
     * - `'none'` (default): no number suffix, e.g. `ma` → `ma`
     * - `'0'`: append `0`, e.g. `ma` → `ma0`
     * - `'5'`: append `5`, e.g. `ma` → `ma5`
     */
    neutralToneNumber?: '0' | '5' | 'none';
}

/**
 * Convert space-separated diacritic pinyin to numbered pinyin.
 *
 * Produces erhua in `'r-number'` format (`huar1`) by default.
 * Pass `{ erhua: 'number-r' }` to produce `hua1r` style output instead.
 * Neutral-tone syllables have no number suffix by default; use `neutralToneNumber`
 * to append `'0'` or `'5'` instead.
 *
 * @example
 * toPinyinToneNumbers('chū yīn wèi lái') // → 'chu1 yin1 wei4 lai2'
 * toPinyinToneNumbers('huār')             // → 'huar1'  (r-number, default)
 * toPinyinToneNumbers('huār', { erhua: 'number-r' }) // → 'hua1r'
 * toPinyinToneNumbers('ma', { neutralToneNumber: '5' }) // → 'ma5'
 */
export declare function toPinyinToneNumbers(input: string, options?: PinyinTonesOptions): string;

/**
 * Convert space-separated numbered pinyin to diacritic pinyin.
 *
 * Supports erhua (儿化音) in both formats:
 * - `'r-number'` (default): `huar1` → `huār`
 * - `'number-r'`: `hua1r` → `huār`
 *
 * Both `0` and `5` are accepted as the neutral tone (no diacritic applied).
 *
 * @example
 * fromPinyinToneNumbers('chu1 yin1 wei4 lai2') // → 'chū yīn wèi lái'
 * fromPinyinToneNumbers('huar1')               // → 'huār'  (r-number, default)
 * fromPinyinToneNumbers('hua1r', { erhua: 'number-r' }) // → 'huār'
 * fromPinyinToneNumbers('ma5') // → 'ma'  (neutral tone)
 */
export declare function fromPinyinToneNumbers(input: string, options?: PinyinTonesOptions): string;

/**
 * Split unspaced numbered syllables into space-separated syllables by
 * inserting a space after each tone digit.
 *
 * @example
 * splitUnspacedSyllables('han4yu3pin1yin1') // → 'han4 yu3 pin1 yin1'
 */
export declare function splitUnspacedSyllables(input: string): string;

/**
 * Convert unspaced numbered pinyin directly to diacritic pinyin without spaces.
 *
 * @example
 * convertUnspacedPinyin('han4yu3pin1yin1') // → 'hànyǔpīnyīn'
 */
export declare function convertUnspacedPinyin(input: string): string;

/**
 * Mark a single vowel character (`a`, `o`, `e`, `i`, `u`, `v`) with a tone
 * number (0–5). Both `0` and `5` are treated as the neutral tone. Returns
 * the input unchanged if it is not a recognised vowel+tone combination.
 *
 * @example
 * markSinglePinyinVowel('a1') // → 'ā'
 * markSinglePinyinVowel('v3') // → 'ǚ'
 * markSinglePinyinVowel('a5') // → 'a'  (neutral tone)
 */
export declare function markSinglePinyinVowel(input: string): string;
