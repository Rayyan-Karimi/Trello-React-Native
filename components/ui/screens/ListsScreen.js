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
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// internal imports
import { askApiToFetchLists, askApiToAddNewList, askApiToUpdateAList, askApiToDeleteAnExistingList } from '@/components/services/lists.service';
import { askApiToFetchCards, askApiToAddNewCard, askApiToDeleteExistingCard, askApiToUpdateACard } from '@/components/services/cards.service';
import styles from '../css/ListStyle'
import { useDispatch, useSelector } from 'react-redux';
import { createList, readLists, updateList } from '@/components/store/listsSlice';
import { readCards, deleteCard, createCard } from '@/components/store/cardSlice';

const ListsScreen = ({ route }) => {
    const lists = useSelector((state) => state.lists.listsArray);
    const cards = useSelector((state) => state.cards.cardsArray);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { boardId } = route.params;

    // const [lists, setLists] = useState([]);
    // const [cards, setCards] = useState([]);

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

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [boardId])
    );

    const fetchData = async () => {
        try {
            const listResponse = await askApiToFetchLists(boardId);
            dispatch(readLists(listResponse));
            const cardResponse = await askApiToFetchCards(boardId);
            dispatch(readCards(cardResponse));
        } catch (err) {
            console.error(err);
        }
    };

    const addList = async () => {
        if (!newListName || !newListName.trim()) return;
        try {
            const newListData = await askApiToAddNewList(newListName, boardId);
            if (!newListData) {
                console.error("Failed to create list.");
                return;
            }
            console.log("New list added:", newListData.id);
            const newList = {
                id: newListData.id,
                name: newListName.trim(),
            };
            // setLists(prev => [...prev, newList]);
            dispatch(createList(newList));
            setNewListName('');
        } catch (err) {
            console.error(err);
        }
    };

    // Delete a list and its cards
    const handleDeleteList = (listId) => {
        Alert.alert(
            "Delete Card",
            "Are you sure you want to delete this list?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const deleteListData = await askApiToDeleteAnExistingList(listId);
                            if (!deleteListData) {
                                console.error("Failed to delete list.");
                                return;
                            }
                            console.log("List deleted:", listId);
                            // setLists(prevLists => prevLists.filter(list => list.id !== listId));
                            dispatch(deleteList(listId));
                            // setCards(prevCards => prevCards.filter(card => card.idList !== listId));
                            cards.filter(card => card.idList === listId)?.forEach(card => {
                                dispatch(deleteCard(card.id))
                            });
                            setActiveForDeleteListId(null);
                        } catch (err) {
                            console.error(err);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const addCard = async (listId) => {
        const text = newCardText[listId];
        if (!text || !text.trim()) return;
        try {
            const newCard = {
                idList: listId,
                name: text,
            };
            const newCardData = await askApiToAddNewCard(newCard, listId);
            if (!newCardData) {
                console.error("Failed to create card.");
                return;
            }
            console.log("New card added:", newCardData.id);
            // setCards(prevCards => [...prevCards, newCardData]);
            dispatch(createCard(newCardData));
            setNewCardText(prev => ({ ...prev, [listId]: '' }));
        } catch (err) {
            console.error(err);
        }

    };

    // Update a list's name in state
    const updateListName = async (listId, newName) => {
        try {
            const oldList = lists.filter((list) => list.id === listId)[0];
            if (!oldList) {
                console.error("Failed to find list for update.");
                return;
            }
            const newList = { ...oldList, name: newName };
            const response = await askApiToUpdateAList(listId, newList);
            if (!response) {
                console.error("Failed to update list.");
                return;
            }
            // setLists(prevLists =>
            //     prevLists.map(list =>
            //         list.id === listId ? { ...list, name: newName } : list
            //     )
            // );
            dispatch(updateList(newList))
        } catch (err) {
            console.error(err);
        }
    };


    // Delete a card
    const handleDeleteCard = (cardId) => {
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
                    onPress: async () => {
                        try {
                            const res = await askApiToDeleteExistingCard(cardId);
                            if (!res) { console.error("err in del card."); return; }
                            // setCards(prevCards => prevCards.filter(card => card.id !== cardId));
                            dispatch(deleteCard(cardId));
                        } catch (err) {
                            console.error(err)
                        }
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
                                    <Pressable onPress={() => handleDeleteList(item.id)}>
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
                                                cardName: card.name
                                            })
                                        }
                                        onLongPress={() => handleDeleteCard(card.id)}
                                    >
                                        {/* Card Name */}
                                        <Text style={styles.cardText}>{card.name}</Text>

                                        {/* Second line: check items progress */}
                                        {card.badges && typeof card.badges.checkItems === 'number' ? (
                                            <View style={styles.cardBadgeContainer}>
                                                <Text style={styles.cardBadgeText}>
                                                    {card.badges.checkItemsChecked}/{card.badges.checkItems} items completed
                                                </Text>
                                            </View>
                                        ) : null}
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