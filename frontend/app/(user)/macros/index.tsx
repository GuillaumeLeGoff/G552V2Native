import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Header } from "~/components/ui/header";
import { ChevronDown } from "~/lib/icons/ChevronDown";

const Macros = () => {
  return (
    <View>
      <Header title="Macros" icon={<ChevronDown />} onIconPress={() => {}} />
      <Text>Macros</Text>
    </View>
  );
};

export default Macros;
