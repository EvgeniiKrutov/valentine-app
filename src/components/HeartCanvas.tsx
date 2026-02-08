import { useEffect, useRef, type FC } from 'react';
import { heartPoint } from '../utils/heart';

interface HeartCanvasProps {
  visible: boolean;
}

const HeartCanvas: FC<HeartCanvasProps> = ({ visible }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let currentScale = 0;
    const maxScale = 14;
    const speed = 0.15;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const baseScale = Math.min(w, h) / 40;

      currentScale = Math.min(currentScale + speed, maxScale);

      for (let s = 1; s <= Math.ceil(currentScale); s++) {
        const alpha =
          s <= currentScale ? 1 : currentScale - Math.floor(currentScale);

        const gradient = ctx.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          s * baseScale * 1.2,
        );
        gradient.addColorStop(0, `rgba(255, 10, 84, ${0.9 * alpha})`);
        gradient.addColorStop(0.5, `rgba(255, 77, 109, ${0.7 * alpha})`);
        gradient.addColorStop(1, `rgba(190, 18, 60, ${0.5 * alpha})`);

        ctx.beginPath();
        for (let n = 0; n <= 628; n++) {
          const t = n / 100;
          const { x, y } = heartPoint(t);
          const px = cx + x * s * (baseScale / 16);
          const py = cy + y * s * (baseScale / 16);
          if (n === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.shadowColor = 'rgba(255, 10, 84, 0.4)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(255, 179, 193, ${0.3 * alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (currentScale < maxScale) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      className="transition-opacity duration-700"
      style={{
        width: '100%',
        height: '100%',
        maxWidth: 400,
        maxHeight: 380,
        opacity: visible ? 1 : 0,
      }}
    />
  );
};

export default HeartCanvas;
