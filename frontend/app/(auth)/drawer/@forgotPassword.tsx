import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, useDrawer } from "~/components/drawer";

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const { onClose } = useDrawer();

  const handleResetPassword = () => {
    // Ajoutez ici la logique pour envoyer l'email de réinitialisation

    onClose();
  };

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Réinitialisation du mot de passe</DrawerTitle>
        <DrawerDescription>Entrez votre email pour réinitialiser votre mot de passe</DrawerDescription>
      </DrawerHeader>
      
      <View className="p-4">
        <Input
          placeholder="Entrez votre email"
          value={email}
          onChangeText={setEmail}
        />
        <Button className="mt-4" onPress={handleResetPassword}>
          <Text>Envoyer l'email de réinitialisation</Text>
        </Button>
      </View>

      <DrawerFooter>
        <DrawerClose>
          
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}