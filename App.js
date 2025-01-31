
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BoardScreen from "./screens/BoardsScreen";
import ListsScreen from "./screens/ListsScreen";
import CardScreen from "./screens/CardScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Boards" screenOptions={{
          headerStyle: {
            backgroundColor: "#6a51ae"
          },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: "center",
          // contentStyle: { backgroundColor: '#e8e4f3' }
        }}>
          <Stack.Screen name="Boards" component={BoardScreen} options={{
            // title: '',
            headerRight: () => (
              <View style={styles.flexRow}>
                <Pressable onPress={() => alert('Board right button pressed!')}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>Search</Text>
                </Pressable>
                <Pressable onPress={() => alert('Board right button pressed!')}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>Notifications</Text>
                </Pressable>
              </View>
            ),
          }} />
          <Stack.Screen name="Lists" component={ListsScreen} options={{
            title: 'Lists',
            headerRight: () => (
              <View style={styles.flexRow}>
                <Pressable onPress={() => alert('Lists right button pressed!')}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>Filter</Text>
                </Pressable>
                <Pressable onPress={() => alert('Lists right button pressed!')}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>Notifications</Text>
                </Pressable>
                <Pressable onPress={() => alert('Lists right button pressed!')}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>Board Menu</Text>
                </Pressable>
              </View>
            ),
          }} />
          <Stack.Screen name="Card" component={CardScreen} options={{
            headerRight: () => (
              <View style={styles.flexRow}>
                <Pressable onPress={() => alert('Card right button pressed!')}>
                  <Text style={{ color: '#fff', fontSize: 16 }}>Options</Text>
                </Pressable>
              </View>
            ),
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRow: {
    flexDirection: 'row'
  }
});
