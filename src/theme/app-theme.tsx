import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const THEME_STORAGE_KEY = "zapac-theme";

const lightColors = {
  background: "#F7F7F7",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  surfaceMuted: "#EEF3FB",
  text: "#404040",
  textMuted: "#8C8C8C",
  border: "#D8DFE8",
  overlay: "rgba(0,0,0,0.42)",
  primary: "#527AAF",
  primarySoft: "#EEF3FB",
  accent: "#74AFA0",
  danger: "#F06E72",
  dangerSoft: "#FFF0F1",
  mapSheet: "#F6F6F6",
  input: "#F9F9F9",
} as const;

const darkColors: AppThemeColors = {
  background: "#111923",
  surface: "#1B2634",
  surfaceElevated: "#253246",
  surfaceMuted: "#29394D",
  text: "#F4F7FB",
  textMuted: "#AAB8C9",
  border: "#3A4A5E",
  overlay: "rgba(0,0,0,0.66)",
  primary: "#6F96C9",
  primarySoft: "#293C55",
  accent: "#83C1B2",
  danger: "#FF8589",
  dangerSoft: "#472D35",
  mapSheet: "#17212D",
  input: "#253246",
};

export type AppThemeColors = {
  [Key in keyof typeof lightColors]: string;
};

type AppThemeContextValue = {
  colors: AppThemeColors;
  isDark: boolean;
  setDarkMode: (enabled: boolean) => void;
  toggleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((storedTheme) => {
      if (storedTheme) setIsDark(storedTheme === "dark");
    });
  }, []);

  const setDarkMode = (enabled: boolean) => {
    setIsDark(enabled);
    void AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      enabled ? "dark" : "light",
    );
  };

  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      setDarkMode,
      toggleTheme: () => setDarkMode(!isDark),
    }),
    [isDark],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }
  return context;
}
