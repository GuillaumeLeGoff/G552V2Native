import React, { useState, useRef } from "react";
import ScrollPicker from "react-native-wheel-scrollview-picker";

const NumberScrollPicker = () => {
  const ref = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Créez un tableau de chaînes de caractères de "0" à "999"
  const dataSource = Array.from({ length: 1000 }, (_, i) => i.toString());

  const onValueChange = (value: string | undefined, index: number) => {
    setSelectedIndex(index);
    console.log(`Selected value: ${value} at index: ${index}`);
  };

  return (
    <ScrollPicker
      ref={ref}
      dataSource={dataSource}
      selectedIndex={selectedIndex}
      onValueChange={onValueChange}
      wrapperHeight={180}
      wrapperBackground="#FFFFFF"
      itemHeight={60}
      highlightColor="#d8d8d8"
      highlightBorderWidth={2}
    />
  );
};

export default NumberScrollPicker;
