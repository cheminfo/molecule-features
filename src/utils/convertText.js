import { MF } from 'mf-parser';
import OCL from 'openchemlib/full.js';
import {
  getConnectivityMatrix,
  getHoseCodesForAtoms,
  getMF,
} from 'openchemlib-utils';
import Papa from 'papaparse';

const { Molecule, MoleculeProperties, SSSearcherWithIndex } = OCL;

const sssearcherWithIndex = new SSSearcherWithIndex();

/**
 *
 * @param {string} text
 * @param {*} options
 */
export function convertText(text, options = {}) {
  const {
    papaParseOptions = { header: true },
    smilesFieldName = 'SMILES',
    validator = (molecule, mfInfo) => {
      return molecule.getAtoms() < 32;
    },
  } = options;

  let lines = Papa.parse(text, papaParseOptions).data.slice(0, 1);

  let products = [];

  for (let line of lines) {
    if (!line.SMILES) continue;
    if (!line.SENTENCE) line.SENTENCE = '';

    const molecule = new Molecule.fromSmiles(line[smilesFieldName]);
    const mf = getMF(molecule);
    const mfInfo = new MF(mf.mf).getInfo();
    if (!validator(molecule, mfInfo)) continue;

    const matrix = getConnectivityMatrix(molecule, {
      sdta: true,
      negativeAtomicNo: true,
    });

    const properties = getProperties(molecule);
    const indexes = getIndexes(molecule);

    const product = {
      matrix,
      smiles: line.SMILES,
      mp: Number(line['Melting Point {measured, converted}']),
      ...properties,
      indexes,
    };

    products.push(product);
  }
  return products;
}

function getProperties(molecule) {
  const properties = new MoleculeProperties(molecule);
  return {
    logP: properties.logP,
    logS: properties.logS,
    nbHBondAcceptors: properties.acceptorCount,
    nbHBondDonors: properties.donorCount,
    polarSurfaceArea: properties.polarSurfaceArea,
    nbRotatableBonds: properties.rotatableBondCount,
    nbStereoCenters: properties.stereoCenterCount,
  };
}

function getIndexes(molecule) {
  const results = [];
  const indexes = sssearcherWithIndex.createIndex(molecule);
  for (let index of indexes) {
    for (let i = 0; i < 32; i++) {
      results.push((index >>> i) & 1);
    }
  }
  return results;
}
