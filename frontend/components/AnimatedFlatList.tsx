import React from "react";
import {FlatList, FlatListProps } from "react-native";

const AnimatedFlatList = <T,>(props: FlatListProps<T>) => {
  return (
    <FlatList
      className="px-8 pb-8"
      {...props}
      scrollEnabled={false}
    />
  );
};

export default AnimatedFlatList; 