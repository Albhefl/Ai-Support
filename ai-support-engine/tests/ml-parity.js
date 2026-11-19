#!/usr/bin/env node
'use strict';

/**
 * Verifica que la inferencia en Node.js (src/engines/ml.engine.js) reproduce las
 * probabilidades de scikit-learn guardadas por ml/train.py en ml/model.json.
 */
const model = require('../ml/model.json');
const { predictProba, analyzeML } = require('../src/engines/ml.engine');
const { validateEngineOutput } = require('../src/utils/validator');

const TOLERANCE = 1e-9;
let failures = 0;

for (const { message, proba: expected } of model.parity) {
  const actual = predictProba(message);
  const diff = Math.max(...actual.map((p, i) => Math.abs(p - expected[i])));
  const ok = diff < TOLERANCE;
  if (!ok) failures++;
  const result = validateEngineOutput(analyzeML(message), 'ml');
  console.log(`${ok ? 'OK  ' : 'FAIL'} diff=${diff.toExponential(2)} ${result.category}/${result.priority} review=${result.requiresHumanReview} | ${message}`);
}

console.log(`\n${model.parity.length - failures}/${model.parity.length} frases con paridad sklearn ↔ Node.js (tolerancia ${TOLERANCE})`);
process.exitCode = failures === 0 ? 0 : 1;
