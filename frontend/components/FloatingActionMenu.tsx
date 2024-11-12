import React from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import FloatingActionButton from "./FloatingActionButton";

interface SecondaryButton {
  label: string;
  onPress: () => void;
  color?: string;
}

interface FloatingActionMenuProps {
  secondaryButtons: SecondaryButton[];
}

const SPRING_CONFIG = {
  duration: 300,
  overshootClamping: true,
  damping: 10,
};

const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  secondaryButtons,
}) => {
  const isExpanded = useSharedValue(false);

  const toggleMenu = () => {
    isExpanded.value = !isExpanded.value;
  };

  const mainButtonStyle = useAnimatedStyle(() => {
    const rotate = isExpanded.value ? "45deg" : "0deg";
    return {
      transform: [{ rotate: withTiming(rotate, SPRING_CONFIG) }],
    };
  });

  return (
    <View style={styles.container}>
      {secondaryButtons.map((button, index) => (
        <FloatingActionButton
          key={index}
          isExpanded={isExpanded}
          index={index}
          label={button.label}
          onPress={button.onPress}
        />
      ))}

      <Pressable onPress={toggleMenu} style={[styles.mainButtonShadow]}>
        <Animated.View
          className=" bg-secondary"
          style={[styles.mainButton, mainButtonStyle]}
        >
          <Text className="text-secondary-foreground" style={styles.mainButtonText}>
            +
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    right: 30,
    alignItems: "center",
  },
  mainButton: {
    height: 56,
    width: 56,
    borderRadius: 28,
  
    justifyContent: "center",
    alignItems: "center",
  },
  mainButtonShadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  mainButtonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default FloatingActionMenu;
