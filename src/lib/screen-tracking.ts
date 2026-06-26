import { useEffect, useRef } from "react";
import { usePathname } from "expo-router";
import { AppState } from "react-native";
import { supabase } from "./supabase";

export function useScreenTracking() {
  const pathname = usePathname();
  const enteredAt = useRef<number>(Date.now());
  const currentScreen = useRef<string>(pathname);
  const userId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      userId.current = user?.id ?? null;
    });
  }, []);

  useEffect(() => {
    const prevScreen = currentScreen.current;
    const prevEnteredAt = enteredAt.current;

    currentScreen.current = pathname;
    enteredAt.current = Date.now();

    if (userId.current && prevScreen) {
      const duration = Math.round((Date.now() - prevEnteredAt) / 1000);
      if (duration > 0 && duration < 3600) {
        supabase.from("screen_views").insert({
          user_id: userId.current,
          screen_name: prevScreen,
          entered_at: new Date(prevEnteredAt).toISOString(),
          duration_seconds: duration,
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background" && userId.current) {
        const duration = Math.round((Date.now() - enteredAt.current) / 1000);
        if (duration > 0 && duration < 3600) {
          supabase.from("screen_views").insert({
            user_id: userId.current,
            screen_name: currentScreen.current,
            entered_at: new Date(enteredAt.current).toISOString(),
            duration_seconds: duration,
          });
        }
      }
      if (state === "active") {
        enteredAt.current = Date.now();
      }
    });

    return () => sub.remove();
  }, []);
}
