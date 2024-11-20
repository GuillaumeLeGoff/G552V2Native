import * as React from "react";
import { FlatList } from "react-native";
import { ItemMacro } from "~/components/ItemMacro";
import { Header } from "~/components/ui/header";
import { useMacros } from "~/hooks/useMacro";
import { Macro } from "~/types/Macro";
import  { useMemo } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import { usePlaylists } from "~/hooks/usePlaylists";

const Macros = () => {
  const { macros } = useMacros();
  const { playlists } = usePlaylists();
  
  const selectItems = useMemo(() => {
    return playlists.map((playlist) => (
      <SelectItem
        key={playlist.id}
        label={playlist.name}
        value={playlist.id.toString()}
      >
        {playlist.name}
      </SelectItem>
    ));
  }, [playlists]);

  const renderItem = ({ item, index }: { item: Macro, index: number }) => (
    <ItemMacro key={index} title={`macro ${index}`} macro={item} selectItems={selectItems} />
  );

  return (
    <FlatList
      ListHeaderComponent={<Header title="Macros" />}
      data={macros}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      className="px-8 pb-8"
    />
  );
};

export default Macros;
