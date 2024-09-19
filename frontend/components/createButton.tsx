import { Text, TouchableOpacity } from 'react-native';
import { Plus } from '~/lib/icons/Plus';
interface CreateButtonProps {
  onPress: () => void;
}

export const CreateButton = ({ onPress }: CreateButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} className="bg-secondary p-4 rounded-lg border-2 border-secondary-foreground border-dashed flex-row items-center justify-center gap-1">
      <Plus size={26} className="text-secondary-foreground" />
      <Text className="text-secondary-foreground  font-avenir-heavy text-xl pt-1">
       Create
      </Text>
    </TouchableOpacity>
  );
};