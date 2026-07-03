export const HERO_AUDIO_UNLOCK_KEY = "heroAudioUnlocked";

export function markHeroAudioUnlocked() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(HERO_AUDIO_UNLOCK_KEY, "1");
}
