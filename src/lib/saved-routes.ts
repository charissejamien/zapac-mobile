import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { supabase } from "./supabase";

function storageKey(userId: string) {
  return `zapac-saved-routes-${userId}`;
}

export interface SavedRoute {
  id: string;
  user_id: string;
  name: string;
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  encoded_polyline: string;
  created_at: string;
}

export async function loadSavedRoutes(userId: string): Promise<SavedRoute[]> {
  const json = await AsyncStorage.getItem(storageKey(userId));
  return json ? JSON.parse(json) : [];
}

export async function saveRoute(route: SavedRoute): Promise<void> {
  const key = storageKey(route.user_id);

  const routes = await loadSavedRoutes(route.user_id);
  routes.unshift(route);
  await AsyncStorage.setItem(key, JSON.stringify(routes));

  supabase
    .from("saved_routes")
    .insert({
      user_id: route.user_id,
      name: route.name,
      origin_address: route.origin_address,
      origin_lat: route.origin_lat,
      origin_lng: route.origin_lng,
      destination_address: route.destination_address,
      destination_lat: route.destination_lat,
      destination_lng: route.destination_lng,
      encoded_polyline: route.encoded_polyline,
    })
    .select()
    .single()
    .then(({ data }) => {
      if (data) {
        loadSavedRoutes(route.user_id).then((current) => {
          const updated = current.map((r) =>
            r.id === route.id
              ? { ...r, id: data.id, created_at: data.created_at }
              : r,
          );
          AsyncStorage.setItem(key, JSON.stringify(updated));
        });
      }
    });
}

export async function deleteSavedRoute(
  userId: string,
  id: string,
): Promise<void> {
  const routes = await loadSavedRoutes(userId);
  const filtered = routes.filter((r) => r.id !== id);
  await AsyncStorage.setItem(storageKey(userId), JSON.stringify(filtered));

  await supabase.from("saved_routes").delete().eq("id", id);
}

export async function syncRoutesFromSupabase(userId: string): Promise<void> {
  try {
    const { data: remoteRoutes } = await supabase
      .from("saved_routes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!remoteRoutes) return;

    const localRoutes = await loadSavedRoutes(userId);
    const remoteIds = new Set(remoteRoutes.map((r: any) => r.id));
    const localOnly = localRoutes.filter((r) => !remoteIds.has(r.id));

    for (const route of localOnly) {
      try {
        await supabase.from("saved_routes").upsert(route);
      } catch (_) {}
    }

    const merged = [...remoteRoutes, ...localOnly].sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    await AsyncStorage.setItem(storageKey(userId), JSON.stringify(merged));
  } catch (_) {}
}

export function decodePolyline(
  encoded: string,
): { latitude: number; longitude: number }[] {
  const points: { latitude: number; longitude: number }[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
}

const GOOGLE_MAPS_API_KEY = Platform.select({
  ios: "AIzaSyCWHublkXuYaWfT68qUwGY3o5L9NB82JA8",
  android: "AIzaSyAJP6e_5eBGz1j8b6DEKqLT-vest54Atkc",
});

export async function fetchDirections(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.routes && json.routes.length > 0) {
      return json.routes[0].overview_polyline.points;
    }
    return null;
  } catch {
    return null;
  }
}
