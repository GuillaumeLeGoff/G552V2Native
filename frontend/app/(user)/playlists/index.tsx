import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Header } from "~/components/ui/header";
import { ChevronDown } from "~/lib/icons/ChevronDown";

const Playlists = () => {
  return (
    <View>
      <Header title="Playlists" icon={<ChevronDown />} onIconPress={() => {}} />
      <Text>Playlists</Text>
    </View>
  );
};

export default Playlists;
