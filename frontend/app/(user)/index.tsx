import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuthStore } from "~/store/authStore";
import { router } from "expo-router";

export default function Home() {



  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

     
        <Text style={{ color: "white" }}>Se déconnecter</Text>
    </View>
  );
}

