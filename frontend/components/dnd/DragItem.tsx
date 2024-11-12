import { API_PORT, IP_ADDRESS, PROTOCOL } from "@env";
import { Image, Pressable, Text, View } from "react-native";
import { useAuthStore } from "~/store/authStore";
import { PlaylistMedia } from "~/types/PlaylistMedia";
import { GripVertical } from "~/lib/icons/GripVertical";
export default function DragItem({ media }: { media: PlaylistMedia }) {
  const { user } = useAuthStore();
  return (
    <Pressable>
      <View className="bg-secondary px-10 py-4 rounded-lg items-center flex-row justify-between">
        <GripVertical size={24} className="text-secondary-foreground" />
        <Image
          className="rounded-lg "
          source={{
            uri: `${PROTOCOL}://${IP_ADDRESS}:${API_PORT}/uploads/${user}/${media.media?.file_name}`,
          }}
          style={{ width: "50%", height: (250 * 9) / 20 }} // Ajuste la hauteur pour un ratio 16:9
        />
        <Text className="text-secondary-foreground text-xl font-avenir-heavy">
          {media.media?.duration || "0"}
        </Text>
      </View>
    </Pressable>
  );
}
