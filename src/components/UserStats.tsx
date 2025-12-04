import React from "react";
import { Trophy, Zap, Target, Flame, Award } from "lucide-react";
import {
  UserStats as UserStatsType,
  getCurrentLevelProgress,
  getPointsForNextLevel,
} from "../utils/gamification";

interface UserStatsProps {
  stats: UserStatsType;
}

export function UserStats({ stats }: UserStatsProps) {
  const progress = getCurrentLevelProgress(stats.totalPoints, stats.level);
  const pointsNeeded = getPointsForNextLevel(stats.level);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Your Stats</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">
            Level {stats.level}
          </div>
          <div className="text-sm text-blue-200">
            {stats.totalPoints} points
          </div>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-blue-200 mb-2">
          <span>Progress to Level {stats.level + 1}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-blue-300 mt-1">
          {pointsNeeded -
            (stats.totalPoints - Math.pow(stats.level - 1, 2) * 100)}{" "}
          points to next level
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <Target className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {stats.accountsChecked}
          </div>
          <div className="text-xs text-blue-200">Checked</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <Zap className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {stats.totalPoints}
          </div>
          <div className="text-xs text-blue-200">Points</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <Flame className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {stats.currentStreak}
          </div>
          <div className="text-xs text-blue-200">Day Streak</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <Award className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">
            {stats.achievements.length}
          </div>
          <div className="text-xs text-blue-200">Badges</div>
        </div>
      </div>
    </div>
  );
}
