import { readdir, readFile, mkdir, writeFile, stat } from 'fs/promises';

import json2md from 'json2md';
import YAML from 'yaml';

import { convertText } from './utils/convertText.js';

const dirs = await readdir(new URL('../data', import.meta.url));

const report = [];
const toc = [];

report.push({ h1: 'List of datasets' });

const dataset = [];
report.push({
  table: {
    headers: ['Dataset', 'Property', 'Information', 'Number of entries'],
    rows: dataset,
  },
});

for (let dir of dirs) {
  let options = {};
  let meta = {};

  const dirStat = await stat(new URL(`../data/${dir}`, import.meta.url));
  if (!dirStat.isDirectory()) continue;

  try {
    options = (await import(`../data/${dir}/options.js`)).options;
  } catch (e) {
    try {
      options = (await import(`../data/defaultoptions.js`)).options;
    } catch (e) {
      throw new Error('Cannot find options.js');
    }
  }

  try {
    meta = YAML.parse(
      await readFile(
        new URL(`../data/${dir}/meta.yaml`, import.meta.url),
        'utf8',
      ),
    );
  } catch (e) {
    console.log(`No meta.yml for ${dir}`);
  }

  if (!options.format) {
    console.log(`No format for ${dir}`);
    continue;
  }

  console.log(`Processing: ${dir}`);
  await mkdir(new URL(`../docs/${dir}`, import.meta.url), { recursive: true });
  const files = (
    await readdir(new URL(`../data/${dir}`, import.meta.url))
  ).filter((file) => file !== 'options.js');

  if (meta.targets) options.targets = meta.targets;
  if (
    options.targets.filter((target) => target.alias !== undefined).length === 0
  ) {
    console.log('Skipping because no target alias defined');
    continue;
  }
  if (meta.smiles_col) options.smilesFieldName = meta.smiles_col;

  for (let file of files) {
    if (!file.match(/\.(tsv|csv)$/i)) continue;
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
    if (result?.entries?.length) {
      const newFilename = file.replace(/\..*?$/, '.json');
      result.dir = dir;
      result.newFilename = newFilename;
      result.meta = meta;
      writeFile(
        new URL(`../docs/${dir}/${newFilename}`, import.meta.url),
        JSON.stringify(result),
        { encoding: 'utf8' },
      );
      dataset.push({
        Dataset: `${dir}/${newFilename}`,
        Property: '',
        Information: options.info || '',
        'Number of entries': result.entries.length,
      });
      report.push(...getReportDetails(result));
      toc.push(getTocDetails(result));
    }
  }
}

await writeFile(
  new URL('../docs/README.md', import.meta.url),
  json2md(report),
  'utf8',
);

await writeFile(
  new URL('../docs/index.json', import.meta.url),
  JSON.stringify(toc, null, 2),
  'utf8',
);

function getTocDetails(result) {
  return {
    ...result.meta,
    nbEntries: result.entrieslength,
    targets: getTargets,
    url: `https://cheminfo.github.io/molecule-features/${result.dir}/${result.newFilename}`,
  };
}

function getReportDetails(result) {
  const targets = getTargets(result);
  return [
    {
      h2: `${result.dir}/${result.newFilename} - Nb entries: ${result.entries.length}`,
    },
    {
      link: {
        title: 'Link to the data',
        source: `https://cheminfo.github.io/molecule-features/${result.dir}/${result.newFilename}`,
      },
    },
    { blockquote: result.meta.description },
    { h3: 'Available targets:' },
    { table: { headers: ['Property', 'Description', 'Units'], rows: targets } },
  ];
}

function getTargets(result) {
  return result.meta.targets
    .filter((target) => target.alias !== undefined)
    .map((target) => {
      return {
        Property: target.alias,
        Description: target.description || '',
        Units: target.units || '',
      };
    });
}
