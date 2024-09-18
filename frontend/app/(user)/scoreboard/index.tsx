import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Header } from "~/components/ui/header";
import { ChevronDown } from "~/lib/icons/ChevronDown";

const Scoreboard = () => {
  return (
    <View>
      <Header
        title="Scoreboard"
        icon={<ChevronDown />}
        onIconPress={() => {}}
      />
      <Text>Scoreboard</Text>
    </View>
  );
};

export default Scoreboard;
