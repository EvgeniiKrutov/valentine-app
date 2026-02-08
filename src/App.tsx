import { useState, useCallback, useMemo, type FC, type CSSProperties, useEffect } from "react";
import FloatingHearts from "./components/FloatingHearts";
import Sparkles from "./components/Sparkles";
import HeartCanvas from "./components/HeartCanvas";
import PS5Trophy from "./components/PS5Trophy";
import MusicToggle from "./components/MusicToggle";
import { useBackgroundMusic } from "./hooks/useBackgroundMusic";

type AppState = "question" | "yes" | "no";

const App: FC = () => {
  const [state, setState] = useState<AppState>("question");
  const [showSparkles, setShowSparkles] = useState(false);
  const { isPlaying, toggle: toggleMusic } = useBackgroundMusic();

  const handleYes = useCallback(() => {
    setState("yes");
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1200);
  }, []);

  const handleNo = useCallback(() => {
    setState("no");
  }, []);

  const handleReset = useCallback(() => {
    setState("question");
  }, []);

  return (
    <div className="valentine-bg text-white font-body">
      <FloatingHearts />
      <MusicToggle isPlaying={isPlaying} onToggle={toggleMusic} />

      <div className="relative z-[1] min-h-screen flex items-center justify-center p-6">
        {state === "question" && (
          <div className="glass-card max-w-[520px] w-full flex flex-col items-center gap-7 p-12 max-sm:p-8 max-sm:mx-3 animate-fade-in-up">
            <div className="text-5xl sm:text-6xl animate-heart-beat drop-shadow-[0_0_20px_rgba(255,50,100,0.5)]">
              💝
            </div>

            <h1 className="heading-gradient font-display font-bold text-center leading-tight text-[clamp(28px,6vw,52px)] animate-fade-in-up">
              Ты будешь моей Валентинкой?
            </h1>

            <div
              className="flex gap-4 mt-2 flex-wrap justify-center animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                className="btn-yes animate-pulse-glow"
                onClick={handleYes}
              >
                Да
              </button>
              <button
                className="btn-no"
                onClick={handleNo}
              >
                Нет
              </button>
            </div>
          </div>
        )}

        {state === "yes" && (
          <div className="flex flex-col items-center gap-6 max-w-[520px] w-full relative">
            <Sparkles active={showSparkles} />

            <div
              className="w-full max-w-[400px] flex items-center justify-center animate-fade-in-up"
              style={{ aspectRatio: "1 / 0.95" }}
            >
              <HeartCanvas visible />
            </div>

            <p className="font-display italic text-valentine-100 text-center text-[clamp(20px,4vw,28px)] leading-relaxed animate-fade-in-up [animation-delay:0.3s] [text-shadow:0_0_40px_rgba(255,100,150,0.3)]">
              Лисенок я обожаю тебя!🦊
              <br />
              С Днем святого Валентина! 💗
            </p>

            <button
              className="btn-back animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
              onClick={handleReset}
            >
              ← Назад
            </button>
          </div>
        )}

        {state === "no" && (
          <div className="flex flex-col items-center gap-7 max-w-[480px] w-full px-4">
            <div className="text-5xl animate-fade-in-up">🎮</div>

            <PS5Trophy visible />

            <button
              className="btn-back animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
              onClick={handleReset}
            >
              ← Попробовать снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
