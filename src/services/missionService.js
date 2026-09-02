export const DEFAULT_MISSION_CHALLENGE = {
  type: 'terminal',
  title: 'Défi terminal',
  scenario: 'Le système demande une commande précise pour valider la mission.',
  objective: 'Résous le défi pour avancer.',
  status: 'À traiter',
  severity: 'normal',
  steps: [],
  prompt: 'Saisis le mot de passe trouvé dans le terminal.',
  hint: 'Observe bien les fichiers et la sortie du terminal.',
  expected: null,
  successText: 'Mission validée avec succès.',
};

export function buildMissionChallenge(challenge = {}) {
  const source = challenge?.challenge ? challenge.challenge : challenge;

  if (!source || typeof source !== 'object') {
    return { ...DEFAULT_MISSION_CHALLENGE };
  }

  const base = {
    ...DEFAULT_MISSION_CHALLENGE,
    ...source,
  };

  if (source.type === 'incident') {
    return {
      ...base,
      type: 'incident',
      title: source.title || 'Incident système',
      scenario: source.scenario || 'Un incident a touché le service.',
      objective: source.objective || 'Diagnostiquer et corriger le problème en moins de 5 minutes.',
      status: source.status || 'Incident ouvert',
      severity: source.severity || 'medium',
      steps: Array.isArray(source.steps) && source.steps.length > 0 ? source.steps : ['Diagnostique la cause.', 'Corrige le problème.', 'Valide la restauration du service.'],
      successText: source.successText || 'Incident résolu : le service est de nouveau stable.',
    };
  }

  return {
    ...base,
    type: 'terminal',
    title: source.title || DEFAULT_MISSION_CHALLENGE.title,
    scenario: source.scenario || DEFAULT_MISSION_CHALLENGE.scenario,
    objective: source.objective || DEFAULT_MISSION_CHALLENGE.objective,
    prompt: source.prompt || DEFAULT_MISSION_CHALLENGE.prompt,
    hint: source.hint || DEFAULT_MISSION_CHALLENGE.hint,
    expected: source.expected ?? DEFAULT_MISSION_CHALLENGE.expected,
    steps: Array.isArray(source.steps) ? source.steps : [],
  };
}
