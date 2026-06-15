// Special syllables: standalone interjections and the rare ê vowel.
//
// Indexing convention: index 0 is the neutral/toneless form, indices 1-4 are
// tones 1-4. Combining diacritics are used where no precomposed codepoint
// exists (m̄, m̌, m̀, n̄, ê̄, ê̌). Strings are in NFC.
//
// Numbered form for ê uses the ASCII alias `e^` (e.g. `e^2` ⟷ `ế`).
export default {
    // ê — rare standalone vowel used in interjections like 欸
    'e^': ['ê', 'ê̄', 'ế', 'ê̌', 'ề'],

    // Syllabic m — interjections like 呒 / 嘸
    m: ['m', 'm̄', 'ḿ', 'm̌', 'm̀'],

    // Syllabic n — interjections like 嗯
    n: ['n', 'n̄', 'ń', 'ň', 'ǹ'],

    // Syllabic ng — interjections (e.g. 嗯 ńg)
    ng: ['ng', 'n̄g', 'ńg', 'ňg', 'ǹg'],

    // hm / hng — onomatopoeic interjections (no documented tone-1 form in
    // common dictionaries; tone-2 is the canonical reading)
    hm: ['hm', 'hm', 'hḿ', 'hm', 'hm'],
    hng: ['hng', 'hng', 'hńg', 'hng', 'hng'],

    // Standalone erhua final 儿 (CC-CEDICT `r5`). It only occurs as a
    // neutral-tone suffix particle and carries no tone mark, so every tone
    // slot folds to bare `r`.
    r: ['r', 'r', 'r', 'r', 'r'],
};
