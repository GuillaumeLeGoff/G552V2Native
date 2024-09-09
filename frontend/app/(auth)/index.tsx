import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuthStore } from "~/store/authStore";
import { router } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectGroup } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useUsers } from "~/hooks/useState";
import { Drawer } from "~/components/drawer";
import ForgotPassword from "./drawer/@forgotPassword";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => setIsOpen(false);
  const { users } = useUsers();
  const handleSignIn = async () => {
    if (username && password) {
      await router.replace("/(user)/playlists");
    } else {
      console.log("Veuillez entrer un nom d'utilisateur et un mot de passe");
    }
  };

  return (
    <View className="flex items-center justify-center h-full bg-background">
      <Card className="w-[320px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="flex flex-col gap-2">
            <Text>Username</Text>
            <Select
              defaultValue={{ value: '', label: 'Select user' }}
              onValueChange={(users) => setUsername(users?.value || "")}
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
          <View>
            <Text>Password</Text>
            <View>
              <Input
                placeholder="Mot de passe"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
              />
            </View>
            <Button
              variant="link"
              className="p-0"
              onPress={() => setIsOpen(true)}
            >
              <Text size="sm">Lost password</Text>
            </Button>
          </View>
          <Button variant="secondary" onPress={handleSignIn}>
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