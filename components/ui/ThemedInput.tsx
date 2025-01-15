import { Colors } from "@/constants/Colors";
import * as React from "react";
import { TextInput, useColorScheme } from "react-native";

import { StyleSheet } from "react-native";

const ThemedInput = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, ...props }, ref) => {
  const theme = useColorScheme() ?? "light";
  return (
    <TextInput
      ref={ref}
      style={[
        styles.input,
        { color: theme === "light" ? Colors.light.text : Colors.dark.text },
        {
          borderColor: theme === "light" ? Colors.light.text : Colors.dark.text,
        },
      ]}
      {...props}
    />
  );
});

ThemedInput.displayName = "Input";
export default ThemedInput;

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 3,
    flex: 1,
  },
});
