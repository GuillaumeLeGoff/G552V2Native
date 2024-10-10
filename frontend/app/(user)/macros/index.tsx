import * as React from "react";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import AnimatedScrollView from "~/components/common/AnimatedScrollView";
import { ItemMacro } from "~/components/ItemMacro";
import { Header } from "~/components/ui/header";
import { Text } from "~/components/ui/text";
import { useMacros } from "~/hooks/useMacro";
import { ChevronDown } from "~/lib/icons/ChevronDown";

const Macros = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Déterminez la classe en fonction de la valeur de scrollY
  const animatedClassName = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['px-8 pt-12', 'px-8 pt-6'], // Remplacez par les classes CSS que vous souhaitez utiliser
    extrapolate: 'clamp',
  });
  const { macros } = useMacros();
  useEffect(() => {
    console.log(macros);
  }, [macros]);
  return (
     <Animated.View // Changement de View à Animated.View
       style={{
         transform: [{
           translateY: scrollY.interpolate({
             inputRange: [0, 100],
             outputRange: [0, -50],
             extrapolate: 'clamp',
           }),
         }],
       }}
       className="flex-1 pb-12"
     >
      <View >
        <Header className="px-8 pt-8 " title="Macros" />
      </View>
      <Animated.ScrollView
        className={`px-8 ${animatedClassName}`}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {macros.map((macro, index) => (
        <ItemMacro key={index} title={`macro ${index}`} macro={macro} />
      ))}
      </Animated.ScrollView>
    </Animated.View>
  );
};

export default Macros;
