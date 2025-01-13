import { Slot } from "expo-router";
import { SessionProvider } from "@/context/index";

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
