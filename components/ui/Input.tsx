import * as React from "react";
import { TextInput } from "react-native";

import { StyleSheet } from "react-native";

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, ...props }, ref) => {
  return <TextInput ref={ref} style={styles.input} {...props} />;
});

Input.displayName = "Input";
export default Input;

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "rgb(17, 24, 28)",
    borderStyle: "solid",
  },
});
