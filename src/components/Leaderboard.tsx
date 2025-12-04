import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '../utils/gamification';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-300" />;
    if (index === 2) return <Award className="h-6 w-6 text-orange-400" />;
    return <span className="text-white font-bold w-6 text-center">{index + 1}</span>;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-yellow-400/20 border-yellow-400/40';
    if (index === 1) return 'bg-gray-300/20 border-gray-300/40';
    if (index === 2) return 'bg-orange-400/20 border-orange-400/40';
    return 'bg-white/5 border-white/10';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
        Leaderboard
      </h3>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 rounded-xl border ${getRankColor(index)} ${
              entry.username === 'You' ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index)}
              </div>
              <div>
                <div className="font-bold text-white flex items-center">
                  {entry.username}
                  {entry.username === 'You' && (
                    <span className="ml-2 text-xs bg-yellow-400 text-blue-900 px-2 py-0.5 rounded-full">YOU</span>
                  )}
                </div>
                <div className="text-sm text-blue-200">Level {entry.level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-yellow-400">{entry.points.toLocaleString()}</div>
              <div className="text-xs text-blue-200">{entry.accountsChecked} checks</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

