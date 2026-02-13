/** Centralised app config sourced from .env via Vite */

function env(key: string, fallback: string): string {
  return (import.meta.env[key] as string | undefined) ?? fallback;
}

export const config = {
  recipientName: env("VITE_RECIPIENT_NAME", "Таня"),
  yesMessage: env("VITE_YES_MESSAGE", `Целую тебя, мой лисенок 💗🦊|"Зеленая книга", 1:09:04`),
} as const;

/** Split "line1|line2" into array */
export function getYesMessageLines(): string[] {
  return config.yesMessage.split("|");
}
