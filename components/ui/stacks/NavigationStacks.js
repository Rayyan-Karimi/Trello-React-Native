import React from 'react'
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// internal imports
import ListsScreen from "@/components/ui/screens/ListsScreen";
import CardScreen from "@/components/ui/screens/CardScreen";
import BoardScreen from '@/components/ui/screens/BoardsScreen';
import styles from '../css/BoardStyle'

const Stack = createNativeStackNavigator();

const CustomHeaderTitle = ({ title, tintColor, imageShown=true }) => (
    <View style={styles.headerTitleContainer}>
        {imageShown && <Image
            source={require('@/assets/trello-logo.png')}
            style={styles.logo}
            resizeMode="contain"
        />}
        <Text style={[styles.headerTitleText, { color: tintColor }]}>{title}</Text>
    </View>
);

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
                    // headerShown: false,
                    headerTitle: (props) => (
                        <CustomHeaderTitle/>
                    ),
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
                <Stack.Screen name="Lists" component={ListsScreen} options={({ route }) => ({
                    title: route.params.boardName || 'Lists',
                    headerTitle: (props) => (
                        <CustomHeaderTitle title={`${route.params.boardName}` || 'Lists'} {...props} />
                    ),
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
                })} />
                <Stack.Screen name="Card" component={CardScreen} options={({ route }) => ({
                    title: route.params.cardName || 'Card',
                    headerTitle: (props) => (
                        <CustomHeaderTitle title={`Card-${route.params.cardName}` || 'Card'} {...props} />
                    ),
                    headerRight: () => (
                        <View style={styles.flexRow}>
                            {/* Options icon 3 dots horizontal */}
                            <Pressable onPress={() => alert('Options pressed!')}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>⋯</Text>
                            </Pressable>
                        </View>
                    ),
                })} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationStacks
