import React, { useRef, useState } from "react";
import {
  Alert,
  View,
  AppState,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSession } from "@/context";
import { router } from "expo-router";
import { ThemedText } from "../ThemedText";
import { supabase } from "@/utils/initSupabase";
import { ThemedView } from "../ThemedView";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const scrollViewRef = useRef<ScrollView | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleFocus = (index: number): void => {
    const inputRef = inputRefs.current[index];
    if (inputRef && scrollViewRef.current) {
      inputRef.measure(
        (
          _x: number,
          _y: number,
          _width: number,
          height: number,
          _pageX: number,
          pageY: number
        ) => {
          scrollViewRef.current?.scrollTo({
            y: pageY - height - 20,
            animated: true,
          });
        }
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.container}
          ref={scrollViewRef}
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
            <View>
              <ThemedText>Email</ThemedText>
              <TextInput
                ref={(ref) => (inputRefs.current[0] = ref)}
                style={styles.input}
                placeholder="Email"
                onChangeText={(text: React.SetStateAction<string>) =>
                  setEmail(text)
                }
                value={email}
                autoCapitalize={"none"}
                onFocus={() => handleFocus(0)}
              />
            </View>
            <View>
              <ThemedText>Password</ThemedText>
              <TextInput
                ref={(ref) => (inputRefs.current[1] = ref)}
                placeholder="Password"
                style={styles.input}
                onChangeText={(text: React.SetStateAction<string>) =>
                  setPassword(text)
                }
                value={password}
                secureTextEntry={true}
                autoCapitalize={"none"}
                onFocus={() => handleFocus(1)}
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
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    borderStyle: "solid",
  },
  inputContainer: {
    padding: 32,
    display: "flex",
    flexDirection: "column",
    gap: 16,
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
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "rgb(17, 24, 28)",
    borderStyle: "solid",
  },
});
