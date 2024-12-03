import * as React from "react";
import { TextInput, View } from "react-native";
import { cn } from "~/lib/utils";

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput> & {
    error?: boolean;
    children?: React.ReactNode;
  }
>(({ className, placeholderClassName, error, children, ...props }, ref) => {
  return (
    <View className="relative flex flex-row items-center">
      <TextInput
        ref={ref}
        className={cn(
          "web:flex h-10 native:h-12 web:w-full font-avenir-book text-lg  rounded-xl border border-input bg-background px-3 web:py-2 lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          props.editable === false && "opacity-50 web:cursor-not-allowed  ",
          error && "border-red-500",
          className,
          children && "pr-10" // Ajout d'un padding à droite pour l'icône
        )}
        placeholderClassName={cn(
          "text-secondary-foreground",
          placeholderClassName
        )}
        {...props}
      />
      {children && <View className="absolute right-3">{children}</View>}
    </View>
  );
});

Input.displayName = "Input";

export { Input };
