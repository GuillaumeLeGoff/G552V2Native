import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { useAuthStore } from "~/store/authStore";
import { router } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"; // Ajout des imports nécessaires
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
} from "~/components/ui/select"; // Ajout des imports nécessaires
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useUsers } from "~/hooks/useState";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
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
              defaultValue={{ value: "", label: "Sélectionnez un utilisateur" }}
              onValueChange={(users) => setUsername(users?.value || "")}
            >
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm native:text-lg"
                  placeholder="Sélectionnez un utilisateur"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users?.map(
                    (
                      user // Remplacement des SelectItem par un map sur users
                    ) => (
                      <SelectItem
                        key={user.id}
                        label={user.username}
                        value={user.username}
                      >
                        {user.username}
                      </SelectItem>
                    )
                  )}
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
              /* onPress={() => router.push("/(auth)/reset-password")} */
            >
              <Text size="sm">Lost password</Text>
            </Button>
          </View>
          <Button variant="secondary" onPress={handleSignIn}>
            <Text>Login</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
