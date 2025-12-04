import { Zap, Sparkles } from "lucide-react";

interface QuickDemoProps {
  onDemoClick: (username: string) => void;
  loading: boolean;
}

const DEMO_ACCOUNTS = [
  { username: "cristiano", label: "Cristiano Ronaldo", engagement: "High" },
  { username: "leomessi", label: "Leo Messi", engagement: "High" },
  { username: "natgeo", label: "National Geographic", engagement: "Medium" },
  { username: "nasa", label: "NASA", engagement: "High" },
  { username: "selenagomez", label: "Selena Gomez", engagement: "High" },
];

export function QuickDemo({ onDemoClick, loading }: QuickDemoProps) {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-400/40 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Quick Demo</h3>
        </div>
        <div className="text-xs text-purple-200 bg-purple-500/30 px-3 py-1 rounded-full">
          Try it out!
        </div>
      </div>

      <p className="text-blue-200 text-sm mb-4">
        Click any account below to see instant engagement analysis:
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.username}
            onClick={() => onDemoClick(account.username)}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="text-xs font-bold text-white mb-1">
                @{account.username}
              </div>
              <div className="text-xs text-purple-300">
                {account.engagement}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
