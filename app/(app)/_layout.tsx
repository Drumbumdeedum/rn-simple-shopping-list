import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import Auth from "@/components/auth/Auth";
import { useSession } from "@/context";
import React from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { fetchUserById } from "@/hooks/profile";
import useUserStore from "@/state/userStore";
import { fetchShoppingListsByUserId } from "@/hooks/shoppingList";
import useShoppingListStore from "@/state/shoppingListStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const session = useSession();
  const { user, setUser } = useUserStore();
  const { setShoppingLists } = useShoppingListStore();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!session.isLoading && session.session && !user) {
      const sessionObject = JSON.parse(session.session);
      const fetchUser = async (id: string) => {
        const resultUser = await fetchUserById(id);
        setUser(resultUser);
        const resultLists = await fetchShoppingListsByUserId(resultUser.id);
        setShoppingLists(resultLists);
      };
      fetchUser(sessionObject.user.id);
    }
  }, [session]);

  if (!loaded) {
    return null;
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {session.isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          {!session.session && <Auth />}
          {session.session && (
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          )}
        </>
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
