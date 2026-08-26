const PROFILE_NAME_KEY = "platformvideos.profile.name";

function getSessionStorage() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

export function readCachedProfileName() {
  const storage = getSessionStorage();
  if (!storage) return null;

  const value = storage.getItem(PROFILE_NAME_KEY);
  return value && value.trim() ? value.trim() : null;
}

export function writeCachedProfileName(name: string) {
  const storage = getSessionStorage();
  if (!storage) return;

  const trimmedName = name.trim();
  if (trimmedName) storage.setItem(PROFILE_NAME_KEY, trimmedName);
}

export function clearCachedProfileName() {
  const storage = getSessionStorage();
  if (!storage) return;

  storage.removeItem(PROFILE_NAME_KEY);
}
