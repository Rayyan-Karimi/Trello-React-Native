import {
    TextInput,
    Button,
    View,
    Pressable,
    Platform,
    Text,
    SafeAreaView,
    KeyboardAvoidingView, ScrollView
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { fetchChecklists } from '@/components/services/api.service';
import { useHeaderHeight } from '@react-navigation/elements'
import styles from '../css/CardStyle'

const CardScreen = ({ route }) => {
    const navigation = useNavigation();
    const { boardId, listId, cardId } = route.params;
    const height = useHeaderHeight()

    // State for checklists (each checklist: { id, name, checkItems })
    const [checklist, setChecklist] = useState([]);

    // State for new check item text (object keyed by checklist id)
    const [newItemText, setNewItemText] = useState({});

    // State for new checklist name input (for adding a new checklist)
    const [newChecklistName, setNewChecklistName] = useState("");

    // Fetch checklists from the API
    const fetchChecklistViaApi = async (theId) => {
        try {
            const response = await fetchChecklists(theId);
            setChecklist(response);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchChecklistViaApi(cardId);
    }, [cardId]);

    // ----- Check Items Functions -----

    // Add a new check item to a specific checklist
    const addCheckItem = (checklistId) => {
        const text = newItemText[checklistId];
        if (!text || !text.trim()) return; // ignore empty input

        const newCheckItem = {
            id: Date.now(), // simple id generator; consider a better solution for production
            name: text,
            state: 'incomplete'
        };

        setChecklist(prev =>
            prev.map(chklist =>
                chklist.id === checklistId
                    ? { ...chklist, checkItems: [...chklist.checkItems, newCheckItem] }
                    : chklist
            )
        );
        // Clear the input field for this checklist
        setNewItemText(prev => ({ ...prev, [checklistId]: "" }));
    };

    // Delete a check item from a checklist
    const handleDeleteCheckItem = (checklistId, checkItemId) => {
        setChecklist(prev =>
            prev.map(chklist =>
                chklist.id === checklistId
                    ? { ...chklist, checkItems: chklist.checkItems.filter(item => item.id !== checkItemId) }
                    : chklist
            )
        );
    };

    // Toggle the state of a check item
    const toggleCheckItemState = (checklistId, checkItemId) => {
        setChecklist(prev =>
            prev.map(chklist =>
                chklist.id === checklistId
                    ? {
                        ...chklist,
                        checkItems: chklist.checkItems.map(item =>
                            item.id === checkItemId
                                ? { ...item, state: item.state === 'incomplete' ? 'complete' : 'incomplete' }
                                : item
                        )
                    }
                    : chklist
            )
        );
    };

    // ----- Checklist Functions -----

    // Add a new checklist
    const addChecklist = () => {
        if (!newChecklistName.trim()) return;
        const newChk = {
            id: Date.now(),
            name: newChecklistName,
            checkItems: []
        };
        setChecklist(prev => [...prev, newChk]);
        setNewChecklistName("");
    };

    // Delete an entire checklist
    const deleteChecklist = (checklistId) => {
        setChecklist(prev => prev.filter(chklist => chklist.id !== checklistId));
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
            // behavior={"height"}
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
                    <Button title="Add Checklist" onPress={addChecklist} />
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                >
                    {checklist.map((item) => {
                        const completion = getCompletionPercentage(item.checkItems);
                        return (
                            <View style={styles.checklistContainer} key={item.id.toString()}>
                                {/* Checklist header with name and Delete button */}
                                <View style={styles.header}>
                                    <Text style={styles.checklistName}>Checklist: {item.name}</Text>
                                    <Button title="Delete" onPress={() => deleteChecklist(item.id)} />
                                </View>

                                {/* Display completion percentage */}
                                <Text style={styles.percentageText}>{completion}% completed</Text>

                                {/* Check Items */}
                                {item.checkItems.length > 0 ? (
                                    item.checkItems.map((checkItem, index) => (
                                        <Pressable
                                            key={index}
                                            onPress={() => toggleCheckItemState(item.id, checkItem.id)}
                                            onLongPress={() => handleDeleteCheckItem(item.id, checkItem.id)}
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
                                        value={newItemText[item.id] || ""}
                                        onChangeText={(text) =>
                                            setNewItemText(prev => ({ ...prev, [item.id]: text }))
                                        }
                                    />
                                    <Button title="Add" onPress={() => addCheckItem(item.id)} />
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
