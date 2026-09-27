import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechErrorKind = "no-speech" | "not-allowed" | "other";

interface UseSpeechRecognitionOptions {
  lang: string;
  onResult: (transcript: string) => void;
}

/** Wraps the (vendor-prefixed) Web Speech API. Feature-detected: check `supported` before showing a mic control. */
export function useSpeechRecognition({ lang, onResult }: UseSpeechRecognitionOptions) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<SpeechErrorKind | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const supported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const start = useCallback(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;
    recognitionRef.current?.abort();
    setError(null);
    const recognition = new Ctor();
    recognitionRef.current = recognition;
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onResult(transcript);
    };
    recognition.onerror = (event) => {
      setError(event.error === "no-speech" || event.error === "not-allowed" ? event.error : "other");
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }, [lang, onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  return { supported, listening, error, start, stop };
}
