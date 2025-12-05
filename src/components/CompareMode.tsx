import { useState, useEffect } from "react";
import { Users, TrendingUp, Heart, BarChart3, X, Search } from "lucide-react";
import { unlockVsModeAchievement } from "../utils/gamification";

interface EngagementData {
  username: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: string;
}

interface CompareModeProps {
  onClose: () => void;
  onAchievementUnlock?: (achievement: any) => void;
}

export function CompareMode({
  onClose,
  onAchievementUnlock,
}: CompareModeProps) {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [data1, setData1] = useState<EngagementData | null>(null);
  const [data2, setData2] = useState<EngagementData | null>(null);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const fetchAccount = async (username: string, isFirst: boolean) => {
    if (!username.trim()) {
      if (isFirst) setError1("Please enter a valid username");
      else setError2("Please enter a valid username");
      return;
    }

    if (isFirst) {
      setLoading1(true);
      setError1(null);
      setData1(null);
    } else {
      setLoading2(true);
      setError2(null);
      setData2(null);
    }

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
        if (isFirst) setError1(result.error);
        else setError2(result.error);
      } else {
        const received: EngagementData = {
          username: result.username ?? username.trim(),
          followers: result.followers,
          avgLikes: result.avgLikes,
          avgComments: result.avgComments,
          engagementRate: String(result.engagementRate),
        };
        if (isFirst) {
          setData1(received);
        } else {
          setData2(received);
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to analyze engagement. Please try again.";
      if (isFirst) setError1(message);
      else setError2(message);
    } finally {
      if (isFirst) setLoading1(false);
      else setLoading2(false);
    }
  };

  // Unlock VS mode achievement when both accounts are analyzed
  useEffect(() => {
    if (data1 && data2 && onAchievementUnlock) {
      const newAchievements = unlockVsModeAchievement();
      if (newAchievements.length > 0) {
        onAchievementUnlock(newAchievements[0]);
      }
    }
  }, [data1, data2]);

  const engagementRate1 = data1 ? parseFloat(data1.engagementRate) : 0;
  const engagementRate2 = data2 ? parseFloat(data2.engagementRate) : 0;

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-3xl shadow-2xl w-full border border-white/20 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-yellow-400 transition-colors z-10 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <div className="p-4 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400 mr-2 sm:mr-3" />
            VS Mode
          </h2>
          <p className="text-blue-200 text-sm sm:text-base">
            Compare two Instagram accounts side by side
          </p>
        </div>

        <div className="relative mb-6 sm:mb-8">
          <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center">
            {/* Account 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Account 1
              </h3>
              <div className="relative mb-3 sm:mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <input
                  type="text"
                  value={username1}
                  onChange={(e) => setUsername1(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-blue-200 text-sm sm:text-base min-h-[44px]"
                  disabled={loading1 || loading2}
                />
              </div>

              {error1 && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-500/20 border border-red-400/30 rounded-lg sm:rounded-xl text-red-200 text-xs sm:text-sm">
                  {error1}
                </div>
              )}

              {data1 && (
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                      @{data1.username}
                    </div>
                    <div className="inline-flex items-center bg-yellow-400 text-blue-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      <span className="font-bold text-sm sm:text-base">
                        {data1.engagementRate}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mx-auto mb-1" />
                      <div className="text-base sm:text-lg font-bold text-white">
                        {data1.followers.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-200">Followers</div>
                    </div>
                    <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mx-auto mb-1" />
                      <div className="text-base sm:text-lg font-bold text-white">
                        {data1.avgLikes.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-200">Avg Likes</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center z-10 my-4 md:my-0">
              <div className="bg-yellow-400 text-blue-900 px-3 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6 rounded-full font-bold text-lg sm:text-xl md:text-2xl shadow-2xl min-w-[50px] sm:min-w-[70px] md:min-w-[80px] flex items-center justify-center">
                VS
              </div>
            </div>

            {/* Account 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Account 2
              </h3>
              <div className="relative mb-3 sm:mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <input
                  type="text"
                  value={username2}
                  onChange={(e) => setUsername2(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-blue-200 text-sm sm:text-base min-h-[44px]"
                  disabled={loading1 || loading2}
                />
              </div>

              {error2 && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-red-500/20 border border-red-400/30 rounded-lg sm:rounded-xl text-red-200 text-xs sm:text-sm">
                  {error2}
                </div>
              )}

              {data2 && (
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                      @{data2.username}
                    </div>
                    <div className="inline-flex items-center bg-yellow-400 text-blue-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                      <span className="font-bold text-sm sm:text-base">
                        {data2.engagementRate}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mx-auto mb-1" />
                      <div className="text-base sm:text-lg font-bold text-white">
                        {data2.followers.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-200">Followers</div>
                    </div>
                    <div className="bg-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mx-auto mb-1" />
                      <div className="text-base sm:text-lg font-bold text-white">
                        {data2.avgLikes.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-200">Avg Likes</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Single Analyze Button */}
          <div className="mt-4 sm:mt-6 flex justify-center">
            <button
              onClick={() => {
                if (username1.trim()) fetchAccount(username1, true);
                if (username2.trim()) fetchAccount(username2, false);
              }}
              disabled={
                loading1 || loading2 || (!username1.trim() && !username2.trim())
              }
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 sm:px-12 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
            >
              {loading1 || loading2 ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-blue-900 border-t-transparent"></div>
                  <span className="text-sm sm:text-base">Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">
                    Analyze Both Accounts
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        {data1 && data2 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
              Comparison Results
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xs sm:text-sm text-blue-200 mb-1 sm:mb-2">
                  Engagement Rate
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  {engagementRate1 > engagementRate2 ? (
                    <span className="text-green-400">
                      @{data1.username} Wins!
                    </span>
                  ) : engagementRate2 > engagementRate1 ? (
                    <span className="text-green-400">
                      @{data2.username} Wins!
                    </span>
                  ) : (
                    <span className="text-yellow-400">Tie!</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-blue-200">
                  {data1.engagementRate}% vs {data2.engagementRate}%
                </div>
              </div>

              <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xs sm:text-sm text-blue-200 mb-1 sm:mb-2">
                  Followers
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  {data1.followers > data2.followers ? (
                    <span className="text-green-400">@{data1.username}</span>
                  ) : data2.followers > data1.followers ? (
                    <span className="text-green-400">@{data2.username}</span>
                  ) : (
                    <span className="text-yellow-400">Tie</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-blue-200">
                  {Math.abs(data1.followers - data2.followers).toLocaleString()}{" "}
                  difference
                </div>
              </div>

              <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xs sm:text-sm text-blue-200 mb-1 sm:mb-2">
                  Avg Likes
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  {data1.avgLikes > data2.avgLikes ? (
                    <span className="text-green-400">@{data1.username}</span>
                  ) : data2.avgLikes > data1.avgLikes ? (
                    <span className="text-green-400">@{data2.username}</span>
                  ) : (
                    <span className="text-yellow-400">Tie</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-blue-200">
                  {Math.abs(data1.avgLikes - data2.avgLikes).toLocaleString()}{" "}
                  difference
                </div>
              </div>

              <div className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <div className="text-xs sm:text-sm text-blue-200 mb-1 sm:mb-2">
                  Avg Comments
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  {data1.avgComments > data2.avgComments ? (
                    <span className="text-green-400">@{data1.username}</span>
                  ) : data2.avgComments > data1.avgComments ? (
                    <span className="text-green-400">@{data2.username}</span>
                  ) : (
                    <span className="text-yellow-400">Tie</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-blue-200">
                  {Math.abs(
                    data1.avgComments - data2.avgComments
                  ).toLocaleString()}{" "}
                  difference
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
