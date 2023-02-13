import { readFile } from 'fs/promises';

import { convertText } from '../convertText.js';

describe('convertText', () => {
  it('simple text', async () => {
    const text = await readFile(
      new URL('data/melting.csv', import.meta.url),
      'utf8',
    );
    const results = convertText(text, {
      smilesFieldName: 'SMILES',
      targets: [{ name: 'Melting Point {measured, converted}' }],
    });
    console.log(results.info);
  });
});
