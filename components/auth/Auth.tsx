import React, { useState } from "react";
import {
  Alert,
  View,
  AppState,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useSession } from "@/context";
import { router } from "expo-router";
import { ThemedText } from "../ThemedText";
import { supabase } from "@/utils/initSupabase";
import { ThemedView } from "../ThemedView";
import Input from "../ui/Input";
import { StyleSheet } from "react-native";
import ScrollView from "../ScrollView";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type AuthType = "sign-in" | "sign-up";

export default function Auth() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [viewType, setViewType] = useState<AuthType>("sign-in");
  const handleSwitchViewType = () => {
    if (viewType === "sign-in") setViewType("sign-up");
    if (viewType === "sign-up") setViewType("sign-in");
  };

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
    <ScrollView
      headerImage={
        <Image
          source={require("@/assets/images/auth_image.jpeg")}
          style={{
            height: 350,
            width: 375,
            bottom: 0,
            left: 0,
            position: "absolute",
          }}
        />
      }
    >
      <View>
        <View style={styles.container}>
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
            <TouchableOpacity
              disabled={loading}
              style={styles.button}
              onPress={() =>
                viewType === "sign-in" ? signInWithEmail() : signUpWithEmail()
              }
            >
              <ThemedText style={styles.buttonText}>
                {viewType === "sign-in" ? "Sign in" : "Sign up"}
              </ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedView style={styles.flexRow}>
            <ThemedText>
              {viewType === "sign-in"
                ? "Don't have an account yet?"
                : "Already have an account?"}
            </ThemedText>
            <ThemedText
              type="link"
              onPress={() => {
                handleSwitchViewType();
              }}
            >
              {viewType === "sign-in" ? "Sign up" : "Sign in"}
            </ThemedText>
          </ThemedView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    borderStyle: "solid",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  button: {
    padding: 12,
    backgroundColor: "cornflowerblue",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
  },
});
