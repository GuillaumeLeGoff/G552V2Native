import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Header } from "~/components/ui/header";
import { ChevronDown } from "~/lib/icons/ChevronDown";

const Settings = () => {
  return (
    <View>
      <Header title="Settings" icon={<ChevronDown />} onIconPress={() => {}} />
      <Text>Settings</Text>
    </View>
  );
};

export default Settings;
