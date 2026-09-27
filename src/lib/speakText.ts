export type SpeakResult = "spoken" | "no-voice" | "unsupported";

function findVoice(langTag: string): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices();
  const base = langTag.split("-")[0].toLowerCase();
  return voices.find((v) => v.lang === langTag) ?? voices.find((v) => v.lang.toLowerCase().startsWith(base)) ?? null;
}

/** Reads text aloud in a voice matching langTag (e.g. "hi-IN"). Returns "no-voice" instead of silently mispronouncing with the wrong voice. */
export function speakText(text: string, langTag: string): SpeakResult {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return "unsupported";
  const voice = findVoice(langTag);
  if (!voice) return "no-voice";
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = langTag;
  speechSynthesis.speak(utterance);
  return "spoken";
}
