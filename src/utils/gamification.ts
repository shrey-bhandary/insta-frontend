export interface UserStats {
  totalPoints: number;
  level: number;
  accountsChecked: number;
  currentStreak: number;
  longestStreak: number;
  lastCheckDate: string;
  achievements: string[];
  dailyChallengeProgress: {
    accountsChecked: number;
    highEngagementFound: boolean;
    challengeDate: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  username: string;
  points: number;
  level: number;
  accountsChecked: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_check",
    name: "First Check",
    description: "Check your first Instagram account",
    icon: "🎯",
    points: 10,
    unlocked: false,
  },
  {
    id: "ten_checks",
    name: "Checker Pro",
    description: "Check 10 accounts",
    icon: "🔍",
    points: 50,
    unlocked: false,
  },
  {
    id: "fifty_checks",
    name: "Analytics Master",
    description: "Check 50 accounts",
    icon: "📊",
    points: 200,
    unlocked: false,
  },
  {
    id: "hundred_checks",
    name: "Engagement Guru",
    description: "Check 100 accounts",
    icon: "👑",
    points: 500,
    unlocked: false,
  },
  {
    id: "high_engagement",
    name: "Gold Digger",
    description: "Find an account with 6%+ engagement",
    icon: "⭐",
    points: 100,
    unlocked: false,
  },
  {
    id: "streak_3",
    name: "On Fire",
    description: "3 day streak",
    icon: "🔥",
    points: 50,
    unlocked: false,
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "7 day streak",
    icon: "💪",
    points: 150,
    unlocked: false,
  },
  {
    id: "streak_30",
    name: "Dedicated",
    description: "30 day streak",
    icon: "🏆",
    points: 1000,
    unlocked: false,
  },
  {
    id: "level_5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "🌟",
    points: 0,
    unlocked: false,
  },
  {
    id: "level_10",
    name: "Elite",
    description: "Reach level 10",
    icon: "💎",
    points: 0,
    unlocked: false,
  },
];

const STORAGE_KEY = "insta_gamification_stats";

export function getInitialStats(): UserStats {
  return {
    totalPoints: 0,
    level: 1,
    accountsChecked: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCheckDate: "",
    achievements: [],
    dailyChallengeProgress: {
      accountsChecked: 0,
      highEngagementFound: false,
      challengeDate: new Date().toDateString(),
    },
  };
}

export function loadUserStats(): UserStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const stats = JSON.parse(stored);
      // Reset daily challenge if it's a new day
      if (
        stats.dailyChallengeProgress.challengeDate !== new Date().toDateString()
      ) {
        stats.dailyChallengeProgress = {
          accountsChecked: 0,
          highEngagementFound: false,
          challengeDate: new Date().toDateString(),
        };
      }
      return stats;
    }
  } catch (e) {
    console.error("Error loading stats:", e);
  }
  return getInitialStats();
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error("Error saving stats:", e);
  }
}

export function calculateLevel(points: number): number {
  // Level formula: level = floor(sqrt(points / 100)) + 1
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

export function getPointsForNextLevel(currentLevel: number): number {
  const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
  const currentLevelPoints = Math.pow(currentLevel - 1, 2) * 100;
  return nextLevelPoints - currentLevelPoints;
}

export function getCurrentLevelProgress(points: number, level: number): number {
  const currentLevelPoints = Math.pow(level - 1, 2) * 100;
  const nextLevelPoints = Math.pow(level, 2) * 100;
  const progress =
    ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) *
    100;
  return Math.min(100, Math.max(0, progress));
}

export function awardPointsForCheck(engagementRate: number): number {
  let points = 10; // Base points for checking

  // Bonus points for high engagement finds
  if (engagementRate >= 6) {
    points += 50;
  } else if (engagementRate >= 3) {
    points += 20;
  } else if (engagementRate >= 1) {
    points += 10;
  }

  return points;
}

export function updateStreak(stats: UserStats): UserStats {
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (stats.lastCheckDate === today) {
    // Already checked today, no change
    return stats;
  } else if (stats.lastCheckDate === yesterdayStr) {
    // Continuing streak
    stats.currentStreak += 1;
  } else if (stats.lastCheckDate !== "") {
    // Streak broken
    stats.currentStreak = 1;
  } else {
    // First check
    stats.currentStreak = 1;
  }

  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }

  stats.lastCheckDate = today;
  return stats;
}

export function checkAchievements(
  stats: UserStats,
  engagementRate?: number
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  ACHIEVEMENTS.forEach((achievement) => {
    let shouldUnlock = false;

    if (stats.achievements.includes(achievement.id)) {
      return;
    }

    switch (achievement.id) {
      case "first_check":
        shouldUnlock = stats.accountsChecked >= 1;
        break;
      case "ten_checks":
        shouldUnlock = stats.accountsChecked >= 10;
        break;
      case "fifty_checks":
        shouldUnlock = stats.accountsChecked >= 50;
        break;
      case "hundred_checks":
        shouldUnlock = stats.accountsChecked >= 100;
        break;
      case "high_engagement":
        shouldUnlock = engagementRate !== undefined && engagementRate >= 6;
        break;
      case "streak_3":
        shouldUnlock = stats.currentStreak >= 3;
        break;
      case "streak_7":
        shouldUnlock = stats.currentStreak >= 7;
        break;
      case "streak_30":
        shouldUnlock = stats.currentStreak >= 30;
        break;
      case "level_5":
        shouldUnlock = stats.level >= 5;
        break;
      case "level_10":
        shouldUnlock = stats.level >= 10;
        break;
    }

    if (shouldUnlock && !stats.achievements.includes(achievement.id)) {
      stats.achievements.push(achievement.id);
      stats.totalPoints += achievement.points;
      newlyUnlocked.push({ ...achievement, unlocked: true });
    }
  });

  return newlyUnlocked;
}

export function processEngagementCheck(engagementRate: number): {
  pointsEarned: number;
  newStats: UserStats;
  newAchievements: Achievement[];
  dailyChallengeReward?: number;
} {
  const stats = loadUserStats();

  // Award points
  let pointsEarned = awardPointsForCheck(engagementRate);
  stats.totalPoints += pointsEarned;
  stats.accountsChecked += 1;

  // Update streak
  const updatedStats = updateStreak(stats);

  // Update daily challenge
  const wasChallengeComplete = checkDailyChallengeComplete(updatedStats);
  updatedStats.dailyChallengeProgress.accountsChecked += 1;
  if (engagementRate >= 6) {
    updatedStats.dailyChallengeProgress.highEngagementFound = true;
  }

  // Award daily challenge reward if just completed
  let dailyChallengeReward: number | undefined;
  if (!wasChallengeComplete && checkDailyChallengeComplete(updatedStats)) {
    dailyChallengeReward = getDailyChallenge().reward;
    updatedStats.totalPoints += dailyChallengeReward;
    pointsEarned += dailyChallengeReward;
  }

  // Recalculate level
  updatedStats.level = calculateLevel(updatedStats.totalPoints);

  // Check achievements
  const newAchievements = checkAchievements(updatedStats, engagementRate);

  // Save stats
  saveUserStats(updatedStats);

  return {
    pointsEarned,
    newStats: updatedStats,
    newAchievements,
    dailyChallengeReward,
  };
}

export function getDailyChallenge(): { description: string; reward: number } {
  return {
    description: "Check 5 accounts and find one with 6%+ engagement",
    reward: 100,
  };
}

export function checkDailyChallengeComplete(stats: UserStats): boolean {
  return (
    stats.dailyChallengeProgress.accountsChecked >= 5 &&
    stats.dailyChallengeProgress.highEngagementFound
  );
}

export function getAllAchievements(): Achievement[] {
  const stats = loadUserStats();
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: stats.achievements.includes(achievement.id),
  }));
}

// Mock leaderboard data (in a real app, this would come from a backend)
export function getLeaderboard(): LeaderboardEntry[] {
  const stats = loadUserStats();
  const mockEntries: LeaderboardEntry[] = [
    {
      username: "You",
      points: stats.totalPoints,
      level: stats.level,
      accountsChecked: stats.accountsChecked,
    },
    { username: "Alex", points: 2500, level: 8, accountsChecked: 45 },
    { username: "Sam", points: 1800, level: 6, accountsChecked: 32 },
    { username: "Jordan", points: 1200, level: 5, accountsChecked: 28 },
    { username: "Taylor", points: 950, level: 4, accountsChecked: 22 },
    { username: "Casey", points: 750, level: 3, accountsChecked: 18 },
    { username: "Morgan", points: 500, level: 2, accountsChecked: 12 },
  ];

  return mockEntries.sort((a, b) => b.points - a.points);
}
