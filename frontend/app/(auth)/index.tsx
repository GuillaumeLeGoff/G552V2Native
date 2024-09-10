import React from "react";
import { View } from "react-native";
import { Drawer } from "~/components/drawer";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
import ForgotPassword from "./drawer/@forgotPassword";

export default function Login() {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => setIsOpen(false);

  const { users, login, setUserSelected, password, setPassword, error } =
    useAuth();

  return (
    <View className="flex items-center justify-center h-full bg-background">
      <Card className="w-[320px]">
        <CardContent>
          <View className="flex flex-col gap-2 pt-6">
            <Text className="font-avenir-heavy text-1xl">Username</Text>
            <Select
              defaultValue={{ value: "", label: "Select user" }}
              onValueChange={(selectedUser) => {
                if (selectedUser && selectedUser.value) {
                  setUserSelected(selectedUser.value);
                }
              }}
            >
              <SelectTrigger>
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
          <View className="flex flex-col gap-2">
            <Text className="font-avenir-heavy text-1xl">Password</Text>
            <View>
              <Input
                placeholder="Mot de passe"
                value={password || ""}
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>
            <View className="m-0 p-0">
              <Text className="text-red-500 text-sm text-center">
                {error ? error : null}
              </Text>
              <Button
                variant="link"
                className="p-0"
                onPress={() => setIsOpen(true)}
              >
                <Text size="sm">Lost password</Text>
              </Button>
            </View>
          </View>

          <Button variant="secondary" onPress={() => login()}>
            <Text>Login</Text>
          </Button>
        </CardContent>
      </Card>

      <Drawer isOpen={isOpen} onClose={handleClose}>
        <ForgotPassword />
      </Drawer>
    </View>
  );
}
