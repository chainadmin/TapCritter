const STORAGE_KEY = "tapCritterSave_v1";

export function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Failed to load save", error);
    return null;
  }
}

export function getOfflineEarnings(saveData, now = Date.now()) {
  if (!saveData || !saveData.lastTimestamp) {
    return 0;
  }
  const secondsAway = Math.max(0, (now - saveData.lastTimestamp) / 1000);
  const idleRate = Number(saveData.idleRate) || 0;
  return Math.floor(idleRate * secondsAway);
}

export function saveGame(state) {
  try {
    const payload = {
      coins: state.coins,
      tapPower: state.tapPower,
      idleRate: state.idleRate,
      tapLevel: state.tapLevel,
      idleLevel: state.idleLevel,
      lastTimestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Failed to save game", error);
  }
}
