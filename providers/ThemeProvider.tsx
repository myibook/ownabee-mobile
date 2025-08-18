import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  Theme,
} from "@react-navigation/native";
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}>({
  theme: DefaultTheme,
  toggleTheme: () => {},
  isDark: false,
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <NavigationThemeProvider value={theme}>
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
