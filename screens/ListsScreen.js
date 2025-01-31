import { Button, View, FlatList, Pressable, Platform, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { fetchCards, fetchLists } from '@/components/services/api.service';

const ListsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { boardId } = route.params;

    const [lists, setLists] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listResponse = await fetchLists(boardId);
                setLists(listResponse);
                const cardResponse = await fetchCards(boardId);
                setCards(cardResponse);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [boardId]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <FlatList
                    data={lists}
                    renderItem={({ item }) => (
                        <View style={styles.boardItem}>
                            <Text style={styles.text}>{item.name}</Text>
                            <View>
                                {cards.map((card, index) =>
                                    card.idList === item.id ? (
                                        <Pressable style={styles.cardItem} key={index} onPress={() => navigation.navigate("Card", {
                                            boardId: boardId,
                                            listId: item.id,
                                            cardId: card.id,
                                        })}>
                                            <Text style={styles.cardText}>{card.name}</Text>
                                        </Pressable>
                                    ) : null
                                )}
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </View>
        </SafeAreaView>
    );
};

export default ListsScreen;

const styles = StyleSheet.create({
    boardItem: {
        backgroundColor: "white",
        borderRadius: 16,
        borderWidth: 2,
        width: 250,
        padding: 16,
        margin: 16,
        alignSelf: 'flex-start',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 2, height: 2 },
                shadowColor: "#333",
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: "#F5F5F5",
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cardItem: {
        backgroundColor: "yellow",
        marginVertical: 10,
    },
    cardText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 8,
    },
});
