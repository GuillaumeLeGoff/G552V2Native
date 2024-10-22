import * as React from "react";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { ItemMacro } from "~/components/ItemMacro";
import { Header } from "~/components/ui/header";
import { useMacros } from "~/hooks/useMacro";
import AnimatedScrollView from "~/components/AnimatedScrollView"; // Ajout de l'import

const Macros = () => {
  const { macros, getMacros } = useMacros();

  useEffect(() => {
    getMacros();
  }, []);
  return (
    <AnimatedScrollView>
      <Header title="Macros" />
        {macros.map((macro, index) => (
          <ItemMacro key={index} title={`macro ${index}`} macro={macro} />
        ))}
     
    </AnimatedScrollView>
  );
};

export default Macros;
