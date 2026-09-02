import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMissionChallenge } from '../src/services/missionService.js';

test('buildMissionChallenge upgrades incident missions with scenario metadata', () => {
  const mission = {
    challenge: {
      type: 'incident',
      scenario: 'Le service web est tombé pendant un déploiement.',
      objective: 'Diagnostiquer la cause et remettre le service en ligne.',
      steps: ['Vérifie le statut du service.', 'Corrige le fichier de config.', 'Relance le service.'],
      severity: 'high',
    },
  };

  const result = buildMissionChallenge(mission);

  assert.equal(result.type, 'incident');
  assert.equal(result.severity, 'high');
  assert.equal(result.steps.length, 3);
  assert.match(result.objective, /diagnostiquer/i);
});

test('buildMissionChallenge falls back to a standard terminal challenge', () => {
  const mission = {
    challenge: {
      expected: 'open-sesame',
      prompt: 'Saisis le mot de passe.',
      hint: 'Le mot de passe est dans le fichier caché.',
    },
  };

  const result = buildMissionChallenge(mission);

  assert.equal(result.type, 'terminal');
  assert.equal(result.expected, 'open-sesame');
  assert.equal(result.prompt, 'Saisis le mot de passe.');
});
