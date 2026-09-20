function getDateOnly(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

function differenceInDays(
  firstDate: string,
  secondDate: string
) {
  const first = getDateOnly(new Date(firstDate));
  const second = getDateOnly(new Date(secondDate));

  const difference =
    second.getTime() - first.getTime();

  return Math.round(
    difference / (1000 * 60 * 60 * 24)
  );
}

export function updateStreak(
  currentStreak: number,
  longestStreak: number,
  lastActiveDate?: string
) {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  // First activity
  if (!lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(longestStreak, 1),
      lastActiveDate: today,
    };
  }

  const days = differenceInDays(
    lastActiveDate,
    today
  );

  // Already active today
  if (days === 0) {
    return {
      currentStreak,
      longestStreak,
      lastActiveDate,
    };
  }

  // Active yesterday
  if (days === 1) {
    const newStreak = currentStreak + 1;

    return {
      currentStreak: newStreak,
      longestStreak: Math.max(
        longestStreak,
        newStreak
      ),
      lastActiveDate: today,
    };
  }

  // Missed one or more days
  return {
    currentStreak: 1,
    longestStreak: Math.max(
      longestStreak,
      1
    ),
    lastActiveDate: today,
  };
}