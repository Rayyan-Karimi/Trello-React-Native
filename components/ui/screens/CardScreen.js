import {
    TextInput,
    Button,
    View,
    Pressable,
    Platform,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import styles from '../css/CardStyle';

// Import our checklist API functions
import {
    fetchChecklists,
    addChecklist,
    deleteChecklist,
    addCheckItem,
    deleteCheckItem,
    updateCheckItemState
} from '@/components/services/checklist.service';

const CardScreen = ({ route }) => {
    const navigation = useNavigation();
    const { boardId, listId, cardId } = route.params;
    const headerHeight = useHeaderHeight();

    // State for checklists (each checklist: { id, name, checkItems })
    const [checklists, setChecklists] = useState([]);

    // State for new check item text (object keyed by checklist id)
    const [newItemText, setNewItemText] = useState({});

    // State for new checklist name input (for adding a new checklist)
    const [newChecklistName, setNewChecklistName] = useState("");

    // Fetch checklists for this card from the API
    const fetchChecklistViaApi = async (theCardId) => {
        try {
            const response = await fetchChecklists(theCardId);
            setChecklists(response);
        } catch (err) {
            console.error("Error fetching checklists:", err);
        }
    };

    useEffect(() => {
        fetchChecklistViaApi(cardId);
    }, [cardId]);

    // ----- Checklist Item Functions -----

    // Add a new check item to a specific checklist via API integration
    const handleAddCheckItem = async (checklistId) => {
        const text = newItemText[checklistId];
        if (!text || !text.trim()) return;
        try {
            const newCheckItem = await addCheckItem(checklistId, text);
            if (newCheckItem) {
                setChecklists(prev =>
                    prev.map(chklist =>
                        chklist.id === checklistId
                            ? { ...chklist, checkItems: [...chklist.checkItems, newCheckItem] }
                            : chklist
                    )
                );
                // Clear the input for this checklist
                setNewItemText(prev => ({ ...prev, [checklistId]: "" }));
            }
        } catch (err) {
            console.error("Error adding check item:", err);
        }
    };

    // Delete a check item from a checklist via API integration
    const handleDeleteCheckItem = async (checklistId, checkItemId) => {
        try {
            // Call API to delete the check item. (Note: Trello’s endpoint requires cardId and checkItemId.)
            const response = await deleteCheckItem(cardId, checkItemId);
            if (response) {
                setChecklists(prev =>
                    prev.map(chklist =>
                        chklist.id === checklistId
                            ? { ...chklist, checkItems: chklist.checkItems.filter(item => item.id !== checkItemId) }
                            : chklist
                    )
                );
            }
        } catch (err) {
            console.error("Error deleting check item:", err);
        }
    };

    // Toggle the state of a check item via API integration
    const handleToggleCheckItemState = async (checklistId, checkItemId, currentState) => {
        try {
            const newState = currentState === 'incomplete' ? 'complete' : 'incomplete';
            const updatedItem = await updateCheckItemState(cardId, checkItemId, newState);
            if (updatedItem) {
                setChecklists(prev =>
                    prev.map(chklist =>
                        chklist.id === checklistId
                            ? {
                                ...chklist,
                                checkItems: chklist.checkItems.map(item =>
                                    item.id === checkItemId ? { ...item, state: newState } : item
                                )
                            }
                            : chklist
                    )
                );
            }
        } catch (err) {
            console.error("Error toggling check item state:", err);
        }
    };

    // ----- Checklist Functions -----

    // Add a new checklist via API integration
    const handleAddChecklist = async () => {
        if (!newChecklistName.trim()) return;
        try {
            const newChk = await addChecklist(cardId, newChecklistName);
            if (newChk) {
                setChecklists(prev => [...prev, newChk]);
                setNewChecklistName("");
            }
        } catch (err) {
            console.error("Error adding checklist:", err);
        }
    };

    // Delete an entire checklist via API integration
    const handleDeleteChecklist = async (checklistId) => {
        try {
            const response = await deleteChecklist(checklistId);
            if (response) {
                setChecklists(prev => prev.filter(chklist => chklist.id !== checklistId));
            }
        } catch (err) {
            console.error("Error deleting checklist:", err);
        }
    };

    // Function to compute completion percentage for a checklist
    const getCompletionPercentage = (checkItems) => {
        if (!checkItems || checkItems.length === 0) return 0;
        const doneCount = checkItems.filter(item => item.state === 'complete').length;
        return Math.round((doneCount / checkItems.length) * 100);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <SafeAreaView style={styles.container}>
                {/* Input for adding a new checklist */}
                <View style={styles.addChecklistContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="New Checklist Name..."
                        value={newChecklistName}
                        onChangeText={setNewChecklistName}
                    />
                    <Button title="Add Checklist" onPress={handleAddChecklist} />
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
                    {checklists.map((chklist) => {
                        const completion = getCompletionPercentage(chklist.checkItems);
                        return (
                            <View style={styles.checklistContainer} key={chklist.id.toString()}>
                                {/* Checklist header with name and Delete button */}
                                <View style={styles.header}>
                                    <Text style={styles.checklistName}>Checklist: {chklist.name}</Text>
                                    <Button title="Delete" onPress={() => handleDeleteChecklist(chklist.id)} />
                                </View>

                                {/* Display completion percentage */}
                                <Text style={styles.percentageText}>{completion}% completed</Text>

                                {/* Check Items */}
                                {chklist.checkItems && chklist.checkItems.length > 0 ? (
                                    chklist.checkItems.map((checkItem) => (
                                        <Pressable
                                            key={checkItem.id}
                                            onPress={() => handleToggleCheckItemState(chklist.id, checkItem.id, checkItem.state)}
                                            onLongPress={() => handleDeleteCheckItem(chklist.id, checkItem.id)}
                                            style={[
                                                styles.checkItem,
                                                { backgroundColor: checkItem.state === 'incomplete' ? 'red' : 'green' }
                                            ]}
                                        >
                                            <Text style={styles.checkItemText}>{checkItem.name}</Text>
                                        </Pressable>
                                    ))
                                ) : (
                                    <Text style={styles.emptyText}>No checklist items available</Text>
                                )}

                                {/* Input and Button for adding a new check item */}
                                <View style={styles.addItemContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Add item..."
                                        value={newItemText[chklist.id] || ""}
                                        onChangeText={(text) =>
                                            setNewItemText(prev => ({ ...prev, [chklist.id]: text }))
                                        }
                                    />
                                    <Button title="Add" onPress={() => handleAddCheckItem(chklist.id)} />
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default CardScreen;
