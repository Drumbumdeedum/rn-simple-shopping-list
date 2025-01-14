import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Easing } from "react-native";
import { ThemedView } from "./ThemedView";

const LoadingScreen = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    return () => {
      spinAnimation.stop();
    };
  }, []);

  const rotationStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };
  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.spinner, rotationStyle]} />
    </ThemedView>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    borderWidth: 3,
    borderColor: "#3498db",
    borderLeftWidth: 0,
  },
});
