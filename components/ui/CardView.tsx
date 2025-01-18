import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewProps,
} from "react-native";
import React from "react";

export type CardViewProps = ViewProps &
  TouchableOpacityProps & {
    children: React.ReactNode;
  };

const CardView = ({ children, style, onPress, ...props }: CardViewProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, style]} {...props}>
      {children}
    </TouchableOpacity>
  );
};

export default CardView;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 12,
    padding: 18,
    boxShadow: "0px 5px 05px rgba(0, 0, 0, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
});
