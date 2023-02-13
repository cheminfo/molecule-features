import { MF } from 'mf-parser';
import OCL from 'openchemlib/full.js';
import {
  getConnectivityMatrix,
  getMF,
  getAtomFeatures,
} from 'openchemlib-utils';
import Papa from 'papaparse';

import { appendAtomFeatureFingerprint } from './appendAtomFeatureFingerprint.js';
import { appendMolecularFormulaFingerprint } from './appendMolecularFormulaFingerprint.js';

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
    smilesFieldName = 'smiles',
    minAtomFeatureOccurrence = 10,
    targets = [],
    validator = (molecule, mfInfo) => {
      return molecule.getAtoms() < 32;
    },
  } = options;

  let lines = Papa.parse(text, papaParseOptions).data.slice(0, 500000);

  const entries = [];
  const fingerprintInfo = {};
  let counter = 0;
  for (let line of lines) {
    if (counter++ % 250 === 0) {
      console.log(`${counter} / ${lines.length}`);
    }
    if (!line[smilesFieldName]) continue;

    const molecule = Molecule.fromSmiles(line[smilesFieldName]);
    const mf = getMF(molecule);
    const mfInfo = new MF(mf.mf).getInfo();
    if (!validator(molecule, mfInfo)) continue;

    const connectivityMatrix = getConnectivityMatrix(molecule, {
      sdta: true,
      atomicNo: true,
    });
    const targetValues = {};
    for (const target of targets) {
      if (!target.alias) continue;
      targetValues[target.alias] = Number(line[target.name]);
    }

    const product = {
      connectivityMatrix,
      smiles: line.SMILES,
      canonicSmiles: molecule.toSmiles(),
      targets: targetValues,
      ...getProperties(molecule, mfInfo),
      fingerprints: { ocl: getIndexes(molecule) },
      atomFeatures: {
        sphere1: getAtomFeatures(molecule, { sphere: 1 }),
        sphere2: getAtomFeatures(molecule, { sphere: 2 }),
      },
    };
    entries.push(product);
  }
  fingerprintInfo.sphere1AtomFeature = appendAtomFeatureFingerprint(entries, {
    sphere: 1,
    minOccurrence: minAtomFeatureOccurrence,
  }).usedAtomsFeatures;
  fingerprintInfo.sphere2AtomFeature = appendAtomFeatureFingerprint(entries, {
    sphere: 2,
    minOccurrence: minAtomFeatureOccurrence,
  }).usedAtomsFeatures;

  fingerprintInfo.atoms = appendMolecularFormulaFingerprint(entries, {
    sphere: 2,
    minOccurrence: minAtomFeatureOccurrence,
  }).usedAtomsFeatures;
  return { entries, fingerprintInfo };
}

function getProperties(molecule, mfInfo) {
  const properties = new MoleculeProperties(molecule);
  return {
    predictedProperties: {
      logP: properties.logP,
      logS: properties.logS,
    },
    topologicalProperties: {
      nbHBondAcceptors: properties.acceptorCount,
      nbHBondDonors: properties.donorCount,
      polarSurfaceArea: properties.polarSurfaceArea,
      nbRotatableBonds: properties.rotatableBondCount,
      nbStereoCenters: properties.stereoCenterCount,
      ...mfInfo,
    },
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
