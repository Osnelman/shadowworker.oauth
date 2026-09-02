import test from 'node:test';
import assert from 'node:assert/strict';

import { getUserTitle, getUserTitleProgress } from '../src/utils/userTitles.js';

test('returns a beginner title when no lesson is completed', () => {
  assert.equal(getUserTitle(0), 'Novice');
});

test('promotes the user through progressive titles based on completed lessons', () => {
  assert.equal(getUserTitle(1), 'Débutant');
  assert.equal(getUserTitle(3), 'Apprenti');
  assert.equal(getUserTitle(5), 'Initié');
  assert.equal(getUserTitle(7), 'Pro');
  assert.equal(getUserTitle(9), 'Élite');
  assert.equal(getUserTitle(12), 'Master');
  assert.equal(getUserTitle(15), 'Chef');
});

test('provides the next title and progress toward the next grade', () => {
  const progress = getUserTitleProgress(4);

  assert.equal(progress.currentTitle, 'Apprenti');
  assert.equal(progress.nextTitle, 'Initié');
  assert.equal(progress.lessonsNeeded, 1);
  assert.equal(progress.progress, 50);
});
