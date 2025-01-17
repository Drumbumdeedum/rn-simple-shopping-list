import { Colors } from "@/constants/Colors";
import * as React from "react";
import {
  Animated,
  ScrollView,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import ThemedInput from "./ThemedInput";
import { useRef, useState } from "react";

const LabeledInput = ({
  setValue,
  scrollViewRef,
  label,
  placeholder,
  secureTextEntry = false,
  value,
}: {
  setValue: (value: React.SetStateAction<string>) => void;
  scrollViewRef: React.RefObject<ScrollView>;
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string;
}) => {
  const theme = useColorScheme() ?? "light";
  const inputRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState<boolean>(false);
  const labelOpacity = useRef(new Animated.Value(0)).current;

  const handleFocus = (): void => {
    setFocused(true);
    Animated.timing(labelOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (inputRef.current && scrollViewRef.current) {
      inputRef.current.measure(
        (
          _x: number,
          _y: number,
          _width: number,
          height: number,
          _pageX: number,
          pageY: number
        ) => {
          scrollViewRef.current?.scrollTo({
            y: pageY - height - 100,
            animated: true,
          });
        }
      );
    }
  };
  const handleBlur = (): void => {
    setFocused(false);
    Animated.timing(labelOpacity, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };
  return (
    <View>
      <Animated.View style={[styles.label, { opacity: labelOpacity }]}>
        <ThemedText
          style={[
            styles.labelText,
            {
              backgroundColor: Colors[theme ?? "light"].background,
            },
          ]}
        >
          {label}
        </ThemedText>
      </Animated.View>
      <ThemedInput
        ref={inputRef}
        placeholder={focused ? undefined : placeholder}
        onChangeText={(text: React.SetStateAction<string>) => setValue(text)}
        value={value}
        autoCapitalize={"none"}
        onFocus={() => handleFocus()}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};
LabeledInput.displayName = "Input";
export default LabeledInput;

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 3,
  },
  label: {
    position: "absolute",
    bottom: 31,
    left: 10,
    zIndex: 666,
  },
  labelText: {
    paddingLeft: 5,
    paddingRight: 5,
  },
});
