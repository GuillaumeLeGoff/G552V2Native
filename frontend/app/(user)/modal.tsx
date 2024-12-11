import { router } from "expo-router";
import React from "react";
import { Button, View } from "react-native";
import { Text } from "~/components/ui/text";

function modal() {
  return (
    <View>
      <Text>Hello</Text>
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}

export default modal;
