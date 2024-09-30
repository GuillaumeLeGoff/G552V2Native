import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Play } from '~/lib/icons/Play';
import { User } from '../types/User';

interface ItemListProps {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean; // Ajout ici
}

export function ItemList({ title, onPress, onLongPress, isSelected }: ItemListProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={ 0.8} 
      onLongPress={onLongPress} // Assurez-vous que l'événement onLongPress est géré
      className={`flex-row items-center justify-between mb-2 mt-6 p-12 rounded-lg shadow-sm ${
        isSelected ? "bg-secondary" : "bg-card"
      }`} // Modification ici
    >
      <Text
        className={`text-lg font-avenir-black ${
          isSelected ? "text-secondary-foreground" : "text-primary"
        }`}
      >
        {title}
      </Text>
      <View className="bg-secondary rounded-full p-2">
        <Play
          size={20}
          strokeWidth={2.5}
          className="text-secondary-foreground"
        />
      </View>
    </TouchableOpacity>
  );
}