import type { FC } from "react";

interface MusicToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

const MusicToggle: FC<MusicToggleProps> = ({ isPlaying, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={isPlaying ? "Выключить музыку" : "Включить музыку"}
      title={isPlaying ? "Выключить музыку" : "Включить музыку"}
      className="fixed top-5 right-5 z-50 w-12 h-12 rounded-full
        flex items-center justify-center cursor-pointer
        transition-all duration-300 hover:scale-110 active:scale-95
        backdrop-blur-md"
      style={{
        background: isPlaying
          ? "rgba(255, 10, 84, 0.15)"
          : "rgba(255, 255, 255, 0.05)",
        border: `1px solid ${isPlaying ? "rgba(255, 10, 84, 0.3)" : "rgba(255,255,255,0.1)"}`,
        boxShadow: isPlaying
          ? "0 0 20px rgba(255, 10, 84, 0.2)"
          : "none",
      }}
    >
      {isPlaying ? (
        <div className="flex items-end gap-[3px] h-5">
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full"
              style={{
                background: "linear-gradient(to top, #ff0a54, #ffb3c6)",
                animation: `soundBar 0.8s ${delay}s ease-in-out infinite alternate`,
                height: "60%",
              }}
            />
          ))}
        </div>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
};

export default MusicToggle;
