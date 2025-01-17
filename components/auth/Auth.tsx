import React, { useRef, useState } from "react";
import {
  Alert,
  View,
  AppState,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { useSession } from "@/context";
import { router } from "expo-router";
import { ThemedText } from "../ThemedText";
import { supabase } from "@/utils/initSupabase";
import { ThemedView } from "../ThemedView";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import LabeledInput from "../ui/LabeledInput";

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
    signInWithEmail();
  }

  const scrollViewRef = useRef<ScrollView | null>(null);
  const theme = useColorScheme() ?? "light";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[
        { flex: 1 },
        {
          backgroundColor:
            theme === "light"
              ? Colors.light.background
              : Colors.dark.background,
        },
      ]}
    >
      <SafeAreaView>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          style={[
            {
              backgroundColor:
                theme === "light"
                  ? Colors.light.background
                  : Colors.dark.background,
            },
          ]}
        >
          <Image
            source={require("@/assets/images/auth_image.jpeg")}
            style={{
              height: 350,
              width: 375,
              bottom: 0,
              left: 0,
            }}
          />
          <View style={styles.inputContainer}>
            <LabeledInput
              setValue={(text) => setEmail(text)}
              scrollViewRef={scrollViewRef}
              label="Email"
              placeholder="Email"
            />
            <LabeledInput
              setValue={(text) => setPassword(text)}
              scrollViewRef={scrollViewRef}
              label="Password"
              placeholder="Password"
              secureTextEntry={true}
            />
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
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
  },
  inputContainer: {
    padding: 32,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    position: "absolute",
    bottom: 31,
    left: 10,
    zIndex: 9999,
  },
  labelText: {
    paddingLeft: 5,
    paddingRight: 5,
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
    borderRadius: 3,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
  },
});
