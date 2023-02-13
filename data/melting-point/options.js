export const options = {
  format: 'tsv',
  description: 'File coming from enamine dataset',
  smilesField: 'SMILES',
  papaParseOptions: { header: true },
  validator: (molecule, mfInfo) => {
    return molecule.getAtoms() < 32;
  },
};
