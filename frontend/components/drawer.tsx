import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  BackHandler, // Importez BackHandler
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { cn } from "~/lib/utils";
import { TextRef, ViewRef } from "@rn-primitives/types";
import { createContext, useContext } from "react";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.6;

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
    }, [isOpen]);

    const handleClose = () => {
      translateY.value = withTiming(DRAWER_HEIGHT, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      }, () => {
        runOnJS(onClose)();
      });
    };

    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    return (
      <DrawerContext.Provider value={{ isOpen, onClose }}>
        <Modal
          visible={isOpen}
          transparent
          animationType="none"
          onRequestClose={handleClose} // Utilisez onRequestClose pour gérer le bouton de retour
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={handleClose} // Utilisez handleClose pour animer la fermeture
            > 
              <Animated.View className="flex-1 justify-end" style={[rStyle, style]} {...props} ref={ref}>
               
                {children}
              </Animated.View>
            </TouchableOpacity>
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

const DrawerContent = React.forwardRef<Animated.View, Omit<DrawerContentProps, "isOpen" | "onClose">>(
  ({ className, style, children, ...props }, ref) => {
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
    }, [isOpen]);

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
      <GestureDetector gesture={gesture}>
        <Animated.View
          ref={ref}
          className={cn(
            "absolute left-0 right-0 bottom-0 bg-white border-t-muted rounded-t-lg p-4",
            className
          )}
          style={[rStyle, style]}
          {...props}
        >
          <View className="w-10 h-1 bg-muted rounded-full self-center mb-4" />
          {children as React.ReactNode}
        </Animated.View>
      </GestureDetector>
    );
  }
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = React.forwardRef<
  ViewRef,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn("flex flex-row items-center p-6 pt-0", className)}
    {...props}
  />
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
      "text-2xl text-card-foreground font-semibold leading-none tracking-tight",
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
    className={cn("text-sm text-muted-foreground", className)}
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
    justifyContent: 'flex-end',
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
    height: DRAWER_HEIGHT,
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
