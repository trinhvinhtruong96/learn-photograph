import { describe, expect, test } from 'vitest';
import { analyze, checkSection, countSyllables, extractSections, extractUnits, splitSentences } from '../scripts/readability-lib.js';

describe('syllables', () => {
  test.each([['cat', 1], ['camera', 3], ['aperture', 3], ['photography', 4], ['shutter', 2], ['exposure', 3], ['simple', 2], ['focused', 2], ['f/2.8', 1], ['1/250', 1]])(
    '%s has %i', (word, n) => expect(countSyllables(word)).toBe(n));
});

describe('sentences', () => {
  test('splits on end punctuation but not inside numbers', () => {
    expect(splitSentences('Set f/2.8 now. Then shoot at 1/250 s. Done!')).toEqual(['Set f/2.8 now.', 'Then shoot at 1/250 s.', 'Done!']);
    expect(splitSentences('Use f/1.4 and 1.5 m.')).toEqual(['Use f/1.4 and 1.5 m.']);
  });
});

describe('extraction', () => {
  test('skips headings, SVG, tables and callout labels', () => {
    const units = extractUnits('<h2>Title here</h2><div class="callout"><span class="callout-label">In one sentence</span><p>Light makes the photo.</p></div><svg><text>Label</text></svg><table><tr><td>f/2</td></tr></table>');
    expect(units).toEqual([{ type: 'p', text: 'Light makes the photo.' }]);
  });
  test('a list item with paragraphs is counted once, through its paragraphs', () => {
    const units = extractUnits('<ul><li><p class="mistake">Wrong idea.</p><p class="fix">Right idea.</p></li><li>Plain item</li></ul>');
    expect(units.map((u) => u.text).sort()).toEqual(['Plain item', 'Right idea.', 'Wrong idea.']);
  });
  test('nested lists are rejected', () => {
    expect(() => extractUnits('<ul><li>One <ul><li>Two</li></ul></li></ul>')).toThrow('Nested lists');
  });
  test('only sections with data-read are checked', () => {
    const sections = extractSections('<section id="a" data-read="lesson"><p>Hi there.</p></section><section id="b"><p>Skip.</p></section><section id="c" data-read="tech"><dl><dt>Stop</dt><dd>A step of light.</dd></dl></section>');
    expect(sections.map((s) => [s.id, s.kind])).toEqual([['a', 'lesson'], ['c', 'tech']]);
    expect(sections[1].units).toEqual([{ type: 'dd', text: 'A step of light.' }]);
  });
  test('entities are decoded', () => {
    expect(extractUnits('<p>Shade &amp; sun &#8594; done.</p>')[0].text).toBe('Shade & sun → done.');
  });
});

describe('metrics and targets', () => {
  test('short plain sentences score as easy', () => {
    const m = analyze([{ type: 'p', text: 'The cat sat. The dog ran.' }]);
    expect(m.sentences).toBe(2);
    expect(m.words).toBe(6);
    expect(m.avgSentence).toBe(3);
    expect(m.fre).toBeGreaterThan(90);
  });
  test('reports a sentence over 25 words', () => {
    const long = `${Array.from({ length: 30 }, () => 'word').join(' ')}.`;
    const problems = checkSection('lesson', analyze([{ type: 'li', text: long }]));
    expect(problems.some((p) => p.startsWith('Longest sentence has 30 words'))).toBe(true);
  });
  test('reports a paragraph with more than 3 sentences', () => {
    const problems = checkSection('lesson', analyze([{ type: 'p', text: 'One. Two. Three. Four.' }]));
    expect(problems.some((p) => p.startsWith('Paragraph too long'))).toBe(true);
  });
  test('tech sections have a lower Reading Ease bar', () => {
    const metrics = { sentences: 5, fre: 55, grade: 6, avgSentence: 10, maxSentence: 12, longest: '', paragraphs: [] };
    expect(checkSection('lesson', metrics)).toHaveLength(1);
    expect(checkSection('tech', metrics)).toHaveLength(0);
  });
  test('an empty section is a problem', () => {
    expect(checkSection('lesson', analyze([]))).toEqual(['no text found']);
  });
});
