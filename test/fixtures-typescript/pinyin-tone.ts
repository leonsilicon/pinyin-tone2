import {
    toPinyinToneNumbers,
    fromPinyinToneNumbers,
    splitUnspacedSyllables,
    convertUnspacedPinyin,
    markSinglePinyinVowel,
} from '../../index.js';

// diacritics → numbered
toPinyinToneNumbers('chū yīn wèi lái');
toPinyinToneNumbers('huār', { erhua: 'r-number' });
toPinyinToneNumbers('huār', { erhua: 'number-r' });
toPinyinToneNumbers('ma', { neutralToneNumber: 'none' });
toPinyinToneNumbers('ma', { neutralToneNumber: '0' });
toPinyinToneNumbers('ma', { neutralToneNumber: '5' });

// numbered → diacritics
fromPinyinToneNumbers('chu1 yin1 wei4 lai2');
fromPinyinToneNumbers('huar1', { erhua: 'r-number' });
fromPinyinToneNumbers('hua1r', { erhua: 'number-r' });
fromPinyinToneNumbers('ma0');
fromPinyinToneNumbers('ma5');

// utilities
splitUnspacedSyllables('han4yu3pin1yin1');
convertUnspacedPinyin('han4yu3pin1yin1');
markSinglePinyinVowel('a1');
markSinglePinyinVowel('a5');
