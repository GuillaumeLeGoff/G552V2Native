import React from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  duration: 1200,
  overshootClamping: true,
  dampingRatio: 0.8,
};

const OFFSET = 60;

interface FloatingActionButtonProps {
  isExpanded: Animated.SharedValue<boolean>;
  index: number;
  label: string;
  onPress: () => void;
  buttonLetter: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  isExpanded,
  index,
  label,
  onPress,
  buttonLetter,
}) => {
  const animatedStyles = useAnimatedStyle(() => {
    const moveValue = isExpanded.value ? OFFSET * (index + 1) : 0;
    const translateY = withSpring(-moveValue, SPRING_CONFIG);
    const delay = index * 100;
    const scaleValue = isExpanded.value ? 1 : 0;

    return {
      transform: [
        { translateY },
        { scale: withDelay(delay, withTiming(scaleValue)) },
      ],
      opacity: isExpanded.value ? 1 : 0,
    };
  });

  return (
    <Animated.View
      className="bg-secondary rounded-full"
      style={[animatedStyles, styles.buttonContainer]}
    >
      <Pressable onPress={onPress} style={[styles.button, styles.shadow]}>
        <Text className="text-secondary-foreground">{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
  },
  button: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  label: {
    color: "#f8f9ff",
    fontWeight: "500",
  },
});

export default FloatingActionButton;
