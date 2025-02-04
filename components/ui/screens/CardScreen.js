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

// internal
import styles from '../css/CardStyle';
import {
    askApiToFetchChecklists,
    askApiToAddChecklist,
    askApiToDeleteChecklist,
    askApiToAddCheckItem,
    askApiToDeleteCheckItem,
    askApiToUpdateCheckItem
} from '@/components/services/checklist.service';
import { useDispatch, useSelector } from 'react-redux';
import { readChecklists, createChecklist, updateChecklist, deleteChecklist } from '@/components/store/checklistSlice';

// card screen component
const CardScreen = ({ route }) => {

    const { cardId } = route.params;
    const dispatch = useDispatch();

    // each checklist: { id, name, checkItems }
    const checklists = useSelector((state) => state.checklists.cardsArray);
    const [newCheckItemText, setNewCheckItemText] = useState({}); // mapping w/checklistId
    const [newChecklistName, setNewChecklistName] = useState("");

    useEffect(() => {
        fetchChecklistViaApi(cardId);
    }, [cardId]);

    const fetchChecklistViaApi = async (theCardId) => {
        try {
            const response = await askApiToFetchChecklists(theCardId);
            dispatch(readChecklists(response));
        } catch (err) {
            console.error("Error fetching checklists:", err);
        }
    };

    const handleAddCheckItem = async (checklistId) => {
        const text = newCheckItemText[checklistId];

        if (!text || !text.trim()) return;
        try {
            const newCheckItem = await askApiToAddCheckItem(checklistId, text);
            if (newCheckItem) {
                const currentChecklist = checklists.find(chklist => chklist.id === checklistId);
                if (currentChecklist) {
                    const updatedChecklist = {
                        ...currentChecklist,
                        checkItems: [...currentChecklist.checkItems, newCheckItem]
                    };
                    dispatch(updateChecklist(updatedChecklist));
                }
                setNewCheckItemText(prev => ({ ...prev, [checklistId]: "" }));
            }
        } catch (err) {
            console.error("Error adding check item:", err);
        }
    };

    const handleCheckItemDelete = async (checklistId, checkItemId) => {
        try {
            const response = await askApiToDeleteCheckItem(cardId, checkItemId);
            if (response) {
                const currentChecklist = checklists.find(chklist => chklist.id === checklistId);
                if (currentChecklist) {
                    const updatedChecklist = {
                        ...currentChecklist,
                        checkItems: currentChecklist.checkItems.filter(item => item.id !== checkItemId)
                    };
                    dispatch(updateChecklist(updatedChecklist));
                }
            }
        } catch (err) {
            console.error("Error deleting check item:", err);
        }
    };

    const handleCheckItemToggle = async (checklistId, checkItemId, currentState) => {
        try {
            const newState = currentState === 'incomplete' ? 'complete' : 'incomplete';
            const updatedItem = await askApiToUpdateCheckItem(cardId, checkItemId, newState);
            if (updatedItem) {
                const currentChecklist = checklists.find(chklist => chklist.id === checklistId);
                if (currentChecklist) {
                    const updatedChecklist = {
                        ...currentChecklist,
                        checkItems: currentChecklist.checkItems.map(item =>
                            item.id === checkItemId ? { ...item, state: newState } : item
                        )
                    };
                    dispatch(updateChecklist(updatedChecklist));
                }
            }
        } catch (err) {
            console.error("Error toggling check item state:", err);
        }
    };

    // ----- Checklist -----

    const handleAddChecklist = async () => {
        if (!newChecklistName.trim()) return;
        try {
            const newChk = await askApiToAddChecklist(cardId, newChecklistName);
            if (newChk) {
                dispatch(createChecklist(newChk));
                setNewChecklistName("");
            }
        } catch (err) {
            console.error("Error adding checklist:", err);
        }
    };

    const handleChecklistDeletion = async (checklistId) => {
        try {
            console.log('hey')
            const response = await askApiToDeleteChecklist(checklistId);
            if (response) {
                dispatch(deleteChecklist(checklistId));
            }
        } catch (err) {
            console.error("Error deleting checklist:", err);
        }
    };

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
                    {checklists?.map((chklist) => {
                        const completion = getCompletionPercentage(chklist.checkItems);
                        return (
                            <View style={styles.checklistContainer} key={chklist.id.toString()}>
                                {/* Checklist header with name and Delete button */}
                                <View style={styles.header}>
                                    <Text style={styles.checklistName}>Checklist: {chklist.name}</Text>
                                    <Button title="Delete" onPress={() => handleChecklistDeletion(chklist.id)} />
                                </View>

                                {/* Display completion percentage */}
                                <Text style={styles.percentageText}>{completion}% completed</Text>

                                {/* Check Items */}
                                {chklist.checkItems && chklist.checkItems.length > 0 ? (
                                    chklist.checkItems.map((checkItem) => (
                                        <Pressable
                                            key={checkItem.id}
                                            onPress={() => handleCheckItemToggle(chklist.id, checkItem.id, checkItem.state)}
                                            onLongPress={() => handleCheckItemDelete(chklist.id, checkItem.id)}
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
                                        value={newCheckItemText[chklist.id] || ""}
                                        onChangeText={(text) =>
                                            setNewCheckItemText(prev => ({ ...prev, [chklist.id]: text }))
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
