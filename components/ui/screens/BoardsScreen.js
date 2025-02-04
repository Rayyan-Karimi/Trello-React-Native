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
import { askApiToFetchAllBoards, askApiToAddBoard, askApiToDeleteBoard } from '@/components/services/boards.service';
import styles from '../css/BoardStyle';
import { useDispatch, useSelector } from 'react-redux';
import { createBoard, deleteBoard, readBoards } from '@/components/store/boardSlice';

const BoardScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const boards = useSelector((state) => state.boards.boardsArray);
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
                            const deletedBoardData = await askApiToDeleteBoard(boardId);
                            if (!deletedBoardData) {
                                console.error("Failed to delete board.");
                                return;
                            }
                            console.log("Deleted:", deletedBoardData);
                            dispatch(deleteBoard(boardId));
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
            const newBoardData = await askApiToAddBoard(newText);
            if (!newBoardData) {
                console.error("Failed to create board.");
                return;
            }
            const newBoard = {
                id: newBoardData.id,
                name: newText.trim(),
            };
            dispatch(createBoard(newBoard));
            setNewText('');
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBoardsViaApi = async () => {
        try {
            const newBoards = await askApiToFetchAllBoards();
            dispatch(readBoards(newBoards));
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
                    keyExtractor={(item) => {
                        return item.id.toString()
                    }}
                    renderItem={({ item }) => {
                        return (
                            <Pressable
                                style={[styles.boardItem, styles.text]}
                                onPress={() =>
                                    navigation.navigate("Lists", {
                                        boardId: item.id, boardName: item.name
                                    })
                                }
                                onLongPress={() => handleDelete(item.id)}
                            >
                                <Text style={styles.text}>{item.name}</Text>
                            </Pressable>
                        )
                    }}
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
