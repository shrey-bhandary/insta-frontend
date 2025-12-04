import { useState, useEffect } from "react";
import { Users, Zap, TrendingUp, Clock, Trophy } from "lucide-react";
import { loadUserStats } from "../utils/gamification";

export function ExhibitionStats() {
  const [stats, setStats] = useState(loadUserStats());
  const [sessionChecks, setSessionChecks] = useState(0);

  useEffect(() => {
    // Update stats periodically
    const interval = setInterval(() => {
      setStats(loadUserStats());
    }, 2000);

    // Track session checks
    const stored = sessionStorage.getItem("exhibition_session_checks");
    if (stored) {
      setSessionChecks(parseInt(stored, 10));
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Increment session checks when stats change
    if (stats.accountsChecked > 0) {
      const newCount = stats.accountsChecked;
      sessionStorage.setItem("exhibition_session_checks", newCount.toString());
      setSessionChecks(newCount);
    }
  }, [stats.accountsChecked]);

  return (
    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/40 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <TrendingUp className="h-6 w-6 text-yellow-400 mr-2" />
          Exhibition Live Stats
        </h3>
        <div className="flex items-center space-x-2 text-yellow-400">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
          <Users className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {stats.accountsChecked}
          </div>
          <div className="text-xs text-blue-200">Total Checks</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
          <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {stats.totalPoints.toLocaleString()}
          </div>
          <div className="text-xs text-blue-200">Points Earned</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
          <Trophy className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{stats.level}</div>
          <div className="text-xs text-blue-200">Current Level</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
          <Clock className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{sessionChecks}</div>
          <div className="text-xs text-blue-200">This Session</div>
        </div>
      </div>
    </div>
  );
}
