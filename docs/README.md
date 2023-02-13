# List of datasets

| Dataset                 | Property | Information | Number of entries |
| ----------------------- | -------- | ----------- | ----------------- |
| aquasoldb/data.json     |          |             | 9                 |
| clintox/data.json       |          |             | 10                |
| esol/data.json          |          |             | 10                |
| flashpoint/data.json    |          |             | 10                |
| freesolv/data.json      |          |             | 10                |
| lipophilicity/data.json |          |             | 10                |
| mp/data.json            |          |             | 9                 |
| somas/data.json         |          |             | 10                |

## aquasoldb/data.json - Nb entries: 9

> Curation of nine open source datasets on aqueous solubility.
> The authors also assigned reliability groups.

### Available targets:

| Property     | Description                                  | Units      |
| ------------ | -------------------------------------------- | ---------- |
| experimental | Experimental aqueous solubility value (LogS) | log(mol/L) |

## clintox/data.json - Nb entries: 10

> Drug molecule approved by the FDA and molecule that have failed clinical trials for toxicity reasons.
> List of FDA-approved drugs are compiled from the SWEETLEAD database, and list of drugs that failed clinical trials for toxicity reasons are compiled from the Aggregate Analysis of ClinicalTrials.gov(AACT) database

### Available targets:

| Property | Description                                                            | Units |
| -------- | ---------------------------------------------------------------------- | ----- |
| approved | 1 if the drug is approved by the FDA, 0 otherwise                      |       |
| toxic    | 1 if the drug failed clinical trials for toxicity reasons, 0 otherwise |       |

## esol/data.json - Nb entries: 10

> experimental and calculated small molecule hydration free energies

### Available targets:

| Property     | Description                                   | Units    |
| ------------ | --------------------------------------------- | -------- |
| experimental | experimentally measured hydration free energy | kcal/mol |
| predicted    | calculated hydration free energy              | kcal/mol |

## flashpoint/data.json - Nb entries: 10

> Sun et al. collected a dataset of the flashpoints of 10575 molecules from
> academic papers, the Gelest chemical catalogue, the DIPPR database,
> Lange's Handbook of Chemistry, the Hazardous Chemicals Handbook,
> and the PubChem database.
> Includes flashpoints measured with both open and closed cup methods.

### Available targets:

| Property     | Description                             | Units |
| ------------ | --------------------------------------- | ----- |
| experimental | experimental flashpoint of the molecule | K     |

## freesolv/data.json - Nb entries: 10

> experimental and calculated small molecule hydration free energies

### Available targets:

| Property     | Description                                   | Units    |
| ------------ | --------------------------------------------- | -------- |
| experimental | experimentally measured hydration free energy | kcal/mol |
| calculated   | calculated hydration free energy              | kcal/mol |

## lipophilicity/data.json - Nb entries: 10

> experimentally measured octanol/water partition coefficient (log D at pH 7.4)
> of 4200 compounds curated from the ChEMBL database

### Available targets:

| Property     | Description                             | Units |
| ------------ | --------------------------------------- | ----- |
| experimental | experimentally measured log D at pH 7.4 |       |

## mp/data.json - Nb entries: 9

> Dataset compiled by Patiny et al.

### Available targets:

| Property     | Description                           | Units |
| ------------ | ------------------------------------- | ----- |
| experimental | experimentally measured melting point | C     |

## somas/data.json - Nb entries: 10

> Experimental and calculated solubilities for small molecules.
> Originally proposed for the design of redox-flow batteries.

### Available targets:

| Property     | Description                      | Units |
| ------------ | -------------------------------- | ----- |
| experimental | Experimental solubility in water | mg/mL |
