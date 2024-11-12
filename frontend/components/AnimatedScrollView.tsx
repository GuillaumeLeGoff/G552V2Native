import React from "react";
import { Animated, ScrollViewProps } from "react-native";

const AnimatedScrollView: React.FC<ScrollViewProps> = (props) => {
  return (
    <Animated.ScrollView
      className={`px-8  py-8 `}
      scrollEventThrottle={16}
      {...props}
    />
  );
};

export default AnimatedScrollView;
