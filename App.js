import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux'
import store from "./components/store/store";
import NavigationStacks from "./components/ui/stacks/NavigationStacks";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <GluestackUIProvider mode="light">
        <NavigationStacks>
        </NavigationStacks>
      </GluestackUIProvider>
    </Provider>
  );
}