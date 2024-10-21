import * as React from "react";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { ItemMacro } from "~/components/ItemMacro";
import { Header } from "~/components/ui/header";
import { useMacros } from "~/hooks/useMacro";

const Macros = () => {
  const { macros, getMacros } = useMacros();

  useEffect(() => {
    getMacros();
    }, []);
  return (
    <Animated.ScrollView // Changement de View à Animated.View
      className="flex-1 pb-12"
    >
      <View>
        <Header className="px-8 pt-8 " title="Macros" />
      </View>
      <Animated.ScrollView className={`px-8`} scrollEventThrottle={16}>
        {macros.map((macro, index) => (
          <ItemMacro key={index} title={`macro ${index}`} macro={macro} />
        ))}
      </Animated.ScrollView>
    </Animated.ScrollView>
  );
};

export default Macros;
