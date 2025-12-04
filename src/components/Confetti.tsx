import { useEffect, useState } from "react";

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      rotation: number;
      velocityX: number;
      velocityY: number;
    }>
  >([]);

  useEffect(() => {
    if (trigger) {
      const colors = [
        "#FFD700",
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#FFA07A",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
      ];
      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -50,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 10,
        velocityY: Math.random() * 5 + 2,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `fall ${2 + Math.random() * 2}s linear forwards`,
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(${
              window.innerHeight + 100
            }px) rotate(${360}deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
