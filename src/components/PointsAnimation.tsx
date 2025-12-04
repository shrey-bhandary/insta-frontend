import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface PointsAnimationProps {
  points: number;
  onComplete: () => void;
}

export function PointsAnimation({ points, onComplete }: PointsAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`bg-yellow-400 text-blue-900 px-8 py-6 rounded-2xl shadow-2xl flex items-center space-x-3 transform transition-all duration-300 ${
          visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <Zap className="h-8 w-8 animate-pulse" />
        <div>
          <div className="text-3xl font-bold">+{points} Points!</div>
          <div className="text-sm font-semibold">Keep it up! 🔥</div>
        </div>
      </div>
    </div>
  );
}

