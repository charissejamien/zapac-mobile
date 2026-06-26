import AsyncStorage from "@react-native-async-storage/async-storage";

function storageKey(userId: string) {
  return `zapac-recent-searches-${userId}`;
}

const MAX_RECENT = 10;

export interface RecentSearch {
  latitude: number;
  longitude: number;
  name: string;
  searched_at: string;
}

export async function loadRecentSearches(
  userId: string,
): Promise<RecentSearch[]> {
  const json = await AsyncStorage.getItem(storageKey(userId));
  return json ? JSON.parse(json) : [];
}

export async function addRecentSearch(
  userId: string,
  search: Omit<RecentSearch, "searched_at">,
): Promise<void> {
  const searches = await loadRecentSearches(userId);
  const filtered = searches.filter((s) => s.name !== search.name);
  filtered.unshift({ ...search, searched_at: new Date().toISOString() });
  await AsyncStorage.setItem(
    storageKey(userId),
    JSON.stringify(filtered.slice(0, MAX_RECENT)),
  );
}
