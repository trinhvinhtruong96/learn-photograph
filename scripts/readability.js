import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyze, checkSection, extractSections } from './readability-lib.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const files = args.length
  ? args
  : ['index.html', ...readdirSync(join(root, 'stages')).filter((f) => f.endsWith('.html')).map((f) => `stages/${f}`)];

let failed = false;
for (const file of files) {
  const html = readFileSync(join(root, file), 'utf8');
  let sections;
  try {
    sections = extractSections(html);
  } catch (error) {
    console.log(`✗ ${file}: ${error.message}`);
    failed = true;
    continue;
  }
  if (sections.length === 0) {
    console.log(`✗ ${file}: no sections marked with data-read`);
    failed = true;
    continue;
  }
  console.log(`\n${file}`);
  for (const section of sections) {
    const m = analyze(section.units);
    const problems = checkSection(section.kind, m);
    const mark = problems.length ? '✗' : '✓';
    console.log(
      `  ${mark} ${section.id.padEnd(24)} ${section.kind.padEnd(6)} FRE ${m.fre.toFixed(0).padStart(3)}  grade ${m.grade.toFixed(1).padStart(4)}  avg ${m.avgSentence.toFixed(1).padStart(4)}  max ${String(m.maxSentence).padStart(2)}`,
    );
    for (const problem of problems) console.log(`      - ${problem}`);
    if (problems.length) failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
