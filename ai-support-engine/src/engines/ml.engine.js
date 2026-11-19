'use strict';

/**
 * Tarea 3 · Motor de Machine Learning supervisado (mode: "ml").
 *
 * El modelo se entrena en Python con scikit-learn (ml/train.py) usando
 * tickets.csv + TfidfVectorizer(ngram_range=(1, 2)) + LogisticRegression.
 * train.py exporta los parámetros aprendidos a ml/model.json y este módulo
 * reproduce la inferencia en Node.js:
 *
 *   1. Tokenización igual a sklearn: minúsculas + token_pattern (?u)\b\w\w+\b
 *   2. N-gramas de palabras (1 y 2) con el vocabulario aprendido
 *   3. TF (conteo) × IDF y normalización L2
 *   4. Puntaje lineal por clase (coef · x + intercept) y softmax
 *
 * El modelo solo predice la CATEGORÍA. La prioridad y la respuesta
 * predeterminada se reutilizan del motor tradicional para cumplir el mismo
 * contrato de respuesta. tests/ml-parity.js verifica que las probabilidades
 * coincidan con las de scikit-learn.
 */

const fs = require('fs');
const path = require('path');
const { normalizeText, selectPriority, isInjectionAttempt, RESPONSES } = require('./traditional.engine');

const MODEL_PATH = path.join(__dirname, '..', '..', 'ml', 'model.json');
// Con 4 clases el azar es 0.25; por debajo de 0.35 el modelo no tiene una preferencia clara
// y el caso se marca para revisión humana.
const MIN_CONFIDENCE = 0.35;

let cachedModel = null;

function loadModel() {
  if (cachedModel) return cachedModel;
  if (!fs.existsSync(MODEL_PATH)) {
    const err = new Error('ml/model.json no existe; ejecute "python ml/train.py"');
    err.code = 'ENGINE_NOT_IMPLEMENTED';
    throw err;
  }
  const model = JSON.parse(fs.readFileSync(MODEL_PATH, 'utf8'));
  const { vectorizer, classifier } = model;
  if (
    !vectorizer || !classifier ||
    vectorizer.tokenPattern !== '(?u)\\b\\w\\w+\\b' ||
    vectorizer.norm !== 'l2' ||
    !Array.isArray(classifier.classes) ||
    classifier.coef.length !== classifier.classes.length
  ) {
    const err = new Error('ml/model.json tiene un formato no soportado');
    err.code = 'INVALID_ENGINE_OUTPUT';
    throw err;
  }
  cachedModel = model;
  return model;
}

// Equivalente a (?u)\b\w\w+\b de Python: secuencias de 2+ caracteres de palabra Unicode.
const TOKEN_REGEX = /[\p{L}\p{N}\p{M}_]{2,}/gu;

function extractTerms(message, [minN, maxN], lowercase) {
  const text = lowercase ? message.toLowerCase() : message;
  const tokens = text.match(TOKEN_REGEX) || [];
  const terms = [];
  for (let n = minN; n <= maxN; n++) {
    for (let i = 0; i + n <= tokens.length; i++) {
      terms.push(tokens.slice(i, i + n).join(' '));
    }
  }
  return terms;
}

function vectorize(message, vectorizer) {
  const features = new Map();
  for (const term of extractTerms(message, vectorizer.ngramRange, vectorizer.lowercase)) {
    const index = vectorizer.vocabulary[term];
    if (index !== undefined) features.set(index, (features.get(index) || 0) + 1);
  }
  let sumSquares = 0;
  for (const [index, count] of features) {
    const value = count * vectorizer.idf[index];
    features.set(index, value);
    sumSquares += value * value;
  }
  const norm = Math.sqrt(sumSquares);
  if (norm > 0) for (const [index, value] of features) features.set(index, value / norm);
  return features;
}

function predictProba(message) {
  const { vectorizer, classifier } = loadModel();
  const features = vectorize(message, vectorizer);
  const scores = classifier.coef.map((row, k) => {
    let score = classifier.intercept[k];
    for (const [index, value] of features) score += row[index] * value;
    return score;
  });
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const total = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / total);
}

function analyzeML(message) {
  const { classifier } = loadModel();
  const proba = predictProba(String(message));
  const best = proba.indexOf(Math.max(...proba));
  const category = classifier.classes[best];
  const confidence = proba[best];

  const text = normalizeText(message);
  const priority = selectPriority(category, text);

  return {
    category,
    priority,
    response: RESPONSES[category][priority],
    // SECURITY, baja confianza del modelo o intento de manipulación => revisión humana
    requiresHumanReview:
      category === 'SECURITY' || confidence < MIN_CONFIDENCE || isInjectionAttempt(text),
    mode: 'ml',
  };
}

function getMLModelReport() {
  const model = loadModel();
  return {
    model: 'TfidfVectorizer(ngram_range=(1, 2)) + LogisticRegression(max_iter=1000)',
    dataset: 'ml/tickets.csv',
    sklearnVersion: model.sklearnVersion,
    classes: model.classifier.classes,
    vocabularySize: Object.keys(model.vectorizer.vocabulary).length,
    ...model.report,
  };
}

module.exports = { analyzeML, predictProba, getMLModelReport };
