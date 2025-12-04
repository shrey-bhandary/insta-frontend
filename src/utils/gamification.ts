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
  vsModeUsed?: boolean;
  lastCheckTime?: number;
  consecutiveChecks?: number;
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

export interface EngagementEntry {
  username: string;
  engagementRate: number;
  followers: number;
  checkedAt: string;
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
    id: "three_checks",
    name: "Getting Started",
    description: "Check 3 accounts",
    icon: "🔍",
    points: 30,
    unlocked: false,
  },
  {
    id: "five_checks",
    name: "Explorer",
    description: "Check 5 accounts",
    icon: "📊",
    points: 50,
    unlocked: false,
  },
  {
    id: "high_engagement",
    name: "Gold Finder",
    description: "Find an account with 6%+ engagement",
    icon: "⭐",
    points: 100,
    unlocked: false,
  },
  {
    id: "vs_mode",
    name: "Comparer",
    description: "Use VS Mode to compare accounts",
    icon: "⚔️",
    points: 75,
    unlocked: false,
  },
  {
    id: "level_2",
    name: "Level Up",
    description: "Reach level 2",
    icon: "⬆️",
    points: 0,
    unlocked: false,
  },
  {
    id: "level_3",
    name: "Rising Star",
    description: "Reach level 3",
    icon: "🌟",
    points: 0,
    unlocked: false,
  },
  {
    id: "daily_challenge",
    name: "Challenge Master",
    description: "Complete a daily challenge",
    icon: "🎖️",
    points: 150,
    unlocked: false,
  },
  {
    id: "top_engagement",
    name: "Top Finder",
    description: "Find an account in top 3 engagement",
    icon: "🏆",
    points: 200,
    unlocked: false,
  },
  {
    id: "quick_analyzer",
    name: "Speed Demon",
    description: "Check 2 accounts in a row",
    icon: "⚡",
    points: 40,
    unlocked: false,
  },
];

const STORAGE_KEY = "insta_gamification_stats";
const DAILY_ENGAGEMENT_KEY = "insta_daily_engagement";

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
    vsModeUsed: false,
    lastCheckTime: 0,
    consecutiveChecks: 0,
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
      case "three_checks":
        shouldUnlock = stats.accountsChecked >= 3;
        break;
      case "five_checks":
        shouldUnlock = stats.accountsChecked >= 5;
        break;
      case "high_engagement":
        shouldUnlock = engagementRate !== undefined && engagementRate >= 6;
        break;
      case "vs_mode":
        shouldUnlock = stats.vsModeUsed === true;
        break;
      case "level_2":
        shouldUnlock = stats.level >= 2;
        break;
      case "level_3":
        shouldUnlock = stats.level >= 3;
        break;
      case "daily_challenge":
        shouldUnlock = checkDailyChallengeComplete(stats);
        break;
      case "top_engagement":
        // Check if user found an account in top 3 of today's engagement
        if (engagementRate !== undefined) {
          const topEngagement = getTopEngagementToday();
          if (topEngagement.length > 0) {
            const top3Rates = topEngagement
              .slice(0, 3)
              .map((e: EngagementEntry) => e.engagementRate);
            shouldUnlock = top3Rates.some(
              (rate: number) => engagementRate >= rate
            );
          }
        }
        break;
      case "quick_analyzer":
        shouldUnlock = (stats.consecutiveChecks || 0) >= 2;
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

export function processEngagementCheck(
  engagementRate: number,
  username?: string,
  followers?: number
): {
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

  // Track quick analyzer (2 checks in a row within 30 seconds)
  const now = Date.now();
  if (stats.lastCheckTime && now - stats.lastCheckTime < 30000) {
    stats.consecutiveChecks = (stats.consecutiveChecks || 0) + 1;
  } else {
    stats.consecutiveChecks = 1;
  }
  stats.lastCheckTime = now;

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

  // Save daily engagement data
  if (username) {
    saveDailyEngagement(username, engagementRate, followers || 0);
  }

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

export function saveDailyEngagement(
  username: string,
  engagementRate: number,
  followers: number
): void {
  try {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(DAILY_ENGAGEMENT_KEY);
    let dailyData: Record<string, EngagementEntry[]> = {};

    if (stored) {
      dailyData = JSON.parse(stored);
    }

    // Reset if it's a new day
    if (!dailyData[today]) {
      dailyData = { [today]: [] };
    }

    // Add new entry
    const entry: EngagementEntry = {
      username,
      engagementRate,
      followers,
      checkedAt: new Date().toISOString(),
    };

    dailyData[today].push(entry);

    // Keep only today's data
    localStorage.setItem(
      DAILY_ENGAGEMENT_KEY,
      JSON.stringify({ [today]: dailyData[today] })
    );
  } catch (e) {
    console.error("Error saving daily engagement:", e);
  }
}

export function getTopEngagementToday(): EngagementEntry[] {
  try {
    const today = new Date().toDateString();
    const stored = localStorage.getItem(DAILY_ENGAGEMENT_KEY);

    if (!stored) {
      return [];
    }

    const dailyData: Record<string, EngagementEntry[]> = JSON.parse(stored);

    if (!dailyData[today]) {
      return [];
    }

    // Sort by engagement rate descending and return top 10
    return dailyData[today]
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, 10);
  } catch (e) {
    console.error("Error loading daily engagement:", e);
    return [];
  }
}

// Unlock VS mode achievement
export function unlockVsModeAchievement(): Achievement[] {
  const stats = loadUserStats();
  if (stats.vsModeUsed || stats.achievements.includes("vs_mode")) {
    return [];
  }

  stats.vsModeUsed = true;
  const achievement = ACHIEVEMENTS.find((a) => a.id === "vs_mode");
  if (achievement) {
    stats.achievements.push("vs_mode");
    stats.totalPoints += achievement.points;
    saveUserStats(stats);
    return [{ ...achievement, unlocked: true }];
  }
  return [];
}
