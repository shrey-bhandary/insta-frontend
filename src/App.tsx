import React, { useState } from "react";
import {
  Search,
  Instagram,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  BarChart3,
  ArrowRight,
  Trophy,
  BarChart,
  HelpCircle,
} from "lucide-react";
import {
  UserStats as UserStatsType,
  loadUserStats,
  processEngagementCheck,
  Achievement,
} from "./utils/gamification";
import { Quiz } from "./components/Quiz";
import { Leaderboard } from "./components/Leaderboard";
import { DailyChallenge } from "./components/DailyChallenge";
import { PointsAnimation } from "./components/PointsAnimation";
import { AchievementUnlock } from "./components/AchievementUnlock";
import { ExhibitionStats } from "./components/ExhibitionStats";
import { Confetti } from "./components/Confetti";
import { CompareMode } from "./components/CompareMode";

interface EngagementData {
  username: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: string;
}

type Tab = "analyze" | "stats" | "quiz" | "leaderboard";

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EngagementData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("analyze");
  const [userStats, setUserStats] = useState<UserStatsType>(loadUserStats());
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [unlockedAchievement, setUnlockedAchievement] =
    useState<Achievement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mode, setMode] = useState<"normal" | "vs">("normal");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a valid username");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch("/api/engagement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          text || `Request failed with status ${response.status}`
        );
      }

      const result = await response.json();

      if (result.error) {
        setError(result.error || "Failed to analyze engagement.");
      } else {
        const received: EngagementData = {
          username: result.username ?? username.trim(),
          followers: result.followers,
          avgLikes: result.avgLikes,
          avgComments: result.avgComments,
          engagementRate: String(result.engagementRate),
        };
        setData(received);

        // Process gamification
        const engagementRateNum = parseFloat(result.engagementRate);
        const {
          pointsEarned: earned,
          newStats,
          newAchievements,
        } = processEngagementCheck(
          engagementRateNum,
          received.username,
          received.followers
        );

        setUserStats(newStats);
        setPointsEarned(earned);

        // Show first achievement if any unlocked
        if (newAchievements.length > 0) {
          setUnlockedAchievement(newAchievements[0]);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to analyze engagement. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
      {/* Diagonal Pattern Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-600 to-transparent transform rotate-12 scale-150"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-500 to-transparent transform -rotate-12 scale-150"></div>
        </div>
        {/* Diagonal stripes pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.1) 35px,
            rgba(255,255,255,0.1) 70px
          )`,
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Instagram className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
            <span className="text-lg sm:text-2xl font-bold text-white">
              insta<span className="text-yellow-400">analytics</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-400 text-blue-900 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Level {userStats.level}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <div className="flex space-x-1 sm:space-x-2 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-white/20">
          <button
            onClick={() => setActiveTab("analyze")}
            className={`flex-1 min-w-[80px] px-2 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-base ${
              activeTab === "analyze"
                ? "bg-yellow-400 text-blue-900"
                : "text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Analyze</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 min-w-[80px] px-2 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-base ${
              activeTab === "stats"
                ? "bg-yellow-400 text-blue-900"
                : "text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <BarChart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Live Stats</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 min-w-[80px] px-2 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-base ${
              activeTab === "quiz"
                ? "bg-yellow-400 text-blue-900"
                : "text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Quiz</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 min-w-[80px] px-2 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-base ${
              activeTab === "leaderboard"
                ? "bg-yellow-400 text-blue-900"
                : "text-white hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Leaderboard</span>
            </div>
          </button>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Points Animation */}
        {pointsEarned !== null && (
          <PointsAnimation
            points={pointsEarned}
            onComplete={() => setPointsEarned(null)}
          />
        )}

        {/* Achievement Unlock Animation */}
        {unlockedAchievement && (
          <AchievementUnlock
            achievement={unlockedAchievement}
            onClose={() => setUnlockedAchievement(null)}
          />
        )}

        {/* Confetti Effect */}
        <Confetti trigger={showConfetti} />

        {/* Analyze Tab */}
        {activeTab === "analyze" && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-8 sm:mb-16">
              <p className="text-yellow-400 font-semibold text-sm sm:text-lg mb-3 sm:mb-4 tracking-wide uppercase">
                HEY, CONTENT CREATORS!
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
                Magnify Your
                <br />
                <span className="relative">
                  <span className="bg-yellow-400 text-blue-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl inline-block transform -rotate-1 text-sm sm:text-base md:text-lg">
                    Instagram Engagement
                  </span>
                </span>
                <br />
                by <span className="text-yellow-400">10X+</span>
              </h1>
              <p className="text-blue-200 text-base sm:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
                Search any public Instagram username with posts/reels to begin
                comprehensive analysis
              </p>

              {/* Mode Selection */}
              <div className="max-w-lg mx-auto mb-6 sm:mb-8 px-4">
                <div className="flex space-x-2 sm:space-x-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-white/20">
                  <button
                    onClick={() => setMode("normal")}
                    className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 ${
                      mode === "normal"
                        ? "bg-yellow-400 text-blue-900 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Normal</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode("vs")}
                    className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 ${
                      mode === "vs"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>VS Mode</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Normal Mode */}
              {mode === "normal" && (
                <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/20 shadow-2xl">
                    <form onSubmit={handleSubmit} className="relative">
                      <div className="relative mb-4 sm:mb-6">
                        <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter Instagram username..."
                          className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-blue-200 text-base sm:text-lg shadow-xl"
                          disabled={loading}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !username.trim()}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-3 border-blue-900 border-t-transparent mr-2 sm:mr-3"></div>
                            <span className="text-sm sm:text-base">
                              ANALYZING ENGAGEMENT...
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                            <span className="text-sm sm:text-base">
                              ANALYZE MY ENGAGEMENT
                            </span>
                            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                          </div>
                        )}
                      </button>
                    </form>

                    {error && (
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-500/20 border border-red-400/30 rounded-xl sm:rounded-2xl text-red-200 text-center backdrop-blur-sm text-sm sm:text-base">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VS Mode */}
              {mode === "vs" && (
                <div className="max-w-7xl mx-auto mb-12">
                  <CompareMode
                    onClose={() => setMode("normal")}
                    onAchievementUnlock={(achievement) => {
                      setUnlockedAchievement(achievement);
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 3000);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Results */}
            {data && (
              <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 mb-8 sm:mb-12 border border-white/20">
                  <div className="text-center mb-6 sm:mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                      @{data.username}
                    </h2>
                    <div className="inline-flex items-center bg-yellow-400 text-blue-900 px-4 sm:px-8 py-2 sm:py-4 rounded-full shadow-lg">
                      <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                      <span className="text-lg sm:text-2xl font-bold">
                        {data.engagementRate}% Engagement Rate
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                    {/* Followers */}
                    <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <Users className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
                          Total Followers
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {data.followers.toLocaleString()}
                      </div>
                      <div className="text-blue-200 text-xs sm:text-sm">
                        Active audience base
                      </div>
                    </div>

                    {/* Average Likes */}
                    <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
                          Average Likes
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {data.avgLikes.toLocaleString()}
                      </div>
                      <div className="text-blue-200 text-xs sm:text-sm">
                        Per post engagement
                      </div>
                    </div>

                    {/* Average Comments */}
                    <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
                          Average Comments
                        </span>
                      </div>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {data.avgComments.toLocaleString()}
                      </div>
                      <div className="text-blue-200 text-xs sm:text-sm">
                        Community interaction
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engagement Scale */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-white/20">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">
                    Industry Engagement Benchmarks
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-green-500/20 border border-green-400/30 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center">
                      <div className="text-green-400 font-bold text-sm sm:text-lg mb-1 sm:mb-2">
                        EXCELLENT
                      </div>
                      <div className="text-white text-xl sm:text-2xl font-bold">
                        6%+
                      </div>
                      <div className="text-green-200 text-xs sm:text-sm mt-1 sm:mt-2">
                        Top performers
                      </div>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-400/30 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center">
                      <div className="text-blue-400 font-bold text-sm sm:text-lg mb-1 sm:mb-2">
                        GOOD
                      </div>
                      <div className="text-white text-xl sm:text-2xl font-bold">
                        3% - 6%
                      </div>
                      <div className="text-blue-200 text-xs sm:text-sm mt-1 sm:mt-2">
                        Above average
                      </div>
                    </div>
                    <div className="bg-yellow-500/20 border border-yellow-400/30 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center">
                      <div className="text-yellow-400 font-bold text-sm sm:text-lg mb-1 sm:mb-2">
                        AVERAGE
                      </div>
                      <div className="text-white text-xl sm:text-2xl font-bold">
                        1% - 3%
                      </div>
                      <div className="text-yellow-200 text-xs sm:text-sm mt-1 sm:mt-2">
                        Industry standard
                      </div>
                    </div>
                    <div className="bg-red-500/20 border border-red-400/30 p-4 sm:p-6 rounded-lg sm:rounded-xl text-center">
                      <div className="text-red-400 font-bold text-sm sm:text-lg mb-1 sm:mb-2">
                        NEEDS WORK
                      </div>
                      <div className="text-white text-xl sm:text-2xl font-bold">
                        Below 1%
                      </div>
                      <div className="text-red-200 text-xs sm:text-sm mt-1 sm:mt-2">
                        Room for growth
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* How it works */}
            <div className="max-w-6xl mx-auto mt-12 sm:mt-20 px-4">
              <div className="text-center mb-8 sm:mb-12">
                <h3 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
                  How Our Analysis Works
                </h3>
                <p className="text-blue-200 text-base sm:text-xl">
                  Professional-grade Instagram analytics in three simple steps
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                <div className="text-center">
                  <div className="bg-yellow-400 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                    <Search className="h-8 w-8 sm:h-10 sm:w-10 text-blue-900" />
                  </div>
                  <h4 className="font-bold text-white text-lg sm:text-xl mb-3 sm:mb-4">
                    1. SEARCH
                  </h4>
                  <p className="text-blue-200 text-base sm:text-lg leading-relaxed px-2">
                    Enter any public Instagram username to begin comprehensive
                    analysis
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-400 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                    <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-900" />
                  </div>
                  <h4 className="font-bold text-white text-lg sm:text-xl mb-3 sm:mb-4">
                    2. ANALYZE
                  </h4>
                  <p className="text-blue-200 text-base sm:text-lg leading-relaxed px-2">
                    Our algorithms process recent posts, likes, comments, and
                    follower data
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-yellow-400 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                    <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-blue-900" />
                  </div>
                  <h4 className="font-bold text-white text-lg sm:text-xl mb-3 sm:mb-4">
                    3. OPTIMIZE
                  </h4>
                  <p className="text-blue-200 text-base sm:text-lg leading-relaxed px-2">
                    Get actionable insights and benchmarks to improve your
                    engagement
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="max-w-7xl mx-auto">
            <ExhibitionStats />
            <DailyChallenge stats={userStats} />
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === "quiz" && (
          <div className="max-w-4xl mx-auto">
            <Quiz />
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="max-w-4xl mx-auto">
            <Leaderboard entries={[]} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 sm:mt-16 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-blue-200 text-sm sm:text-base">
              Developed by{" "}
              <a
                href="https://github.com/shrey-bhandary"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors underline decoration-yellow-400/50 hover:decoration-yellow-300"
              >
                Shreyas Bhandary
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
