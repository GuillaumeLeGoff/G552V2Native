import { PortalHost } from '@rn-primitives/portal';
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <>
      <Stack
        screenOptions={{
        headerShown: false,
      }}
      />
      <PortalHost />
    </>
  );
}
