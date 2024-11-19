import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  BackHandler,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { cn } from "~/lib/utils";
import { TextRef, ViewRef } from "@rn-primitives/types";
import { createContext, useContext } from "react";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.8;

interface DrawerProps extends React.ComponentPropsWithoutRef<typeof View> {
  isOpen: boolean;
  onClose: () => void;
}

interface DrawerContextType {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};

const Drawer = React.forwardRef<View, DrawerProps>(
  ({ isOpen, onClose, children, style, ...props }, ref) => {
    const translateY = useSharedValue(DRAWER_HEIGHT);

    React.useEffect(() => {
      if (isOpen) {
        translateY.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        translateY.value = withTiming(DRAWER_HEIGHT, {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        });
      }
    }, [isOpen, translateY]);

    const handleClose = React.useCallback(() => {
      translateY.value = withTiming(
        DRAWER_HEIGHT,
        {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        },
        () => {
          runOnJS(onClose)();
        }
      );
    }, [onClose, translateY]);

    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    // Gestion du BackHandler pour fermer le Drawer avec le bouton de retour Android
    React.useEffect(() => {
      const onBackPress = () => {
        if (isOpen) {
          handleClose();
          return true; // Empêche le comportement par défaut
        }
        return false; // Laisse le comportement par défaut
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [isOpen, handleClose]);

    return (
      <DrawerContext.Provider value={{ isOpen, onClose }}>
        <Modal
          visible={isOpen}
          transparent
          animationType="none"
          onRequestClose={handleClose} // Gère le bouton de retour
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.drawerContainer}>
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={handleClose}
              />

              <Animated.View style={[rStyle, style]} {...props} ref={ref}>
                {children}
              </Animated.View>
            </View>
          </GestureHandlerRootView>
        </Modal>
      </DrawerContext.Provider>
    );
  }
);
Drawer.displayName = "Drawer";

const DrawerTrigger = TouchableOpacity;

const DrawerClose = TouchableOpacity;

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof Animated.View> {
  onClose: () => void;
  isOpen: boolean;
}

const DrawerContent = React.forwardRef<
  Animated.View,
  Omit<DrawerContentProps, "isOpen" | "onClose">
>(({ className, style, children, ...props }, ref) => {
  const { isOpen, onClose } = useDrawer();

  const translateY = useSharedValue(DRAWER_HEIGHT);

  React.useEffect(() => {
    if (isOpen) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      translateY.value = withTiming(DRAWER_HEIGHT, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [isOpen, translateY]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      const newTranslateY = Math.max(
        0,
        Math.min(event.translationY, DRAWER_HEIGHT)
      );
      translateY.value = newTranslateY;
    })
    .onEnd(() => {
      if (translateY.value > DRAWER_HEIGHT / 2) {
        translateY.value = withTiming(
          DRAWER_HEIGHT,
          {
            duration: 300,
            easing: Easing.in(Easing.cubic),
          },
          () => {
            runOnJS(onClose)();
          }
        );
      } else {
        translateY.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      ref={ref}
      className={cn(
        " bg-background border-t-muted rounded-t-lg p-4",
        className
      )}
      style={[rStyle, styles.content, style]}
      {...props}
    >
      <GestureDetector gesture={gesture}>
        <View>
          <View style={styles.handle} />
          {Array.isArray(children) ? children[0] : children}
        </View>
      </GestureDetector>
      {Array.isArray(children) && children[1]}
    </Animated.View>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex flex-col space-y-1.5 px-6 py-4", className)}
    {...props}
  />
));
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn(" p-6 pt-0", className)} {...props} />
));
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  TextRef,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text
    role="heading"
    aria-level={3}
    ref={ref}
    className={cn(
      "font-avenir-heavy text-2xl text-primary font-semibold ",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  TextRef,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn("font-avenir-book text-lg text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawerContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    // Styles additionnels pour le Drawer, si nécessaire
    // Vous pouvez ajuster ces styles selon vos besoins
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 2.5,
  },
  header: {
    marginBottom: 20,
  },
  footer: {
    marginTop: "auto",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
});

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
