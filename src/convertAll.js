import { readdir, readFile, mkdir, writeFile, access } from 'fs/promises';

import json2md from 'json2md';

import { convertText } from './utils/convertText.js';

const dirs = await readdir(new URL('../data', import.meta.url));

const report = [];

report.push({ h1: 'List of datasets' });

const dataset = [];
report.push({
  table: {
    headers: ['Dataset', 'Property', 'Information', 'Number of entries'],
    rows: dataset,
  },
});

for (let dir of dirs) {
  try {
    await access(new URL(`../data/${dir}/options.js`, import.meta.url));
  } catch (e) {
    console.log(`No options for ${dir}`);
    continue;
  }

  const { options } = await import(`../data/${dir}/options.js`);

  if (!options.format) {
    console.log(`No format for ${dir}`);
    continue;
  }
  await mkdir(new URL(`../docs/${dir}`, import.meta.url), { recursive: true });
  const files = (
    await readdir(new URL(`../data/${dir}`, import.meta.url))
  ).filter((file) => file !== 'options.js');
  for (let file of files) {
    const text = await readFile(
      new URL(`../data/${dir}/${file}`, import.meta.url),
      'utf8',
    );
    let result = {};
    switch (options.format) {
      case 'csv':
      case 'tsv': {
        result = convertText(text, options);
        break;
      }
      default:
        console.log(`Unknown format ${options.format} for ${dir}`);
    }
    if (result) {
      const newFilename = file.replace(/\..*?$/, '.json');
      writeFile(
        new URL(`../docs/${dir}/${newFilename}`, import.meta.url),
        JSON.stringify(result),
        { encoding: 'utf8' },
      );
      dataset.push([newFilename, '', options.info || '', result.length]);
    }
  }
}

await writeFile(
  new URL('../docs/README.md', import.meta.url),
  json2md(report),
  'utf8',
);
