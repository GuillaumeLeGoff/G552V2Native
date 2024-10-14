import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Header } from "~/components/ui/header";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import AnimatedScrollView from "~/components/common/AnimatedScrollView";

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
