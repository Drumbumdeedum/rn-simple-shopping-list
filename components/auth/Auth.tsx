import React, { useState } from "react";
import { Alert, View, AppState, Button, Image } from "react-native";
import { useSession } from "@/context";
import { router } from "expo-router";
import ParallaxScrollView from "../ParallaxScrollView";
import { ThemedText } from "../ThemedText";
import { supabase } from "@/utils/initSupabase";
import { Input } from "../ui/Input";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await signIn(email, password);

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    router.replace("/");
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={{
            height: 178,
            width: 290,
            bottom: 0,
            left: 0,
            position: "absolute",
          }}
        />
      }
    >
      <View className="h-screen">
        <View className="container gap-2">
          <View>
            <ThemedText>Email</ThemedText>
            <Input
              placeholder="Email"
              //   leftIcon={{ type: 'font-awesome', name: 'envelope' }}
              onChangeText={(text: React.SetStateAction<string>) =>
                setEmail(text)
              }
              value={email}
              //   placeholder="email@address.com"
              autoCapitalize={"none"}
            />
          </View>
          <View>
            <ThemedText>Password</ThemedText>
            <Input
              placeholder="Password"
              //   leftIcon={{ type: 'font-awesome', name: 'lock' }}
              onChangeText={(text: React.SetStateAction<string>) =>
                setPassword(text)
              }
              value={password}
              secureTextEntry={true}
              //   placeholder="Password"
              autoCapitalize={"none"}
            />
          </View>
          <View>
            <Button
              title="Sign in"
              disabled={loading}
              onPress={() => signInWithEmail()}
            />
          </View>
          <View>
            <Button
              title="Sign up"
              disabled={loading}
              onPress={() => signUpWithEmail()}
            />
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}
