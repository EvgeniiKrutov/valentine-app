import { useMemo, type FC } from "react";

interface SparklesProps {
  active: boolean;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  color: string;
}

const COLORS = ["#ff6b8a", "#ff4d6d", "#ffb3c1", "#ffd6e0", "#ff0a54"];

const Sparkles: FC<SparklesProps> = ({ active }) => {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        angle: (i / 30) * 360,
        distance: 60 + Math.random() * 120,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 0.4,
        color: COLORS[i % COLORS.length],
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <span
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              animation: `sparkle 0.8s ${p.delay}s ease-out forwards`,
              // @ts-expect-error -- CSS custom properties
              "--tx": `${Math.cos(rad) * p.distance}px`,
              "--ty": `${Math.sin(rad) * p.distance}px`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Sparkles;
