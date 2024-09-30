import { router } from "expo-router";
import { Modal, Text, TouchableOpacity } from "react-native";

export default function Playlist() {
  return (
    <Modal className="flex-1 justify-center items-center">
      <Text>test</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Text>Fermer</Text>
      </TouchableOpacity>
    </Modal>
  );
}
