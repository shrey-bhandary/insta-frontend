import { useEffect, useState } from "react";
import { Award, X } from "lucide-react";
import { Achievement } from "../utils/gamification";
import { Confetti } from "./Confetti";

interface AchievementUnlockProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementUnlock({
  achievement,
  onClose,
}: AchievementUnlockProps) {
  const [visible, setVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setShowConfetti(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <Confetti trigger={showConfetti} />
      <div className="pointer-events-auto">
        <div
          className={`bg-gradient-to-br from-yellow-400 to-orange-400 text-blue-900 p-8 rounded-3xl shadow-2xl max-w-md transform transition-all duration-500 ${
            visible
              ? "scale-100 opacity-100 rotate-0"
              : "scale-0 opacity-0 rotate-12"
          }`}
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">
              {achievement.icon}
            </div>
            <Award className="h-12 w-12 mx-auto mb-4 text-blue-900" />
            <h3 className="text-3xl font-bold mb-2">Achievement Unlocked!</h3>
            <h4 className="text-2xl font-bold mb-3">{achievement.name}</h4>
            <p className="text-lg mb-4">{achievement.description}</p>
            {achievement.points > 0 && (
              <div className="text-xl font-bold bg-blue-900/20 px-4 py-2 rounded-full inline-block">
                +{achievement.points} Points
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-4 right-4 text-blue-900 hover:text-blue-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
