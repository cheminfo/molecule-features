import { readFile } from 'fs/promises';

import { convertText } from '../convertText.js';

describe('convertText', () => {
  it('simple text', async () => {
    const text = await readFile(
      new URL('data/melting.csv', import.meta.url),
      'utf8',
    );
    convertText(text);
  });
});
