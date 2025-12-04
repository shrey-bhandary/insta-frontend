import React from 'react';
import { Award, Lock } from 'lucide-react';
import { Achievement } from '../utils/gamification';

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  const unlocked = achievements.filter(a => a.unlocked);
  const locked = achievements.filter(a => !a.unlocked);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Award className="h-6 w-6 text-yellow-400 mr-2" />
        Achievements ({unlocked.length}/{achievements.length})
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-xl border transition-all ${
              achievement.unlocked
                ? 'bg-yellow-400/20 border-yellow-400/40'
                : 'bg-white/5 border-white/10 opacity-60'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-white text-sm">{achievement.name}</h4>
                  {achievement.unlocked ? (
                    <Award className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <Lock className="h-4 w-4 text-blue-300" />
                  )}
                </div>
                <p className="text-xs text-blue-200">{achievement.description}</p>
                {achievement.points > 0 && (
                  <div className="text-xs text-yellow-400 mt-1">+{achievement.points} pts</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

