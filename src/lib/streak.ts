function getIndiaDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function differenceInDays(firstDate: string, secondDate: string) {
  const first = new Date(`${firstDate}T00:00:00Z`);
  const second = new Date(`${secondDate}T00:00:00Z`);

  return Math.round(
    (second.getTime() - first.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

export function updateStreak(
  currentStreak: number,
  longestStreak: number,
  lastActiveDate?: string | Date
) {
  const today = getIndiaDate(new Date());

  if (!lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(longestStreak, 1),
      lastActiveDate: today,
    };
  }

  const lastActiveDay = getIndiaDate(
    new Date(lastActiveDate)
  );

  const days = differenceInDays(
    lastActiveDay,
    today
  );

  // Already active today
  if (days === 0) {
    return {
      currentStreak,
      longestStreak,
      lastActiveDate: lastActiveDate,
    };
  }

  // Active on the previous day
  if (days === 1) {
    const newStreak = currentStreak + 1;

    return {
      currentStreak: newStreak,
      longestStreak: Math.max(longestStreak, newStreak),
      lastActiveDate: today,
    };
  }

  // Missed one or more days
  return {
    currentStreak: 1,
    longestStreak: Math.max(longestStreak, 1),
    lastActiveDate: today,
  };
}
