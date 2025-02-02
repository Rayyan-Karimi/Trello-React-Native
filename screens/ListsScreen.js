import {
    Button,
    View,
    FlatList,
    Pressable,
    Platform,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Alert // Import Alert for confirmation
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { fetchCards, fetchLists } from '@/components/services/api.service';

const ListsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { boardId } = route.params;

    const [lists, setLists] = useState([]);
    const [cards, setCards] = useState([]);

    // State for the new list name (for the floating Add List input)
    const [newListName, setNewListName] = useState('');
    // State for new card text keyed by list id (for the Add Card input in each list)
    const [newCardText, setNewCardText] = useState({});

    // State for editing a list's name
    const [editingListId, setEditingListId] = useState(null);
    const [editingListName, setEditingListName] = useState('');

    // State for the active menu (3-dots) for a list
    const [activeMenuListId, setActiveMenuListId] = useState(null);

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

    // Add a new list
    const addList = () => {
        if (!newListName.trim()) return;
        const newList = {
            id: Date.now(), // using Date.now() as a simple unique id
            name: newListName,
        };
        setLists(prevLists => [...prevLists, newList]);
        setNewListName('');
    };

    // Add a new card to a list
    const addCard = (listId) => {
        const text = newCardText[listId];
        if (!text || !text.trim()) return;
        const newCard = {
            id: Date.now(), // simple id generator
            idList: listId,
            name: text,
        };
        setCards(prevCards => [...prevCards, newCard]);
        setNewCardText(prev => ({ ...prev, [listId]: '' }));
    };

    // Update a list's name in state
    const updateListName = (listId, newName) => {
        setLists(prevLists =>
            prevLists.map(list =>
                list.id === listId ? { ...list, name: newName } : list
            )
        );
    };

    // Delete a list and its cards
    const deleteList = (listId) => {
        setLists(prevLists => prevLists.filter(list => list.id !== listId));
        setCards(prevCards => prevCards.filter(card => card.idList !== listId));
        setActiveMenuListId(null);
    };

    // Delete a card
    const deleteCard = (cardId) => {
        Alert.alert(
            "Delete Card",
            "Are you sure you want to delete this card?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        setCards(prevCards => prevCards.filter(card => card.id !== cardId));
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Main Content */}
            <View style={styles.mainContent}>
                {/* Horizontal List of Lists */}
                <FlatList
                    data={lists}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    renderItem={({ item }) => (
                        <View style={styles.boardItem}>
                            {/* List Header: Editable Name and 3-dots menu */}
                            <View style={styles.header}>
                                <TextInput
                                    style={[styles.listNameInput, editingListId === item.id && styles.editingInput]}
                                    value={editingListId === item.id ? editingListName : item.name}
                                    // When focused, enter editing mode
                                    onFocus={() => {
                                        setEditingListId(item.id);
                                        setEditingListName(item.name);
                                    }}
                                    onChangeText={setEditingListName}
                                    // On blur, update the list name and exit editing mode
                                    onBlur={() => {
                                        updateListName(item.id, editingListName);
                                        setEditingListId(null);
                                        setEditingListName('');
                                    }}
                                />
                                <Pressable
                                    style={styles.menuButton}
                                    onPress={() =>
                                        setActiveMenuListId(activeMenuListId === item.id ? null : item.id)
                                    }
                                >
                                    <Text style={styles.menuButtonText}>⋮</Text>
                                </Pressable>
                            </View>

                            {/* Conditionally render the menu if active for this list */}
                            {activeMenuListId === item.id && (
                                <View style={styles.menuContainer}>
                                    <Pressable onPress={() => deleteList(item.id)}>
                                        <Text style={styles.menuItemText}>Delete List</Text>
                                    </Pressable>
                                </View>
                            )}

                            {/* Cards */}
                            <FlatList
                                data={cards.filter(card => card.idList === item.id)}
                                keyExtractor={(card) => card.id.toString()}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item: card }) => (
                                    <Pressable
                                        style={styles.cardItem}
                                        onPress={() =>
                                            navigation.navigate("Card", {
                                                boardId: boardId,
                                                listId: item.id,
                                                cardId: card.id,
                                            })
                                        }
                                        onLongPress={() => deleteCard(card.id)} // Add onLongPress for delete
                                    >
                                        <Text style={styles.cardText}>{card.name}</Text>
                                    </Pressable>
                                )}
                                contentContainerStyle={{ flexGrow: 1 }}
                            />

                            {/* Add Card input and button */}
                            <View style={styles.addCardContainer}>
                                <TextInput
                                    style={styles.cardInput}
                                    placeholder="Add card..."
                                    value={newCardText[item.id] || ''}
                                    onChangeText={(text) =>
                                        setNewCardText(prev => ({ ...prev, [item.id]: text }))
                                    }
                                />
                                <Button title="Add Card" onPress={() => addCard(item.id)} />
                            </View>
                        </View>
                    )}
                />
            </View>

            {/* Add List Container */}
            <View style={styles.addListContainer}>
                <TextInput
                    style={styles.listInput}
                    placeholder="New list name..."
                    value={newListName}
                    onChangeText={setNewListName}
                />
                <Button title="Add List" onPress={addList} />
            </View>
        </SafeAreaView>
    );
};

export default ListsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    mainContent: {
        flex: 1, // Takes up all available space except for the Add List container
    },
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    listNameInput: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        padding: 4,
        borderWidth: 0,
    },
    editingInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    menuButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    menuButtonText: {
        fontSize: 24,
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        position: 'absolute',
        top: 40,
        right: 0,
        zIndex: 10,
        borderRadius: 4,
        padding: 8,
    },
    menuItemText: {
        fontSize: 16,
        color: 'red',
    },
    cardItem: {
        backgroundColor: "yellow",
        marginVertical: 10,
        padding: 8,
        borderRadius: 8,
    },
    cardText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 8,
    },
    addCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    cardInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
        flex: 1,
    },
    addListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 2 },
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    listInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
        flex: 1,
    },
});