import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Play } from '~/lib/icons/Play';

interface ItemListProps {
  title: string;

}

export function ItemList({ title }: ItemListProps) {
  return (
    <TouchableOpacity className='flex-row items-center bg-card justify-between  mb-2 mt-6 p-12 rounded-lg shadow-sm' >
        <Text className="text-lg font-avenir-black text-primary">{title}</Text>
        <View className='bg-secondary rounded-full p-2'>
        <Play size={20} strokeWidth={2.5} className="text-secondary-foreground" />
        </View>
    </TouchableOpacity>
  );
}