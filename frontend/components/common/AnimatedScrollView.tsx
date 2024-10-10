import React, { useRef } from "react";
import { Animated, ScrollViewProps, View, Text } from "react-native";
import ActionHeader from "../ActionHeader";
import { Header } from "../ui/header";

interface AnimatedScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  title: string;
}

const AnimatedScrollView: React.FC<AnimatedScrollViewProps> = ({ children, title, ...props }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Déterminez la classe en fonction de la valeur de scrollY
  const animatedClassName = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['px-8 pt-12', 'px-8 pt-6'], // Remplacez par les classes CSS que vous souhaitez utiliser
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1">
      <Animated.View
        style={{
          transform: [{
            translateY: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [0, -200],
              extrapolate: 'clamp',
            }),
          }],
        }}
      >
        <Header className="px-8 pt-8 bg-secondary" title={title} />
      </Animated.View>
      <Animated.ScrollView
        className={`px-8 py-8 ${animatedClassName}`} // Utilisation de la classe animée
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        {...props}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

export default AnimatedScrollView;