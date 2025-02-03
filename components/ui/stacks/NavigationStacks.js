import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// internal imports
import ListsScreen from "@/components/ui/screens/ListsScreen";
import CardScreen from "@/components/ui/screens/CardScreen";
import BoardScreen from '@/components/ui/screens/BoardsScreen';

const Stack = createNativeStackNavigator();

const NavigationStacks = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Boards" screenOptions={{
                headerStyle: {
                    backgroundColor: "#6a51ae"
                },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                headerTitleAlign: "center",
            }}>
                <Stack.Screen name="Boards" component={BoardScreen} options={{
                    headerRight: () => (
                        <View style={styles.flexRow}>
                            <Pressable onPress={() => alert('Search pressed!')}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>⌕</Text>
                            </Pressable>
                            <Pressable onPress={() => alert('Notifications pressed!')} style={{ marginLeft: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>🔔</Text>
                            </Pressable>
                        </View>
                    ),
                }} />
                <Stack.Screen name="Lists" component={ListsScreen} options={{
                    title: 'Lists',
                    headerRight: () => (
                        <View style={styles.flexRow}>
                            {/* filter */}
                            <Pressable onPress={() => alert('Filter pressed!')}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>🧹</Text>
                            </Pressable>
                            {/* notif */}
                            <Pressable onPress={() => alert('Notifications pressed!')} style={{ marginLeft: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>🔔</Text>
                            </Pressable>
                            {/* Menu 3 dots */}
                            <Pressable onPress={() => alert('Board Menu pressed!')} style={{ marginLeft: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>⋯</Text>
                            </Pressable>
                        </View>
                    ),
                }} />
                <Stack.Screen name="Card" component={CardScreen} options={{
                    headerRight: () => (
                        <View style={styles.flexRow}>
                            {/* Options icon 3 dots horizontal */}
                            <Pressable onPress={() => alert('Options pressed!')}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>⋯</Text>
                            </Pressable>
                        </View>
                    ),
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationStacks

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});