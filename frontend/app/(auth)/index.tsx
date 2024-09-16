import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Drawer } from "~/components/drawer";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Lock } from "~/lib/icons/Lock";
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
import ForgotPassword from "./drawer/@forgotPassword";
import AlreadyConnected from "./drawer/@alreadyConnected";
import { cn } from "~/lib/utils";

export default function Login() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleClose = () => setIsOpen(false);

  const {
    users,
    handleLogin,
    setUserSelected,
    password,
    setPassword,
    error,
    setError,
    usernameError,
    setUsernameError,
    passwordError,
    setPasswordError,
    isShaking,
    isAlreadyConnected,
    setIsAlreadyConnected,
    disconnectUser
  } = useAuth();

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
            <Text className="font-avenir-heavy text-1xl">Username</Text>
            <View className={cn(usernameError && isShaking && "animate-shake")}>
              <Select
                defaultValue={{ value: "", label: "Select user" }}
                onValueChange={(selectedUser) => {
                  if (selectedUser && selectedUser.value) {
                    setUserSelected(selectedUser.value);
                    setUsernameError(false);
                  }
                }}
              >
                <SelectTrigger error={usernameError}>
                  <SelectValue
                    className="text-foreground text-lg bg-background"
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
            </View>
          </View>
          <View className="flex flex-col gap-2">
            <Text className="font-avenir-heavy text-1xl">Password</Text>
           {/*  <View className={cn(passwordError && isShaking && "animate-shake")}>
              <Input
                placeholder="Mot de passe"
                value={password || ""}
                secureTextEntry
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(false);
                }}
                error={passwordError}
              />
            </View> */}
            <Button
                variant="link"
                className="p-0 h-0"
                onPress={() => setIsOpen(true)}
              >
                <Text size="sm">Lost password</Text>
              </Button>
            <View className="h-6 justify-center pb-2"> 
              <Text className="text-red-500 text-sm text-center">
                {error ? error : ""}
              </Text>
            </View>
          </View>
        </CardContent>
        <CardFooter className="flex justify-center items-center">
          <Button
            variant="secondary"
            onPress={onLogin}
            disabled={isLoading}
          >
            <View className="flex flex-row items-center">
              {isLoading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Lock size={16} strokeWidth={3} className="text-foreground" />
              )}
              <Text className="text-foreground ml-2">
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
