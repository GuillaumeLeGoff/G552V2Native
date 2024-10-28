import { Pressable, Text, View } from "react-native";
import { useItemStore } from "~/store/item";
import { Item } from "~/types/Item";


export default function DragItem({ item }: { item: Item }) {

  return (
    <Pressable> 
    <View className="bg-secondary p-4 rounded-lg ">
      <Text className="text-lg font-bold">{item.title}</Text>
    </View>
    </Pressable>
  );
}
