import type { Ion } from '../types';

// ─── SINGLE SOURCE OF TRUTH ───────────────────────────────────────────────────
// Add ions here → all question generators pick them up automatically.

export const IONS: Ion[] = [
  // ── Monatomic Cations +1 ────────────────────────────────────────────────────
  { id: 'li_p1',   symbol: 'Li⁺',       name: 'Lithium',         charge: 1,  type: 'monatomic-cation' },
  { id: 'na_p1',   symbol: 'Na⁺',       name: 'Sodium',          charge: 1,  type: 'monatomic-cation' },
  { id: 'k_p1',    symbol: 'K⁺',        name: 'Potassium',       charge: 1,  type: 'monatomic-cation' },
  { id: 'rb_p1',   symbol: 'Rb⁺',       name: 'Rubidium',        charge: 1,  type: 'monatomic-cation' },
  { id: 'cs_p1',   symbol: 'Cs⁺',       name: 'Cesium',          charge: 1,  type: 'monatomic-cation' },
  { id: 'ag_p1',   symbol: 'Ag⁺',       name: 'Silver',          charge: 1,  type: 'monatomic-cation' },
  { id: 'h_p1',    symbol: 'H⁺',        name: 'Hydrogen',        charge: 1,  type: 'monatomic-cation' },
  { id: 'cu_p1',   symbol: 'Cu⁺',       name: 'Copper(I)',       charge: 1,  type: 'monatomic-cation' },
  { id: 'au_p1',   symbol: 'Au⁺',       name: 'Gold(I)',         charge: 1,  type: 'monatomic-cation' },
  { id: 'hg2_p1',  symbol: 'Hg₂²⁺',    name: 'Mercury(I)',      charge: 1,  type: 'monatomic-cation' },

  // ── Polyatomic Cation +1 ───────────────────────────────────────────────────
  { id: 'nh4_p1',  symbol: 'NH₄⁺',     name: 'Ammonium',        charge: 1,  type: 'polyatomic-cation' },

  // ── Monatomic Cations +2 ────────────────────────────────────────────────────
  { id: 'mg_p2',   symbol: 'Mg²⁺',     name: 'Magnesium',       charge: 2,  type: 'monatomic-cation' },
  { id: 'ca_p2',   symbol: 'Ca²⁺',     name: 'Calcium',         charge: 2,  type: 'monatomic-cation' },
  { id: 'sr_p2',   symbol: 'Sr²⁺',     name: 'Strontium',       charge: 2,  type: 'monatomic-cation' },
  { id: 'ba_p2',   symbol: 'Ba²⁺',     name: 'Barium',          charge: 2,  type: 'monatomic-cation' },
  { id: 'zn_p2',   symbol: 'Zn²⁺',     name: 'Zinc',            charge: 2,  type: 'monatomic-cation' },
  { id: 'cd_p2',   symbol: 'Cd²⁺',     name: 'Cadmium',         charge: 2,  type: 'monatomic-cation' },
  { id: 'pb_p2',   symbol: 'Pb²⁺',     name: 'Lead(II)',        charge: 2,  type: 'monatomic-cation' },
  { id: 'cu_p2',   symbol: 'Cu²⁺',     name: 'Copper(II)',      charge: 2,  type: 'monatomic-cation' },
  { id: 'fe_p2',   symbol: 'Fe²⁺',     name: 'Iron(II)',        charge: 2,  type: 'monatomic-cation' },
  { id: 'ni_p2',   symbol: 'Ni²⁺',     name: 'Nickel(II)',      charge: 2,  type: 'monatomic-cation' },
  { id: 'co_p2',   symbol: 'Co²⁺',     name: 'Cobalt(II)',      charge: 2,  type: 'monatomic-cation' },
  { id: 'mn_p2',   symbol: 'Mn²⁺',     name: 'Manganese(II)',   charge: 2,  type: 'monatomic-cation' },
  { id: 'hg_p2',   symbol: 'Hg²⁺',     name: 'Mercury(II)',     charge: 2,  type: 'monatomic-cation' },
  { id: 'sn_p2',   symbol: 'Sn²⁺',     name: 'Tin(II)',         charge: 2,  type: 'monatomic-cation' },
  { id: 'cr_p2',   symbol: 'Cr²⁺',     name: 'Chromium(II)',    charge: 2,  type: 'monatomic-cation' },
  { id: 'ti_p2',   symbol: 'Ti²⁺',     name: 'Titanium(II)',    charge: 2,  type: 'monatomic-cation' },

  // ── Monatomic Cations +3 ────────────────────────────────────────────────────
  { id: 'al_p3',   symbol: 'Al³⁺',     name: 'Aluminum',        charge: 3,  type: 'monatomic-cation' },
  { id: 'fe_p3',   symbol: 'Fe³⁺',     name: 'Iron(III)',       charge: 3,  type: 'monatomic-cation' },
  { id: 'cr_p3',   symbol: 'Cr³⁺',     name: 'Chromium(III)',   charge: 3,  type: 'monatomic-cation' },
  { id: 'co_p3',   symbol: 'Co³⁺',     name: 'Cobalt(III)',     charge: 3,  type: 'monatomic-cation' },
  { id: 'au_p3',   symbol: 'Au³⁺',     name: 'Gold(III)',       charge: 3,  type: 'monatomic-cation' },
  { id: 'bi_p3',   symbol: 'Bi³⁺',     name: 'Bismuth(III)',    charge: 3,  type: 'monatomic-cation' },
  { id: 'mn_p3',   symbol: 'Mn³⁺',     name: 'Manganese(III)',  charge: 3,  type: 'monatomic-cation' },
  { id: 'ti_p3',   symbol: 'Ti³⁺',     name: 'Titanium(III)',   charge: 3,  type: 'monatomic-cation' },

  // ── Monatomic Cations +4 ────────────────────────────────────────────────────
  { id: 'pb_p4',   symbol: 'Pb⁴⁺',     name: 'Lead(IV)',        charge: 4,  type: 'monatomic-cation' },
  { id: 'sn_p4',   symbol: 'Sn⁴⁺',     name: 'Tin(IV)',         charge: 4,  type: 'monatomic-cation' },
  { id: 'ti_p4',   symbol: 'Ti⁴⁺',     name: 'Titanium(IV)',    charge: 4,  type: 'monatomic-cation' },
  { id: 'mn_p4',   symbol: 'Mn⁴⁺',     name: 'Manganese(IV)',   charge: 4,  type: 'monatomic-cation' },

  // ── Monatomic Anions −1 ─────────────────────────────────────────────────────
  { id: 'f_n1',    symbol: 'F⁻',        name: 'Fluoride',        charge: -1, type: 'monatomic-anion' },
  { id: 'cl_n1',   symbol: 'Cl⁻',       name: 'Chloride',        charge: -1, type: 'monatomic-anion' },
  { id: 'br_n1',   symbol: 'Br⁻',       name: 'Bromide',         charge: -1, type: 'monatomic-anion' },
  { id: 'i_n1',    symbol: 'I⁻',        name: 'Iodide',          charge: -1, type: 'monatomic-anion' },
  { id: 'h_n1',    symbol: 'H⁻',        name: 'Hydride',         charge: -1, type: 'monatomic-anion' },

  // ── Monatomic Anions −2 ─────────────────────────────────────────────────────
  { id: 'o_n2',    symbol: 'O²⁻',       name: 'Oxide',           charge: -2, type: 'monatomic-anion',   oxygenCount: 1 },
  { id: 's_n2',    symbol: 'S²⁻',       name: 'Sulfide',         charge: -2, type: 'monatomic-anion' },
  { id: 'se_n2',   symbol: 'Se²⁻',      name: 'Selenide',        charge: -2, type: 'monatomic-anion' },
  { id: 'te_n2',   symbol: 'Te²⁻',      name: 'Telluride',       charge: -2, type: 'monatomic-anion' },

  // ── Monatomic Anions −3 ─────────────────────────────────────────────────────
  { id: 'n_n3',    symbol: 'N³⁻',       name: 'Nitride',         charge: -3, type: 'monatomic-anion' },
  { id: 'p_n3',    symbol: 'P³⁻',       name: 'Phosphide',       charge: -3, type: 'monatomic-anion' },
  { id: 'as_n3',   symbol: 'As³⁻',      name: 'Arsenide',        charge: -3, type: 'monatomic-anion' },

  // ── Polyatomic Anions −1 ────────────────────────────────────────────────────
  { id: 'oh_n1',      symbol: 'OH⁻',        name: 'Hydroxide',            charge: -1, type: 'polyatomic-anion', oxygenCount: 1 },
  { id: 'no2_n1',     symbol: 'NO₂⁻',       name: 'Nitrite',              charge: -1, type: 'polyatomic-anion', oxygenCount: 2 },
  { id: 'no3_n1',     symbol: 'NO₃⁻',       name: 'Nitrate',              charge: -1, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'hco3_n1',    symbol: 'HCO₃⁻',      name: 'Bicarbonate',          charge: -1, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'hso4_n1',    symbol: 'HSO₄⁻',      name: 'Hydrogen Sulfate',     charge: -1, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'clo_n1',     symbol: 'ClO⁻',       name: 'Hypochlorite',         charge: -1, type: 'polyatomic-anion', oxygenCount: 1 },
  { id: 'clo2_n1',    symbol: 'ClO₂⁻',      name: 'Chlorite',             charge: -1, type: 'polyatomic-anion', oxygenCount: 2 },
  { id: 'clo3_n1',    symbol: 'ClO₃⁻',      name: 'Chlorate',             charge: -1, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'clo4_n1',    symbol: 'ClO₄⁻',      name: 'Perchlorate',          charge: -1, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'mno4_n1',    symbol: 'MnO₄⁻',      name: 'Permanganate',         charge: -1, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'cn_n1',      symbol: 'CN⁻',        name: 'Cyanide',              charge: -1, type: 'polyatomic-anion', oxygenCount: 0 },
  { id: 'ch3coo_n1',  symbol: 'CH₃COO⁻',   name: 'Acetate',              charge: -1, type: 'polyatomic-anion', oxygenCount: 2 },
  { id: 'h2po4_n1',   symbol: 'H₂PO₄⁻',    name: 'Dihydrogen Phosphate', charge: -1, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'scn_n1',     symbol: 'SCN⁻',       name: 'Thiocyanate',          charge: -1, type: 'polyatomic-anion', oxygenCount: 0 },
  { id: 'bro3_n1',    symbol: 'BrO₃⁻',      name: 'Bromate',              charge: -1, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'io3_n1',     symbol: 'IO₃⁻',       name: 'Iodate',               charge: -1, type: 'polyatomic-anion', oxygenCount: 3 },

  // ── Polyatomic Anions −2 ────────────────────────────────────────────────────
  { id: 'co3_n2',     symbol: 'CO₃²⁻',      name: 'Carbonate',            charge: -2, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'so3_n2',     symbol: 'SO₃²⁻',      name: 'Sulfite',              charge: -2, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'so4_n2',     symbol: 'SO₄²⁻',      name: 'Sulfate',              charge: -2, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'cro4_n2',    symbol: 'CrO₄²⁻',     name: 'Chromate',             charge: -2, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'cr2o7_n2',   symbol: 'Cr₂O₇²⁻',    name: 'Dichromate',           charge: -2, type: 'polyatomic-anion', oxygenCount: 7 },
  { id: 'hpo4_n2',    symbol: 'HPO₄²⁻',     name: 'Hydrogen Phosphate',   charge: -2, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'c2o4_n2',    symbol: 'C₂O₄²⁻',     name: 'Oxalate',              charge: -2, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 's2o3_n2',    symbol: 'S₂O₃²⁻',     name: 'Thiosulfate',          charge: -2, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'sio3_n2',    symbol: 'SiO₃²⁻',     name: 'Silicate',             charge: -2, type: 'polyatomic-anion', oxygenCount: 3 },

  // ── Polyatomic Anions −3 ────────────────────────────────────────────────────
  { id: 'po4_n3',     symbol: 'PO₄³⁻',      name: 'Phosphate',            charge: -3, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'po3_n3',     symbol: 'PO₃³⁻',      name: 'Phosphite',            charge: -3, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'aso4_n3',    symbol: 'AsO₄³⁻',     name: 'Arsenate',             charge: -3, type: 'polyatomic-anion', oxygenCount: 4 },
  { id: 'bo3_n3',     symbol: 'BO₃³⁻',      name: 'Borate',               charge: -3, type: 'polyatomic-anion', oxygenCount: 3 },
  { id: 'fecn6_n3',   symbol: 'Fe(CN)₆³⁻',  name: 'Ferricyanide',         charge: -3, type: 'polyatomic-anion', oxygenCount: 0 },
];

// ─── Flashcard groups (Phases 1 & 2) ─────────────────────────────────────────

export interface FlashcardGroup {
  label: string;
  ions: Ion[];
}

export const FLASHCARD_GROUPS: FlashcardGroup[] = [
  { label: 'Cations (+1)',      ions: IONS.filter(i => i.charge === 1 && (i.type === 'monatomic-cation' || i.type === 'polyatomic-cation')) },
  { label: 'Cations (+2)',      ions: IONS.filter(i => i.charge === 2 && i.type === 'monatomic-cation') },
  { label: 'Cations (+3)',      ions: IONS.filter(i => i.charge === 3 && i.type === 'monatomic-cation') },
  { label: 'Cations (+4)',      ions: IONS.filter(i => i.charge === 4 && i.type === 'monatomic-cation') },
  { label: 'Anions (−1)',       ions: IONS.filter(i => i.charge === -1 && i.type === 'monatomic-anion') },
  { label: 'Anions (−2)',       ions: IONS.filter(i => i.charge === -2 && i.type === 'monatomic-anion') },
  { label: 'Anions (−3)',       ions: IONS.filter(i => i.charge === -3 && i.type === 'monatomic-anion') },
  { label: 'Polyatomic (−1)',   ions: IONS.filter(i => i.charge === -1 && i.type === 'polyatomic-anion') },
  { label: 'Polyatomic (−2)',   ions: IONS.filter(i => i.charge === -2 && i.type === 'polyatomic-anion') },
  { label: 'Polyatomic (−3)',   ions: IONS.filter(i => i.charge === -3 && i.type === 'polyatomic-anion') },
];

export const ION_MAP: Record<string, Ion> = Object.fromEntries(IONS.map(i => [i.id, i]));
