import { Sparkles, Trophy, Target, Zap, TrendingUp } from "lucide-react";

export function FeatureShowcase() {
  const features = [
    {
      icon: Zap,
      text: "Instant Analysis",
      colorClass: "bg-yellow-400/20 text-yellow-400",
    },
    {
      icon: Trophy,
      text: "Gamified Experience",
      colorClass: "bg-purple-400/20 text-purple-400",
    },
    {
      icon: Target,
      text: "Daily Challenges",
      colorClass: "bg-pink-400/20 text-pink-400",
    },
    {
      icon: TrendingUp,
      text: "Real-time Stats",
      colorClass: "bg-blue-400/20 text-blue-400",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-yellow-400 mr-3 animate-pulse" />
          <h2 className="text-3xl font-bold text-white">
            Exhibition <span className="text-yellow-400">Showcase</span>
          </h2>
        </div>

        <p className="text-center text-blue-200 mb-6 text-lg">
          Experience the future of Instagram analytics with gamification!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${feature.colorClass} mb-3`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-sm font-bold text-white">
                  {feature.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
