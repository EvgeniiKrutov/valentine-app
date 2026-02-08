/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      colors: {
        valentine: {
          50: "#ffd6e0",
          100: "#ffb3c6",
          200: "#ff8fab",
          300: "#ff6b8a",
          400: "#ff4d6d",
          500: "#ff0a54",
          600: "#d90429",
          700: "#a4133c",
          800: "#800f2f",
          900: "#590d22",
        },
      },
      animation: {
        "heart-beat": "heartBeat 1.5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.7s ease both",
        "trophy-slide": "trophySlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        heartBeat: {
          "0%, 100%": { transform: "scale(1)" },
          "15%": { transform: "scale(1.15)" },
          "30%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.08)" },
          "60%": { transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255, 10, 84, 0.3), 0 8px 32px rgba(0,0,0,0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(255, 10, 84, 0.5), 0 8px 32px rgba(0,0,0,0.3)",
          },
        },
        fadeInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        trophySlideIn: {
          "0%": { transform: "translateY(40px) scale(0.9)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
