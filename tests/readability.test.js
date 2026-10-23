import { describe, expect, test } from 'vitest';
import { TARGETS, analyze, checkSection, extractSections, extractUnits, splitSentences, wordsOf } from '../scripts/readability-lib.js';

describe('sentences', () => {
  test('splits on end punctuation but not inside numbers', () => {
    expect(splitSentences('Đặt f/2.8 nhé. Sau đó chụp ở 1/250 giây. Xong!')).toEqual(['Đặt f/2.8 nhé.', 'Sau đó chụp ở 1/250 giây.', 'Xong!']);
    expect(splitSentences('Dùng f/1.4 và 1,5 m.')).toEqual(['Dùng f/1.4 và 1,5 m.']);
  });
  test('a sentence may start with an accented capital letter', () => {
    expect(splitSentences('Trời tối. Ánh sáng đèn rất đẹp.')).toEqual(['Trời tối.', 'Ánh sáng đèn rất đẹp.']);
  });
  test('a Vietnamese lowercase letter after a period does not start a new sentence', () => {
    expect(splitSentences('Chụp ở 1/250 giây. đó là tốc độ an toàn.')).toEqual(['Chụp ở 1/250 giây. đó là tốc độ an toàn.']);
  });
});

describe('words', () => {
  test('counts each Vietnamese syllable and number as one word, ignoring symbols', () => {
    expect(wordsOf('Ánh sáng mềm → f/2.8 ở 1,9 m.')).toEqual(['Ánh', 'sáng', 'mềm', 'f/2.8', 'ở', '1,9', 'm.']);
  });
});

describe('extraction', () => {
  test('skips headings, SVG, tables and callout labels', () => {
    const units = extractUnits('<h2>Tiêu đề</h2><div class="callout"><span class="callout-label">Tóm tắt một câu</span><p>Ánh sáng tạo nên bức ảnh.</p></div><svg><text>Nhãn</text></svg><table><tr><td>f/2</td></tr></table>');
    expect(units).toEqual([{ type: 'p', text: 'Ánh sáng tạo nên bức ảnh.' }]);
  });
  test('a list item with paragraphs is counted once, through its paragraphs', () => {
    const units = extractUnits('<ul><li><p class="mistake">Hiểu sai.</p><p class="fix">Hiểu đúng.</p></li><li>Mục thường</li></ul>');
    expect(units.map((u) => u.text).sort()).toEqual(['Hiểu sai.', 'Hiểu đúng.', 'Mục thường']);
  });
  test('nested lists are rejected', () => {
    expect(() => extractUnits('<ul><li>Một <ul><li>Hai</li></ul></li></ul>')).toThrow('Nested lists');
  });
  test('only sections with data-read are checked', () => {
    const sections = extractSections('<section id="a" data-read="lesson"><p>Xin chào.</p></section><section id="b"><p>Bỏ qua.</p></section><section id="c" data-read="tech"><dl><dt>Stop</dt><dd>Một bước sáng.</dd></dl></section>');
    expect(sections.map((s) => [s.id, s.kind])).toEqual([['a', 'lesson'], ['c', 'tech']]);
    expect(sections[1].units).toEqual([{ type: 'dd', text: 'Một bước sáng.' }]);
  });
  test('entities are decoded', () => {
    expect(extractUnits('<p>Nắng &amp; bóng râm &#8594; xong.</p>')[0].text).toBe('Nắng & bóng râm → xong.');
  });
});

describe('metrics and targets', () => {
  test('counts sentences and words', () => {
    const m = analyze([{ type: 'p', text: 'Trời tối dần. Đèn đường bật sáng.' }]);
    expect(m.sentences).toBe(2);
    expect(m.words).toBe(7);
    expect(m.avgSentence).toBe(3.5);
  });
  test('short sentences pass', () => {
    expect(checkSection(analyze([{ type: 'p', text: 'Trời tối dần. Đèn đường bật sáng.' }]))).toEqual([]);
  });
  test(`reports a sentence over ${TARGETS.maxSentence} words`, () => {
    const long = `${Array.from({ length: 40 }, () => 'chữ').join(' ')}.`;
    expect(checkSection(analyze([{ type: 'li', text: long }])).some((p) => p.startsWith('Longest sentence has 40 words'))).toBe(true);
  });
  test(`reports an average above ${TARGETS.avgSentence} words per sentence`, () => {
    const s = `${Array.from({ length: 24 }, () => 'chữ').join(' ')}.`;
    expect(checkSection(analyze([{ type: 'li', text: s }, { type: 'li', text: s }])).some((p) => p.startsWith('Average sentence 24.0 words'))).toBe(true);
  });
  test('reports a paragraph with more than 3 sentences', () => {
    expect(checkSection(analyze([{ type: 'p', text: 'Một. Hai. Ba. Bốn.' }])).some((p) => p.startsWith('Paragraph too long'))).toBe(true);
  });
  test(`reports a paragraph over ${TARGETS.paragraphWords} words`, () => {
    const s = `${Array.from({ length: 31 }, () => 'chữ').join(' ')}.`;
    expect(checkSection(analyze([{ type: 'p', text: `${s} ${s} ${s}`.replace(/\. chữ/g, '. Chữ') }])).some((p) => p.startsWith('Paragraph too long'))).toBe(true);
  });
  test('an empty section is a problem', () => {
    expect(checkSection(analyze([]))).toEqual(['no text found']);
  });
});
