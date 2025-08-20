import React, { useState } from 'react';
import { Search, Instagram, TrendingUp, Users, Heart, MessageCircle, BarChart3, ArrowRight } from 'lucide-react';

interface EngagementData {
  username: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: string;
}

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EngagementData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a valid username');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch('/api/engagement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        setError(result.error || 'Failed to analyze engagement.');
      } else {
        const received: EngagementData = {
          username: result.username ?? username.trim(),
          followers: result.followers,
          avgLikes: result.avgLikes,
          avgComments: result.avgComments,
          engagementRate: String(result.engagementRate),
        };
        setData(received);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to analyze engagement. Please try again.';
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
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.1) 35px,
            rgba(255,255,255,0.1) 70px
          )`
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Instagram className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">
              insta<span className="text-yellow-400">analytics</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="text-yellow-400 font-semibold text-lg mb-4 tracking-wide uppercase">
            HEY, CONTENT CREATORS!
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Magnify Your
            <br />
            <span className="relative">
              <span className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-2xl inline-block transform -rotate-1">
                Instagram Engagement
              </span>
            </span>
            <br />
            by <span className="text-yellow-400">10X+</span>
          </h1>
          <p className="text-blue-200 text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Since 2020, we've helped creators analyze their engagement rates with precision.
            <br />
            Unlock insights in 30 seconds or get detailed analytics.
          </p>

          {/* Search Form */}
          <div className="max-w-lg mx-auto mb-12">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative mb-6">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-blue-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Instagram username..."
                  className="w-full pl-16 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-blue-200 text-lg shadow-xl"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-900 border-t-transparent mr-3"></div>
                    ANALYZING ENGAGEMENT...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 mr-3" />
                    ANALYZE MY ENGAGEMENT
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </div>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-2xl text-red-200 text-center backdrop-blur-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {data && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-12 border border-white/20">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-white mb-4">
                  @{data.username}
                </h2>
                <div className="inline-flex items-center bg-yellow-400 text-blue-900 px-8 py-4 rounded-full shadow-lg">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  <span className="text-2xl font-bold">
                    {data.engagementRate}% Engagement Rate
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Followers */}
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <Users className="h-10 w-10 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                      Total Followers
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {data.followers.toLocaleString()}
                  </div>
                  <div className="text-blue-200 text-sm">
                    Active audience base
                  </div>
                </div>

                {/* Average Likes */}
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <Heart className="h-10 w-10 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                      Average Likes
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {data.avgLikes.toLocaleString()}
                  </div>
                  <div className="text-blue-200 text-sm">
                    Per post engagement
                  </div>
                </div>

                {/* Average Comments */}
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <MessageCircle className="h-10 w-10 text-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">
                      Average Comments
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {data.avgComments.toLocaleString()}
                  </div>
                  <div className="text-blue-200 text-sm">
                    Community interaction
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Scale */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Industry Engagement Benchmarks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-500/20 border border-green-400/30 p-6 rounded-xl text-center">
                  <div className="text-green-400 font-bold text-lg mb-2">EXCELLENT</div>
                  <div className="text-white text-2xl font-bold">6%+</div>
                  <div className="text-green-200 text-sm mt-2">Top performers</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-400/30 p-6 rounded-xl text-center">
                  <div className="text-blue-400 font-bold text-lg mb-2">GOOD</div>
                  <div className="text-white text-2xl font-bold">3% - 6%</div>
                  <div className="text-blue-200 text-sm mt-2">Above average</div>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-400/30 p-6 rounded-xl text-center">
                  <div className="text-yellow-400 font-bold text-lg mb-2">AVERAGE</div>
                  <div className="text-white text-2xl font-bold">1% - 3%</div>
                  <div className="text-yellow-200 text-sm mt-2">Industry standard</div>
                </div>
                <div className="bg-red-500/20 border border-red-400/30 p-6 rounded-xl text-center">
                  <div className="text-red-400 font-bold text-lg mb-2">NEEDS WORK</div>
                  <div className="text-white text-2xl font-bold">Below 1%</div>
                  <div className="text-red-200 text-sm mt-2">Room for growth</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-6">
              How Our Analysis Works
            </h3>
            <p className="text-blue-200 text-xl">
              Professional-grade Instagram analytics in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-yellow-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Search className="h-10 w-10 text-blue-900" />
              </div>
              <h4 className="font-bold text-white text-xl mb-4">1. SEARCH</h4>
              <p className="text-blue-200 text-lg leading-relaxed">
                Enter any public Instagram username to begin comprehensive analysis
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <BarChart3 className="h-10 w-10 text-blue-900" />
              </div>
              <h4 className="font-bold text-white text-xl mb-4">2. ANALYZE</h4>
              <p className="text-blue-200 text-lg leading-relaxed">
                Our algorithms process recent posts, likes, comments, and follower data
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-400 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <TrendingUp className="h-10 w-10 text-blue-900" />
              </div>
              <h4 className="font-bold text-white text-xl mb-4">3. OPTIMIZE</h4>
              <p className="text-blue-200 text-lg leading-relaxed">
                Get actionable insights and benchmarks to improve your engagement
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Magnify Your Instagram Presence?
            </h3>
            <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of creators who use our analytics to optimize their content strategy and boost engagement rates.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              START ANALYZING NOW
              <ArrowRight className="inline-block ml-3 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;