import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Alert,
    Button,
    FlatList,
    Platform,
    TextInput,
    Pressable,
    SafeAreaView,
    KeyboardAvoidingView
} from 'react-native';
// internal imports
import { fetchBoards, addBoard, deleteBoard } from '@/components/services/boards.service';
import styles from '../css/BoardStyle';

const BoardScreen = ({ navigation }) => {
    const [boards, setBoards] = useState([]);
    const [newText, setNewText] = useState("");

    const handleDelete = (boardId) => {
        Alert.alert(
            "Delete Card",
            "Are you sure you want to delete this board?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const deletedBoardData = await deleteBoard(boardId);
                            if (!deletedBoardData) {
                                console.error("Failed to delete board.");
                                return;
                            }
                            console.log("Deleted:", deletedBoardData);
                            setBoards(prevBoards =>
                                prevBoards.filter(board => board.id !== boardId)
                            );
                        } catch (err) {
                            console.error(err);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleAdd = async () => {
        if (!newText || !newText.trim()) return;
        try {
            const newBoardData = await addBoard(newText);
            if (!newBoardData) {
                console.error("Failed to create board.");
                return;
            }
            console.log("New board added:", newBoardData.id);
            const newBoard = {
                id: newBoardData.id,
                name: newText.trim(),
            };
            setBoards(prev => [...prev, newBoard]);
            setNewText('');
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBoardsViaApi = async () => {
        try {
            const newBoards = await fetchBoards();
            setBoards(newBoards);
        } catch (err) {
            console.error("Error fetching boards:", err);
        }
    };

    useEffect(() => {
        fetchBoardsViaApi();
    }, []);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <SafeAreaView style={styles.container}>
                {/* Boards list */}
                <FlatList
                    data={boards}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles.boardItem, styles.text]}
                            onPress={() =>
                                navigation.navigate("Lists", {
                                    boardId: item.id,boardName: item.name
                                })
                            }
                            onLongPress={() => handleDelete(item.id)}
                        >
                            <Text style={styles.text}>{item.name}</Text>
                        </Pressable>
                    )}
                />

                {/* Floating add board container */}
                <View style={styles.addListContainer}>
                    <TextInput
                        style={styles.listInput}
                        placeholder="Add Board..."
                        value={newText}
                        onChangeText={setNewText}
                    />
                    <Button title="Add" onPress={handleAdd} />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default BoardScreen;
