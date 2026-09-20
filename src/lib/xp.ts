// export function getLevelFromXP(xp: number): number {
//   return Math.floor(xp / 100) + 1;
// }

// export function getXPForNextLevel(level: number): number {
//   return level * 100;
// }

// export function getLevelProgress(xp: number) {
//   const level = getLevelFromXP(xp);

//   const currentLevelXP = (level - 1) * 100;
//   const nextLevelXP = level * 100;

//   const progress =
//     ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

//   return {
//     level,
//     progress: Math.min(Math.max(progress, 0), 100),
//     currentXP: xp - currentLevelXP,
//     requiredXP: nextLevelXP - currentLevelXP,
//   };
// }
export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXPForNextLevel(level: number): number {
  return level * 100;
}

export function getLevelProgress(xp: number) {
  const level = getLevelFromXP(xp);

  const currentLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;

  const progress =
    ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return {
    level,
    progress: Math.min(Math.max(progress, 0), 100),
    currentXP: xp - currentLevelXP,
    requiredXP: nextLevelXP - currentLevelXP,
    nextLevelXP,
  };
}

export function addXP(currentXP: number, amount: number) {
  const newXP = currentXP + amount;

  return {
    xp: newXP,
    level: getLevelFromXP(newXP),
  };
}