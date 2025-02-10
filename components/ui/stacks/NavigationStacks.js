import React from 'react'
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert"
import { InfoIcon } from "@/components/ui/icon"
// internal imports
import ListsScreen from "@/components/ui/screens/ListsScreen";
import CardScreen from "@/components/ui/screens/CardScreen";
import BoardScreen from '@/components/ui/screens/BoardsScreen';
import styles from '../css/BoardStyle'
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const CustomHeaderTitle = ({ title, tintColor, imageShown = true }) => {
    const navigation = useNavigation();
    return <Pressable onPress={() => navigation.navigate("Boards")} style={styles.headerTitleContainer}>
        {imageShown && <Image
            source={require('@/assets/trello-logo.png')}
            style={styles.logo}
            resizeMode="contain"
        />}
        <Text style={[styles.headerTitleText, { color: tintColor }]}>{title}</Text>
    </Pressable>
};

function MyGluestackAlert({ title }) {
    console.log("Initialized")
    return (
        <Alert action="muted" variant="solid">
            <AlertIcon as={InfoIcon} />
            <AlertText>Alert! {title}</AlertText>
        </Alert>
    )
}

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
                        <CustomHeaderTitle />
                    ),
                    headerRight: () => (
                        <View style={styles.flexRow}>
                            <Pressable onPress={() => MyGluestackAlert('Search pressed!')}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>⌕</Text>
                            </Pressable>
                            <Pressable onPress={() => MyGluestackAlert('Notifications pressed!')} style={{ marginLeft: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>🔔</Text>
                            </Pressable>
                        </View>
                    ),
                }} />
                <Stack.Screen name="Lists" component={ListsScreen} options={({ route }) => ({
                    title: route.params.boardName || 'Lists',
                    headerTitle: `Lists-${route.params.boardName}`,
                    headerRight: () => (
                        <View style={styles.flexRow}>
                            {/* filter */}
                            <Pressable onPress={() => MyGluestackAlert('Filter pressed!')}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>🧹</Text>
                            </Pressable>
                            {/* notif */}
                            <Pressable onPress={() => MyGluestackAlert('Notifications pressed!')} style={{ marginLeft: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>🔔</Text>
                            </Pressable>
                            {/* Menu 3 dots */}
                            <Pressable onPress={() => MyGluestackAlert('Board Menu pressed!')} style={{ marginLeft: 16 }}>
                                <Text style={{ color: '#fff', fontSize: 20 }}>⋯</Text>
                            </Pressable>
                        </View>
                    ),
                })} />
                <Stack.Screen name="Card" component={CardScreen} options={({ route }) => ({
                    title: route.params.cardName || 'Card',
                    headerTitle: `Card-${route.params.cardName}`,
                    headerRight: () => (
                        <View style={styles.flexRow}>
                            {/* Options icon 3 dots horizontal */}
                            <Pressable onPress={() => MyGluestackAlert('Options pressed!')}>
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
