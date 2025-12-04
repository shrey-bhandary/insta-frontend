import React from 'react';
import { Target, CheckCircle2, Gift } from 'lucide-react';
import { UserStats, checkDailyChallengeComplete, getDailyChallenge } from '../utils/gamification';

interface DailyChallengeProps {
  stats: UserStats;
}

export function DailyChallenge({ stats }: DailyChallengeProps) {
  const challenge = getDailyChallenge();
  const isComplete = checkDailyChallengeComplete(stats);
  const progress = Math.min(100, (stats.dailyChallengeProgress.accountsChecked / 5) * 100);

  return (
    <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/40">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="h-6 w-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Daily Challenge</h3>
        </div>
        {isComplete && (
          <div className="flex items-center space-x-1 text-yellow-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-bold">COMPLETE!</span>
          </div>
        )}
      </div>

      <p className="text-blue-100 mb-4">{challenge.description}</p>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm text-blue-200 mb-2">
            <span>Check 5 accounts</span>
            <span>{stats.dailyChallengeProgress.accountsChecked}/5</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-200">Find 6%+ engagement</span>
            {stats.dailyChallengeProgress.highEngagementFound ? (
              <CheckCircle2 className="h-4 w-4 text-yellow-400" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-blue-300" />
            )}
          </div>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-bold">+{challenge.reward} pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

