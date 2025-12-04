import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Search } from "lucide-react";
import { EngagementEntry, getTopEngagementToday } from "../utils/gamification";

interface LeaderboardProps {
  entries: any[];
}

export function Leaderboard({ entries: _entries }: LeaderboardProps) {
  const [engagementEntries, setEngagementEntries] = useState<EngagementEntry[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setEngagementEntries(getTopEngagementToday());
    // Refresh every 2 seconds
    const interval = setInterval(() => {
      setEngagementEntries(getTopEngagementToday());
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-400" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-300" />;
    if (index === 2) return <Award className="h-6 w-6 text-orange-400" />;
    return (
      <span className="text-white font-bold w-6 text-center">{index + 1}</span>
    );
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-yellow-400/20 border-yellow-400/40";
    if (index === 1) return "bg-gray-300/20 border-gray-300/40";
    if (index === 2) return "bg-orange-400/20 border-orange-400/40";
    return "bg-white/5 border-white/10";
  };

  const filteredEngagementEntries = engagementEntries.filter((entry) =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
          Leaderboard
        </h3>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username..."
            className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-blue-200"
          />
        </div>
        <p className="text-xs text-blue-200 mt-2">
          Top accounts checked today by engagement rate
        </p>
      </div>

      <div className="space-y-3">
        {filteredEngagementEntries.length > 0 ? (
          filteredEngagementEntries.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl border ${getRankColor(
                index
              )}`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>
                <div>
                  <div className="font-bold text-white">@{entry.username}</div>
                  <div className="text-sm text-blue-200">
                    {entry.followers.toLocaleString()} followers
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">
                  {entry.engagementRate.toFixed(2)}%
                </div>
                <div className="text-xs text-blue-200">Engagement Rate</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-blue-200">
            {searchQuery ? (
              <p>No accounts found matching "{searchQuery}"</p>
            ) : (
              <p>
                No accounts checked today yet. Start analyzing to see top
                engagement rates!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
