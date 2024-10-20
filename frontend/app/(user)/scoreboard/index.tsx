import * as React from "react";
import { Animated } from "react-native";
import { Header } from "~/components/ui/header";
import { Text } from "~/components/ui/text";
import { ChevronDown } from "~/lib/icons/ChevronDown";

const Scoreboard = () => {
  return (
    <Animated.ScrollView>
      <Header
        title="Scoreboard"
        icon={<ChevronDown />}
        onIconPress={() => {}}
      />
      <Text>Scoreboard</Text>
    </Animated.ScrollView>
  );
};

export default Scoreboard;
