import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigationStacks from "./components/ui/stacks/NavigationStacks";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <NavigationStacks>
      </NavigationStacks>
    </GluestackUIProvider>
  );
}