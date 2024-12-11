import { Stack } from "expo-router";
export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="[playlistId]"
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "none",
        }}
      />
    </Stack>
  );
}
