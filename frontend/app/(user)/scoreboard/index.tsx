import * as React from "react";
import { Animated } from "react-native";
import AnimatedScrollView from "~/components/AnimatedScrollView";
import { Header } from "~/components/ui/header";
import { Text } from "~/components/ui/text";
import { ChevronDown } from "~/lib/icons/ChevronDown";

const Scoreboard = () => {
  return (
    <AnimatedScrollView>
      <Header
        title="Scoreboard"
        icon={<ChevronDown />}
        onIconPress={() => {}}
      />
      <Text>Scoreboard</Text>
    </AnimatedScrollView>
  );
};

export default Scoreboard;
