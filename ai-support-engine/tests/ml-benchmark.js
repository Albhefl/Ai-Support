#!/usr/bin/env node
'use strict';

/**
 * Tarea 3: ejecuta el motor ML (mode: "ml") sobre los mismos casos de
 * tests/test-cases.json usados para comparar los motores tradicional y generativo.
 */
const { cases } = require('./test-cases.json');
const { analyzeML, predictProba } = require('../src/engines/ml.engine');
const { validateEngineOutput } = require('../src/utils/validator');

let correctCategory = 0;
let correctFull = 0;
let validFormat = 0;

console.log('| # | Caso | Referencia | Motor ML | Confianza | Formato | Categoría correcta | Cat + Prio correctas |');
console.log('| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |');

cases.forEach((testCase, i) => {
  const expected = testCase.expected;
  let result = null;
  try {
    result = validateEngineOutput(analyzeML(testCase.message), 'ml');
    validFormat++;
  } catch (_) {
    result = null;
  }
  const confidence = Math.max(...predictProba(testCase.message));
  const catOk = result && result.category === expected.category;
  const fullOk = catOk && result.priority === expected.priority;
  if (catOk) correctCategory++;
  if (fullOk) correctFull++;
  console.log(
    `| ${i + 1} | \`${testCase.id}\` | \`${expected.category}\` / \`${expected.priority}\` | ` +
      `${result ? `\`${result.category}\` / \`${result.priority}\`` : 'Error'} | ${confidence.toFixed(2)} | ` +
      `${result ? 'Sí ✅' : 'No ❌'} | ${catOk ? 'Sí ✅' : 'No ❌'} | ${fullOk ? 'Sí ✅' : 'No ❌'} |`
  );
});

const pct = (n) => ((n / cases.length) * 100).toFixed(2);
console.log(`\nMotor ML - categoría correcta: ${correctCategory}/${cases.length} (${pct(correctCategory)}%)`);
console.log(`Motor ML - categoría y prioridad correctas: ${correctFull}/${cases.length} (${pct(correctFull)}%)`);
console.log(`Motor ML - formato JSON válido: ${validFormat}/${cases.length} (${pct(validFormat)}%)`);
