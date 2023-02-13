export function appendMolecularFormulaFingerprint(data, options = {}) {
  const { minOccurrence = 10 } = options;
  const allAtomsSet = {};
  for (const datum of data) {
    const atomFeatures = datum.topologicalProperties.atoms;
    for (let key in atomFeatures) {
      if (allAtomsSet[key]) {
        allAtomsSet[key].counter += atomFeatures[key];
      } else {
        allAtomsSet[key] = { counter: atomFeatures[key] };
      }
    }
  }

  const atomFingerprint = [{ label: 'undefined', counter: 0 }];
  let index = 1;
  for (let key in allAtomsSet) {
    if (allAtomsSet[key].counter > minOccurrence) {
      atomFingerprint.push({ label: key, counter: allAtomsSet[key].counter });
      allAtomsSet[key].index = index++;
    } else {
      atomFingerprint[0].counter += allAtomsSet[key].counter;
      allAtomsSet[key].index = 0;
    }
  }

  for (let datum of data) {
    const currentAtomFingerprint = datum.topologicalProperties.atoms;
    const fingerprint = new Array(atomFingerprint.length).fill(0);
    for (let key in currentAtomFingerprint) {
      const position = allAtomsSet[key].index;
      fingerprint[position] = currentAtomFingerprint[key];
    }
    datum.fingerprints.atoms = fingerprint;
  }
  return { usedAtomsFeatures: atomFingerprint };
}
