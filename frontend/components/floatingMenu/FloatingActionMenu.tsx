import React, { forwardRef, useImperativeHandle } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import FloatingActionButton from "./FloatingActionButton";

interface SecondaryButton {
  icon: React.ReactNode;
  onPress: () => void;
}

interface FloatingActionMenuProps {
  secondaryButtons: SecondaryButton[];
}

const SPRING_CONFIG = {
  duration: 300,
  overshootClamping: true,
  damping: 10,
};

const FloatingActionMenu = forwardRef(({
  secondaryButtons,
}: FloatingActionMenuProps, ref) => {
  const isExpanded = useSharedValue(false);

  const toggleMenu = () => {
    if (secondaryButtons.length === 1) {
      secondaryButtons[0].onPress();
    } else {
      isExpanded.value = !isExpanded.value;
    }
  };

  useImperativeHandle(ref, () => ({
    closeMenu: () => {
      isExpanded.value = false;
    },
  }));

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
          onPress={button.onPress}
          icon={button.icon}
        />
      ))}

      <Pressable onPress={toggleMenu} style={[styles.mainButtonShadow]}>
        <Animated.View
          className=" bg-secondary"
          style={[styles.mainButton, mainButtonStyle]}
        >
          <Text
            className="text-secondary-foreground"
            style={styles.mainButtonText}
          >
            +
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
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
