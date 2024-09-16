import * as React from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react-native"; // Assuming the icon is imported similarly to others
import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { cn } from "~/lib/utils";
import { Check } from "~/lib/icons/Check";

const ListItem = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline" // Using the outline variant for a dashed border
      className={cn(
        "bg- border-dashed border-red-500 rounded-lg flex items-center justify-center",
        className
      )}
      {...props}
    >
      <View className="flex flex-row items-center">
        <Check size={16} strokeWidth={3} className="text-foreground" />
        <Text className="text-foreground ml-2">Create</Text>
      </View>
    </Button>
  );
});
ListItem.displayName = "CreateButton";

export { ListItem };
