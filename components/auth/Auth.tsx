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
  Animated,
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
  const [focusedInputIndex, setFocusedInputIndex] = useState<number | null>(
    null
  );

  const emailLabelOpacity = useRef(new Animated.Value(0)).current;
  const passwordLabelOpacity = useRef(new Animated.Value(0)).current;

  const handleFocus = (index: number): void => {
    const inputRef = inputRefs.current[index];
    setFocusedInputIndex(index);

    Animated.timing(index === 0 ? emailLabelOpacity : passwordLabelOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

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

  const handleBlur = (): void => {
    setFocusedInputIndex(null);

    Animated.timing(emailLabelOpacity, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();

    Animated.timing(passwordLabelOpacity, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };

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
            <View>
              <Animated.View
                style={[styles.label, { opacity: emailLabelOpacity }]}
              >
                <ThemedText
                  style={[
                    styles.labelText,
                    {
                      backgroundColor:
                        theme === "light"
                          ? Colors.light.background
                          : Colors.dark.background,
                    },
                  ]}
                >
                  Email
                </ThemedText>
              </Animated.View>
              <TextInput
                ref={(ref) => (inputRefs.current[0] = ref)}
                style={[
                  styles.input,
                  {
                    borderColor:
                      theme === "light" ? Colors.light.text : Colors.dark.text,
                  },
                  {
                    color:
                      theme === "light" ? Colors.light.text : Colors.dark.text,
                  },
                ]}
                placeholder={focusedInputIndex === 0 ? undefined : "Email"}
                onChangeText={(text: React.SetStateAction<string>) =>
                  setEmail(text)
                }
                value={email}
                autoCapitalize={"none"}
                onFocus={() => handleFocus(0)}
                onBlur={handleBlur}
              />
            </View>
            <View>
              <Animated.View
                style={[styles.label, { opacity: passwordLabelOpacity }]}
              >
                <ThemedText
                  style={[
                    styles.labelText,
                    {
                      backgroundColor:
                        theme === "light"
                          ? Colors.light.background
                          : Colors.dark.background,
                    },
                  ]}
                >
                  Password
                </ThemedText>
              </Animated.View>
              <TextInput
                ref={(ref) => (inputRefs.current[1] = ref)}
                placeholder={focusedInputIndex === 1 ? undefined : "Password"}
                style={[
                  styles.input,
                  {
                    borderColor:
                      theme === "light" ? Colors.light.text : Colors.dark.text,
                  },
                  {
                    color:
                      theme === "light" ? Colors.light.text : Colors.dark.text,
                  },
                ]}
                onChangeText={(text: React.SetStateAction<string>) =>
                  setPassword(text)
                }
                value={password}
                secureTextEntry={true}
                autoCapitalize={"none"}
                onFocus={() => handleFocus(1)}
                onBlur={handleBlur}
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
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "rgb(17, 24, 28)",
    borderStyle: "solid",
    borderRadius: 3,
  },
});
