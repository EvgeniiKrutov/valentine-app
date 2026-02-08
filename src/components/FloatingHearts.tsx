import { useMemo, type FC } from 'react';

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  symbol: string;
  drift: number;
  color: string;
}

const SYMBOLS = ['♥', '❤', '💕', '♡'] as const;

const FloatingHearts: FC = () => {
  const hearts = useMemo<Heart[]>(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 10,
        size: 10 + Math.random() * 24,
        opacity: 0.08 + Math.random() * 0.18,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        drift: -30 + Math.random() * 60,
        color: `hsl(${340 + Math.random() * 30}, 80%, ${55 + Math.random() * 20}%)`,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute"
          style={{
            left: `${h.left}%`,
            bottom: '-40px',
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            color: h.color,
            animation: `floatUp ${h.duration}s ${h.delay}s ease-in infinite`,
            // @ts-expect-error -- CSS custom property
            '--drift': `${h.drift}px`,
          }}
        >
          {h.symbol}
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
