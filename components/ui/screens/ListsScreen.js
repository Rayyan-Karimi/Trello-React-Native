import {
    Text,
    View,
    Alert,
    Button,
    FlatList,
    TextInput,
    Pressable,
    SafeAreaView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
// internal imports
import { fetchCards, fetchLists } from '@/components/services/api.service';
import styles from '../css/ListStyle'

const ListsScreen = ({ route }) => {
    const navigation = useNavigation();
    const { boardId } = route.params;

    const [lists, setLists] = useState([]);
    const [cards, setCards] = useState([]);

    // add list
    const [newListName, setNewListName] = useState('')
    //add card > multi store as key-value (listId-text)
    const [newCardText, setNewCardText] = useState({})

    // Editing a list's name on blur
    const [editingListId, setEditingListId] = useState(null);
    const [editingListName, setEditingListName] = useState('')

    // State for the active menu (3-dots) for a list
    const [activeForDeleteListId, setActiveForDeleteListId] = useState(null);

    useEffect(() => {
        fetchData();
    }, [boardId]);

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

    const addList = () => {
        if (!newListName.trim()) return;
        const newList = {
            id: Date.now(), // using Date.now() as a simple unique id
            name: newListName,
        };
        setLists(prevLists => [...prevLists, newList]);
        setNewListName('');
    };

    const addCard = (listId) => {
        const text = newCardText[listId];
        if (!text || !text.trim()) return;
        const newCard = {
            id: Date.now(),
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
                        setLists(prevLists => prevLists.filter(list => list.id !== listId));
                        setCards(prevCards => prevCards.filter(card => card.idList !== listId));
                        setActiveForDeleteListId(null);
                    },
                    style: "destructive"
                }
            ]
        );
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
                                    onChangeText={setEditingListName}
                                    onFocus={() => {
                                        setEditingListId(item.id);
                                        setEditingListName(item.name);
                                    }}
                                    onBlur={() => {
                                        updateListName(item.id, editingListName);
                                        setEditingListId(null);
                                        setEditingListName('');
                                    }}
                                />
                                <Pressable
                                    style={styles.menuButton}
                                    onPress={() =>
                                        setActiveForDeleteListId(activeForDeleteListId === item.id ? null : item.id)
                                    }
                                >
                                    <Text style={styles.menuButtonText}>⋮</Text>
                                </Pressable>
                            </View>

                            {/* Conditionally render the delete menu if active for this list */}
                            {activeForDeleteListId === item.id && (
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
                                        onLongPress={() => deleteCard(card.id)}
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