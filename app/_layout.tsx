import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

// Import your DB initializer
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "./db/database";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="expenses.db" onInit={migrateDbIfNeeded} useSuspense>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen
            name="add-expense"
            options={{ presentation: "modal", title: "Add Expense" }}
          />
          <Stack.Screen
            name="budget-settings"
            options={{ presentation: "modal", title: "Set Budget" }}
          />
        </Stack>
      </SQLiteProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
