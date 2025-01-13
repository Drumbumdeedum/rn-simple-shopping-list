import * as React from "react";
import { TextInput } from "react-native";

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ className, ...props }, ref) => {
  return <TextInput ref={ref} {...props} />;
});

Input.displayName = "Input";

export { Input };
