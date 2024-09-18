import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Header } from "~/components/ui/header";
import { ChevronDown } from "~/lib/icons/ChevronDown";

const File = () => {
  return (
    <View>
      <Header title="Medias" icon={<ChevronDown />} onIconPress={() => {}} />
      <Text>File</Text>
    </View>
  );
};

export default File;
