export const pickRandom = <T>(arr: readonly T[], pickCount = 1): T[] =>
  [...arr].sort(() => Math.random() - 0.5).slice(0, pickCount);
