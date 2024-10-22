import React from "react";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Drawer } from "~/components/drawer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import { Lock } from "~/lib/icons/Lock";
import ForgotPassword from "./drawer/@forgotPassword";
import AlreadyConnected from "./drawer/@alreadyConnected";
import { Eye } from "~/lib/icons/Eye";
import { EyeOff } from "~/lib/icons/EyeOff";
import { Header } from "~/components/ui/header";
import { ChevronDown } from "~/lib/icons/ChevronDown";

export default function Login() {

  const {
    users,
    handleLogin,
    userSelected,
    setUserSelected,
    password,
    setPassword,
    authError, // Utilisation de authError
    shakeKey,
    setError,
    usernameError,
    setUsernameError,
    passwordError,
    setPasswordError,
    isAlreadyConnected,
    setIsAlreadyConnected,
    disconnectUser,
  } = useAuth();


  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClose = () => setIsOpen(false);

  
  const selectShakeAnimation = useSharedValue(0);
  const inputShakeAnimation = useSharedValue(0);

  const selectAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: selectShakeAnimation.value }],
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: inputShakeAnimation.value }],
  }));

  const triggerShake = React.useCallback(
    (animation: Animated.SharedValue<number>) => {
      animation.value = withSequence(
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 100 }),
        withTiming(10, { duration: 100 }),
        withTiming(0, { duration: 50 })
      );
    },
    []
  );

  React.useEffect(() => {
    if (shakeKey > 0) {
      if (!userSelected) {
        triggerShake(selectShakeAnimation);
      }
      if (!password) {
        triggerShake(inputShakeAnimation);
      }
    }
  }, [
    shakeKey,
    triggerShake,
    userSelected,
    password,
    selectShakeAnimation,
    inputShakeAnimation,
  ]);

  const onLogin = async () => {
    setIsLoading(true);
    setError(null);
    await handleLogin();
    setIsLoading(false);
  };

  const handleDisconnect = async () => {
    await disconnectUser();
    setIsAlreadyConnected(false);
    onLogin();
  };

  return (
    <View className="flex items-center justify-center h-full bg-background">
      <Card className="w-[320px]">
        <CardContent className="pb-0">
          <View className="flex flex-col gap-2 pt-8">
            <Text className="font-avenir-heavy text-xl text-primary">
              Username
            </Text>
            <Animated.View style={selectAnimatedStyle}>
              <Select
                defaultValue={{ value: "", label: "Select user" }}
                onValueChange={(selectedUser) => {
                  if (selectedUser?.value) {
                    setUserSelected(selectedUser?.value);
                    setUsernameError(false);
                  }
                }}
              >
                <SelectTrigger error={usernameError}>
                  <SelectValue
                    className="text-foreground opacity-50 text-lg bg-background"
                    placeholder="Select user"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {users?.map((user) => (
                      <SelectItem
                        key={user.id}
                        label={user.username}
                        value={user.username}
                      >
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Animated.View>
          </View>
          <View className="flex flex-col gap-2">
            <Text className="font-avenir-heavy text-xl text-primary">
              Password
            </Text>
            <Animated.View style={inputAnimatedStyle}>
              <Input
                className="text-foreground bg-background flex-1 text-lg"
                placeholder=""
                value={password || ""}
                secureTextEntry={!showPassword}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(false);
                }}
                error={passwordError}
              >
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-foreground opacity-50" />
                  ) : (
                    <Eye className="text-foreground opacity-50" />
                  )}
                </TouchableOpacity>
              </Input>
            </Animated.View>
            <Button variant="link" size="sm" onPress={() => setIsOpen(true)}>
              <Text className=" text-foreground text-sm">Lost password</Text>
            </Button>
          </View>

          <View className="h-6 justify-center pb-2">
            <Text className="text-red-500 text-sm text-center">
              {authError ? authError : ""}
            </Text>
          </View>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button variant="secondary" onPress={onLogin} disabled={isLoading}>
            <View className="flex flex-row items-center">
              {isLoading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Lock
                  size={16}
                  strokeWidth={3}
                  className="text-secondary-foreground"
                />
              )}
              <Text className="text-secondary-foreground ml-2">
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </View>
          </Button>
        </CardFooter>
      </Card>
      <Drawer isOpen={isOpen} onClose={handleClose}>
        <ForgotPassword />
      </Drawer>
      <AlreadyConnected
        isOpen={isAlreadyConnected}
        onClose={() => setIsAlreadyConnected(false)}
        onDisconnect={handleDisconnect}
      />
    </View>
  );
}
