import b from './dict/b.js';
import br from './dict/br.js';
import c from './dict/c.js';
import ch from './dict/ch.js';
import chr from './dict/chr.js';
import cr from './dict/cr.js';
import d from './dict/d.js';
import dr from './dict/dr.js';
import f from './dict/f.js';
import fr from './dict/fr.js';
import g from './dict/g.js';
import gr from './dict/gr.js';
import h from './dict/h.js';
import hr from './dict/hr.js';
import j from './dict/j.js';
import jr from './dict/jr.js';
import k from './dict/k.js';
import kr from './dict/kr.js';
import l from './dict/l.js';
import lr from './dict/lr.js';
import m from './dict/m.js';
import mr from './dict/mr.js';
import n from './dict/n.js';
import nr from './dict/nr.js';
import p from './dict/p.js';
import pr from './dict/pr.js';
import q from './dict/q.js';
import qr from './dict/qr.js';
import r from './dict/r.js';
import rr from './dict/rr.js';
import s from './dict/s.js';
import sh from './dict/sh.js';
import shr from './dict/shr.js';
import special from './dict/special.js';
import sr from './dict/sr.js';
import t from './dict/t.js';
import tr from './dict/tr.js';
import v from './dict/v.js';
import vr from './dict/vr.js';
import w from './dict/w.js';
import wr from './dict/wr.js';
import x from './dict/x.js';
import xr from './dict/xr.js';
import y from './dict/y.js';
import yr from './dict/yr.js';
import yunmu from './dict/yunmu.js';
import yunmur from './dict/yunmur.js';
import z from './dict/z.js';
import zh from './dict/zh.js';
import zhr from './dict/zhr.js';
import zr from './dict/zr.js';

/** @type {Record<string, string[]>} */
const dict = Object.assign(
    {}, b, br, c, ch, chr, cr, d, dr, f, fr, g, gr, h, hr, j, jr, k, kr,
    l, lr, m, mr, n, nr, p, pr, q, qr, r, rr, s, sr, sh, shr, special, sr,
    t, tr, v, vr, w, wr, x, xr, y, yr, yunmu, yunmur, z, zh, zhr, zr
);

// Matches syllable letters (allow ^ for e^ special case) + optional tone digit (0-5)
const NUMBERED_REGEX = /^(?<syllable>[a-z^]+)(?<num>[012345]?)$/;

// Maps each toned diacritic character to [normalized ASCII base, tone number].
// Includes precomposed forms for ê / m / n used in interjection syllables
// (e.g. 欸 ế / ề, 呒 ḿ, 嗯 ń / ň / ǹ). For ê the ASCII base is `e^`.
const DIACRITIC_MAP = /** @type {Record<string, [string, number]>} */ ({
    'ā': ['a', 1], 'á': ['a', 2], 'ǎ': ['a', 3], 'à': ['a', 4],
    'ē': ['e', 1], 'é': ['e', 2], 'ě': ['e', 3], 'è': ['e', 4],
    'ī': ['i', 1], 'í': ['i', 2], 'ǐ': ['i', 3], 'ì': ['i', 4],
    'ō': ['o', 1], 'ó': ['o', 2], 'ǒ': ['o', 3], 'ò': ['o', 4],
    'ū': ['u', 1], 'ú': ['u', 2], 'ǔ': ['u', 3], 'ù': ['u', 4],
    'ǖ': ['v', 1], 'ǘ': ['v', 2], 'ǚ': ['v', 3], 'ǜ': ['v', 4],
    // ê precomposed with acute/grave
    'ế': ['e^', 2], 'ề': ['e^', 4],
    // m / n precomposed with acute (no precomposed forms exist for tone 1/3/4
    // on m or tone 1 on n — those use combining marks handled separately).
    'ḿ': ['m', 2],
    'ń': ['n', 2], 'ň': ['n', 3], 'ǹ': ['n', 4],
});

// Combining diacritics used on ê / m / n where no precomposed codepoint
// exists. Mapped to the tone number they encode.
const COMBINING_TONE_MAP = /** @type {Record<string, number>} */ ({
    '̄': 1, // combining macron       -> tone 1
    '́': 2, // combining acute accent -> tone 2
    '̌': 3, // combining caron        -> tone 3
    '̀': 4, // combining grave accent -> tone 4
});

// Matches a base letter (ê, m, or n) immediately followed by a combining
// tone diacritic. Used to normalize NFC-decomposed sequences before the
// per-character pass scans for precomposed toned letters.
const COMBINING_TONE_REGEX = /([êmn])([̄́̌̀])/u;

/**
 * Convert space-separated diacritic pinyin to numbered pinyin.
 *
 * Produces erhua in `'r-number'` format (`huar1`) by default.
 * Pass `{ erhua: 'number-r' }` to produce `hua1r` style output instead.
 *
 * Neutral-tone syllables have no tone number by default. Use `neutralToneNumber`
 * to append `'0'` or `'5'` for neutral-tone output instead.
 *
 * @param {string} input - Space-separated diacritic pinyin, e.g. `"chū yīn wèi lái"`
 * @param {{ erhua?: 'r-number' | 'number-r', neutralToneNumber?: '0' | '5' | 'none' }} [options]
 * @returns {string}
 */
function toPinyinToneNumbers(input, options = {}) {
    const erhua = options.erhua ?? 'r-number';
    const neutralToneNumber = options.neutralToneNumber ?? 'none';
    return input.trim().split(' ').map((rawSyllable) => {
        const syllable = rawSyllable.normalize('NFC');
        let tone = 0;
        let normalized = syllable;

        // First, fold NFC-decomposed toned ê/m/n into their ASCII bases.
        // These have no precomposed codepoint for some tones (e.g. m̄, m̌, m̀,
        // n̄, ê̄, ê̌), so the dict and DIACRITIC_MAP can't catch them in the
        // per-char loop below.
        const combiningMatch = COMBINING_TONE_REGEX.exec(normalized);
        if (combiningMatch !== null) {
            const base = combiningMatch[1] === 'ê' ? 'e^' : combiningMatch[1];
            tone = COMBINING_TONE_MAP[combiningMatch[2]];
            normalized = normalized.replace(COMBINING_TONE_REGEX, base);
        }

        // Locate and extract the single toned diacritic vowel in the syllable.
        // Skipped if we already handled a combining-mark form above.
        if (tone === 0) {
            for (const char of normalized) {
                const entry = DIACRITIC_MAP[char];
                if (entry !== undefined) {
                    const [base, t] = entry;
                    tone = t;
                    normalized = normalized.replace(char, base);
                    break; // only one toned vowel per syllable
                }
            }
        }

        // Replace ü with its ASCII alias v, and bare ê with e^.
        normalized = normalized.replace(/ü/g, 'v').replace(/ê/g, 'e^');

        // Nothing changed and no tone found — could be a neutral-tone pinyin syllable
        // or a non-pinyin token. Check the dict to distinguish.
        if (normalized === syllable) {
            if (neutralToneNumber !== 'none' && dict[normalized]) {
                return normalized + neutralToneNumber;
            }
            return rawSyllable;
        }

        const toneStr = tone === 0
            ? (neutralToneNumber === 'none' ? '' : neutralToneNumber)
            : String(tone);

        // Detect erhua: result ends with r and has content before it
        if (normalized.endsWith('r') && normalized.length > 1) {
            const base = normalized.slice(0, -1);
            if (erhua === 'number-r') {
                return base + toneStr + 'r';
            }
            // r-number (default)
            return base + 'r' + toneStr;
        }

        return normalized + toneStr;
    }).join(' ');
}

/**
 * Convert space-separated numbered pinyin to diacritic pinyin.
 *
 * Supports erhua (儿化音) in both formats:
 * - `'r-number'` (default): `huar1` → `huār`
 * - `'number-r'`: `hua1r` → `huār`
 *
 * Both `0` and `5` are accepted as the neutral tone (no diacritic applied).
 *
 * @param {string} input - Space-separated numbered pinyin, e.g. `"chu1 yin1 wei4 lai2"`
 * @param {{ erhua?: 'r-number' | 'number-r' }} [options]
 * @returns {string}
 */
function fromPinyinToneNumbers(input, options = {}) {
    const erhua = options.erhua ?? 'r-number';
    return input.trim().split(' ').map((str) => {
        // Accept the legacy ASCII "u:" spelling for ü (e.g. `nu:3`, `lu:e4`)
        // by folding the colon form into the canonical `v` alias the dict is
        // keyed on.
        let normalized = str.replace(/u:/g, 'v');
        // Normalize number-r erhua (e.g. hua1r) to r-number (huar1) before lookup
        if (erhua === 'number-r') {
            normalized = normalized.replace(/^([a-z]+)([0-5])(r)$/, '$1r$2');
        }
        const match = NUMBERED_REGEX.exec(normalized);
        if (match && dict[match.groups.syllable]) {
            const n = parseInt(match.groups.num) || 0;
            const idx = n === 5 ? 0 : n;
            return dict[match.groups.syllable][idx];
        }
        return str;
    }).join(' ');
}

/**
 * Split unspaced numbered syllables into space-separated syllables by
 * inserting a space after each tone digit.
 *
 * @param {string} text - e.g. `"han4yu3pin1yin1"`
 * @returns {string} - e.g. `"han4 yu3 pin1 yin1"`
 */
function splitUnspacedSyllables(text) {
    return text
        .replace(/(\d)/g, '$1 ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Convert unspaced numbered pinyin directly to diacritic pinyin without spaces.
 *
 * @param {string} input - e.g. `"han4yu3pin1yin1"`
 * @returns {string} - e.g. `"hànyǔpīnyīn"`
 */
function convertUnspacedPinyin(input) {
    return fromPinyinToneNumbers(splitUnspacedSyllables(input)).split(' ').join('');
}

// ---------------------------------------------------------------------------
// markSinglePinyinVowel
// ---------------------------------------------------------------------------

const SINGLE_VOWEL_DICT = Object.freeze({
    a: 'a',  a0: 'a',  a1: 'ā',  a2: 'á',  a3: 'ǎ',  a4: 'à',  a5: 'a',
    o: 'o',  o0: 'o',  o1: 'ō',  o2: 'ó',  o3: 'ǒ',  o4: 'ò',  o5: 'o',
    e: 'e',  e0: 'e',  e1: 'ē',  e2: 'é',  e3: 'ě',  e4: 'è',  e5: 'e',
    i: 'i',  i0: 'i',  i1: 'ī',  i2: 'í',  i3: 'ǐ',  i4: 'ì',  i5: 'i',
    u: 'u',  u0: 'u',  u1: 'ū',  u2: 'ú',  u3: 'ǔ',  u4: 'ù',  u5: 'u',
    v: 'ü',  v0: 'ü',  v1: 'ǖ',  v2: 'ǘ',  v3: 'ǚ',  v4: 'ǜ',  v5: 'ü',
});

/**
 * Mark a single vowel character (`a`, `o`, `e`, `i`, `u`, `v`) with a tone
 * number (0–5). Both 0 and 5 are treated as the neutral tone. Returns the
 * input unchanged if it is not a recognised vowel+tone combination.
 *
 * @param {string} input - e.g. `"a1"`, `"v3"`, `"a5"`
 * @returns {string}
 */
function markSinglePinyinVowel(input) {
    return SINGLE_VOWEL_DICT[input] ?? input;
}

// ---------------------------------------------------------------------------
// parseDiacriticVowel
// ---------------------------------------------------------------------------

// Toneless diacritic vowels (and ü) that carry no tone mark. Mapped to their
// ASCII base. `ü`/`Ü` fold to `v`, the canonical alias used elsewhere.
const TONELESS_DIACRITIC_MAP = /** @type {Record<string, string>} */ ({
    'ü': 'v', 'Ü': 'v', 'ê': 'e^',
});

/**
 * Parse a single pinyin vowel character — toned (`á`, `ǚ`), bare diacritic
 * (`ü`, `ê`), or plain ASCII (`a`, `v`) — into its ASCII base letter and tone
 * number. Tone 0 means neutral / no tone mark. `ü` (and its toned forms) map
 * to the `v` alias used throughout this library.
 *
 * Returns the input as the `letter` with `tone: 0` if it is not a recognised
 * vowel, so callers can pass through unknown characters safely.
 *
 * @param {string} char - a single character, e.g. `'á'`, `'ǚ'`, `'ü'`, `'a'`
 * @returns {{ letter: string, tone: number }}
 */
function parseDiacriticVowel(char) {
    const toned = DIACRITIC_MAP[char];
    if (toned !== undefined) {
        return { letter: toned[0], tone: toned[1] };
    }
    const toneless = TONELESS_DIACRITIC_MAP[char];
    if (toneless !== undefined) {
        return { letter: toneless, tone: 0 };
    }
    return { letter: char, tone: 0 };
}

export { toPinyinToneNumbers, fromPinyinToneNumbers, splitUnspacedSyllables, convertUnspacedPinyin, markSinglePinyinVowel, parseDiacriticVowel };
