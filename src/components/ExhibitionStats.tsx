import { useState, useEffect } from "react";
import { Users, Zap, Clock, Trophy, Sparkles } from "lucide-react";
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
    <div className="bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 mr-2 sm:mr-3 animate-pulse" />
            <h3 className="text-xl sm:text-3xl font-bold text-white">
              Xynergy <span className="text-yellow-400">Live Stats</span>
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-yellow-400">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-semibold">LIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">
              {stats.accountsChecked}
            </div>
            <div className="text-xs text-blue-200">Total Checks</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">
              {stats.totalPoints.toLocaleString()}
            </div>
            <div className="text-xs text-blue-200">Points Earned</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.level}</div>
            <div className="text-xs text-blue-200">Current Level</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mx-auto mb-1 sm:mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-white">{sessionChecks}</div>
            <div className="text-xs text-blue-200">This Session</div>
          </div>
        </div>
      </div>
    </div>
  );
}
