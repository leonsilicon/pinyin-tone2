// test/test-example.js
import { expect } from 'chai';
import {
    toPinyinToneNumbers,
    fromPinyinToneNumbers,
    splitUnspacedSyllables,
    convertUnspacedPinyin,
} from '../index.js';

// ---------------------------------------------------------------------------
// fromPinyinToneNumbers — numbered → diacritics
// ---------------------------------------------------------------------------

describe('fromPinyinToneNumbers (numbered → diacritics)', () => {
    it('converts standard numbered pinyin', () => {
        expect(fromPinyinToneNumbers('chu1 yin1 wei4 lai2')).to.equal('chū yīn wèi lái');
        expect(fromPinyinToneNumbers('xun2 yin1 liu2 ge1')).to.equal('xún yīn liú gē');
        expect(fromPinyinToneNumbers('an1 vn2 ong3 uen4')).to.equal('ān ǘn ǒng uèn');
        expect(fromPinyinToneNumbers('liou2 yuen2')).to.equal('lióu yuén');
        expect(fromPinyinToneNumbers('iou1 uen4')).to.equal('iōu uèn');
        expect(fromPinyinToneNumbers('bong1 tv2 pe3 wir4')).to.equal('bōng tǘ pě wìr');
    });

    it('passes through bare initials unchanged', () => {
        expect(fromPinyinToneNumbers('b p m f')).to.equal('b p m f');
    });

    it('passes through non-pinyin strings unchanged (issue #8)', () => {
        expect(fromPinyinToneNumbers('makkai')).to.equal('makkai');
    });

    it('erhua r-number format (default): huar1 → huār', () => {
        expect(fromPinyinToneNumbers('huar1 renr2 shuir3 yuer4')).to.equal('huār rénr shuǐr yuèr');
    });

    it('erhua r-number format (explicit option): huar1 → huār', () => {
        expect(fromPinyinToneNumbers('huar1 renr2', { erhua: 'r-number' })).to.equal('huār rénr');
    });

    it('erhua number-r format: hua1r → huār', () => {
        expect(fromPinyinToneNumbers('hua1r ren2r shui3r yue4r', { erhua: 'number-r' })).to.equal('huār rénr shuǐr yuèr');
    });

    it('tone 0 is neutral (no diacritic)', () => {
        expect(fromPinyinToneNumbers('ma0')).to.equal('ma');
        expect(fromPinyinToneNumbers('han0')).to.equal('han');
        expect(fromPinyinToneNumbers('ge0')).to.equal('ge');
    });

    it('tone 5 is neutral (same as tone 0)', () => {
        expect(fromPinyinToneNumbers('ma5')).to.equal('ma');
        expect(fromPinyinToneNumbers('han5')).to.equal('han');
        expect(fromPinyinToneNumbers('ge5')).to.equal('ge');
        expect(fromPinyinToneNumbers('ma5 chu1')).to.equal('ma chū');
    });
});

// ---------------------------------------------------------------------------
// toPinyinToneNumbers — diacritics → numbered
// ---------------------------------------------------------------------------

describe('toPinyinToneNumbers (diacritics → numbered)', () => {
    it('converts standard diacritic pinyin', () => {
        expect(toPinyinToneNumbers('chū yīn wèi lái')).to.equal('chu1 yin1 wei4 lai2');
        expect(toPinyinToneNumbers('xún yīn liú gē')).to.equal('xun2 yin1 liu2 ge1');
        expect(toPinyinToneNumbers('ān ǘn ǒng uèn')).to.equal('an1 vn2 ong3 uen4');
        expect(toPinyinToneNumbers('lióu yuén')).to.equal('liou2 yuen2');
        expect(toPinyinToneNumbers('iōu uèn')).to.equal('iou1 uen4');
        expect(toPinyinToneNumbers('bōng tǘ pě wìr')).to.equal('bong1 tv2 pe3 wir4');
    });

    it('passes through non-diacritic tokens unchanged', () => {
        expect(toPinyinToneNumbers('b p m f')).to.equal('b p m f');
        expect(toPinyinToneNumbers('makkai')).to.equal('makkai');
    });

    it('neutral-tone syllables (no diacritics) default to no number suffix', () => {
        expect(toPinyinToneNumbers('ma')).to.equal('ma');
        expect(toPinyinToneNumbers('han')).to.equal('han');
    });

    it('neutralToneNumber: none (default) — no suffix', () => {
        expect(toPinyinToneNumbers('ma', { neutralToneNumber: 'none' })).to.equal('ma');
        expect(toPinyinToneNumbers('chū ma lái', { neutralToneNumber: 'none' })).to.equal('chu1 ma lai2');
    });

    it('neutralToneNumber: 0 — appends 0 to neutral-tone syllables', () => {
        expect(toPinyinToneNumbers('ma', { neutralToneNumber: '0' })).to.equal('ma0');
        expect(toPinyinToneNumbers('chū ma lái', { neutralToneNumber: '0' })).to.equal('chu1 ma0 lai2');
        expect(toPinyinToneNumbers('nǐ hǎo ma', { neutralToneNumber: '0' })).to.equal('ni3 hao3 ma0');
    });

    it('neutralToneNumber: 5 — appends 5 to neutral-tone syllables', () => {
        expect(toPinyinToneNumbers('ma', { neutralToneNumber: '5' })).to.equal('ma5');
        expect(toPinyinToneNumbers('chū ma lái', { neutralToneNumber: '5' })).to.equal('chu1 ma5 lai2');
        expect(toPinyinToneNumbers('nǐ hǎo ma', { neutralToneNumber: '5' })).to.equal('ni3 hao3 ma5');
    });

    it('erhua r-number format (default): huār → huar1', () => {
        expect(toPinyinToneNumbers('huār rénr shuǐr yuèr')).to.equal('huar1 renr2 shuir3 yuer4');
    });

    it('erhua r-number format (explicit option): huār → huar1', () => {
        expect(toPinyinToneNumbers('huār rénr', { erhua: 'r-number' })).to.equal('huar1 renr2');
    });

    it('erhua number-r format: huār → hua1r', () => {
        expect(toPinyinToneNumbers('huār rénr shuǐr yuèr', { erhua: 'number-r' })).to.equal('hua1r ren2r shui3r yue4r');
    });

    it('ü diacritic forms round-trip to v-based numbered form', () => {
        expect(toPinyinToneNumbers('ǘn')).to.equal('vn2');
        expect(toPinyinToneNumbers('ǚ')).to.equal('v3');
    });

    it('round-trips with fromPinyinToneNumbers (r-number)', () => {
        const inputs = ['chu1 yin1 wei4 lai2', 'huar1 renr2', 'an1 vn2 ong3 uen4'];
        for (const input of inputs) {
            expect(toPinyinToneNumbers(fromPinyinToneNumbers(input))).to.equal(input);
        }
    });

    it('round-trips with fromPinyinToneNumbers (number-r)', () => {
        const opts = { erhua: /** @type {'number-r'} */ ('number-r') };
        const inputs = ['chu1 yin1 wei4 lai2', 'hua1r ren2r'];
        for (const input of inputs) {
            expect(toPinyinToneNumbers(fromPinyinToneNumbers(input, opts), opts)).to.equal(input);
        }
    });

    it('round-trips neutral tone with neutralToneNumber: 0', () => {
        const opts = { neutralToneNumber: /** @type {'0'} */ ('0') };
        const inputs = ['ma0', 'chu1 ma0 lai2'];
        for (const input of inputs) {
            expect(toPinyinToneNumbers(fromPinyinToneNumbers(input), opts)).to.equal(input);
        }
    });

    it('round-trips neutral tone with neutralToneNumber: 5', () => {
        const opts = { neutralToneNumber: /** @type {'5'} */ ('5') };
        // fromPinyinToneNumbers accepts 5 as neutral; toPinyinToneNumbers outputs 5
        const inputs = ['ma5', 'chu1 ma5 lai2'];
        for (const input of inputs) {
            expect(toPinyinToneNumbers(fromPinyinToneNumbers(input), opts)).to.equal(input);
        }
    });
});

// ---------------------------------------------------------------------------
// splitUnspacedSyllables / convertUnspacedPinyin (issue #16)
// ---------------------------------------------------------------------------

describe('splitUnspacedSyllables', () => {
    it('splits by tone digits', () => {
        expect(splitUnspacedSyllables('han4yu3pin1yin1')).to.equal('han4 yu3 pin1 yin1');
        expect(splitUnspacedSyllables('han4yu3  pin1yin1')).to.equal('han4 yu3 pin1 yin1');
        expect(splitUnspacedSyllables('han yu3  pin1yin1')).to.equal('han yu3 pin1 yin1');
        expect(splitUnspacedSyllables('han0  yu3  pin1yin1  ')).to.equal('han0 yu3 pin1 yin1');
        expect(splitUnspacedSyllables('han5yu3pin1yin1')).to.equal('han5 yu3 pin1 yin1');
    });
});

describe('convertUnspacedPinyin', () => {
    it('converts unspaced numbered pinyin to diacritic pinyin', () => {
        expect(convertUnspacedPinyin('han4yu3pin1yin1')).to.equal('hànyǔpīnyīn');
        expect(convertUnspacedPinyin('han4 yu3  pin1   yin1')).to.equal('hànyǔpīnyīn');
        expect(convertUnspacedPinyin('han0yu3  pin1yin1')).to.equal('hanyǔpīnyīn');
        expect(convertUnspacedPinyin('han0   yur3  pin1yin1')).to.equal('hanyǔrpīnyīn');
        expect(convertUnspacedPinyin('han yu3pin1yin1')).to.equal('hanyǔpīnyīn');
        expect(convertUnspacedPinyin('hanyu3pin1yin1')).to.equal('hanyu3pīnyīn');
        expect(convertUnspacedPinyin('han5yu3pin1yin1')).to.equal('hanyǔpīnyīn');
    });
});
