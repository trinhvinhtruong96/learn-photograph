export const TARGETS = {
  lesson: { fre: 60, grade: 7 },
  tech: { fre: 50, grade: 9 },
  avgSentence: 15,
  maxSentence: 25,
  paragraphSentences: 3,
  paragraphWords: 60,
};

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  ndash: '–', mdash: '—', hellip: '…', times: '×', rarr: '→', asymp: '≈', deg: '°', minus: '−', middot: '·',
};

const REMOVE = [
  /<svg\b[\s\S]*?<\/svg>/gi,
  /<table\b[\s\S]*?<\/table>/gi,
  /<script\b[\s\S]*?<\/script>/gi,
  /<h[1-6]\b[\s\S]*?<\/h[1-6]>/gi,
  /<span class="callout-label">[\s\S]*?<\/span>/gi,
];

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const value = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return String.fromCodePoint(value);
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
}

export function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 1; // numbers and notation such as f/2.8 or 1/250
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 0);
}

export function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+(?=[^a-z])/)
    .map((s) => s.trim())
    .filter((s) => /[A-Za-z0-9]/.test(s));
}

export function wordsOf(sentence) {
  return sentence.split(/\s+/).filter((t) => /[A-Za-z0-9]/.test(t));
}

export function extractUnits(html) {
  let body = html;
  for (const re of REMOVE) body = body.replace(re, ' ');
  const units = [];
  for (const match of body.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
    if (/<(ul|ol)\b/i.test(match[1])) throw new Error('Nested lists are not allowed in checked sections');
    if (/<p\b/i.test(match[1])) continue;
    units.push({ type: 'li', text: stripTags(match[1]) });
  }
  for (const match of body.matchAll(/<(p|dd|summary|figcaption)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    units.push({ type: match[1].toLowerCase(), text: stripTags(match[2]) });
  }
  return units.filter((u) => u.text);
}

export function extractSections(html) {
  const sections = [];
  for (const match of html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)) {
    const kind = /data-read="(lesson|tech)"/.exec(match[1])?.[1];
    if (!kind) continue;
    const id = /\bid="([^"]+)"/.exec(match[1])?.[1] ?? '(no id)';
    try {
      sections.push({ id, kind, units: extractUnits(match[2]) });
    } catch (error) {
      throw new Error(`Section ${id}: ${error.message}`);
    }
  }
  return sections;
}

export function analyze(units) {
  let sentences = 0;
  let words = 0;
  let syllables = 0;
  let maxSentence = 0;
  let longest = '';
  const paragraphs = [];
  for (const unit of units) {
    const parts = splitSentences(unit.text);
    let unitWords = 0;
    for (const sentence of parts) {
      const w = wordsOf(sentence);
      sentences += 1;
      words += w.length;
      unitWords += w.length;
      syllables += w.reduce((n, word) => n + countSyllables(word), 0);
      if (w.length > maxSentence) {
        maxSentence = w.length;
        longest = sentence;
      }
    }
    if (unit.type === 'p') paragraphs.push({ text: unit.text, sentences: parts.length, words: unitWords });
  }
  const wps = sentences ? words / sentences : 0;
  const spw = words ? syllables / words : 0;
  return {
    sentences,
    words,
    fre: sentences ? 206.835 - 1.015 * wps - 84.6 * spw : 0,
    grade: sentences ? 0.39 * wps + 11.8 * spw - 15.59 : 0,
    avgSentence: wps,
    maxSentence,
    longest,
    paragraphs,
  };
}

export function checkSection(kind, m) {
  if (m.sentences === 0) return ['no text found'];
  const target = TARGETS[kind];
  const problems = [];
  if (m.fre < target.fre) problems.push(`Reading Ease ${m.fre.toFixed(0)} is below ${target.fre}`);
  if (m.grade > target.grade) problems.push(`Grade ${m.grade.toFixed(1)} is above ${target.grade}`);
  if (m.avgSentence > TARGETS.avgSentence) {
    problems.push(`Average sentence ${m.avgSentence.toFixed(1)} words is above ${TARGETS.avgSentence}`);
  }
  if (m.maxSentence > TARGETS.maxSentence) problems.push(`Longest sentence has ${m.maxSentence} words: "${m.longest}"`);
  for (const p of m.paragraphs) {
    if (p.sentences > TARGETS.paragraphSentences || p.words > TARGETS.paragraphWords) {
      problems.push(`Paragraph too long (${p.sentences} sentences, ${p.words} words): "${p.text.slice(0, 80)}…"`);
    }
  }
  return problems;
}
