import React, { useState, useEffect } from 'react';
import {
    Pressable,
    View,
    FlatList,
    Text,
    Platform,
    StyleSheet,
    Button,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchBoards } from '@/components/services/boards.service';

const BoardScreen = ({ navigation }) => {
    // State for boards and new board name input
    const [boards, setBoards] = useState([]);
    const [newText, setNewText] = useState("");

    // Delete a board on long press
    const handleDelete = (boardId) => {
        setBoards(prev => prev.filter(board => board.id !== boardId));
    };

    // Add a new board
    const handleAdd = () => {
        if (!newText.trim()) return;
        const newBoard = {
            id: Date.now(), // using Date.now() as a simple unique id
            name: newText.trim(),
        };
        setBoards(prev => [...prev, newBoard]);
        setNewText('');
    };

    // Fetch boards from API on mount
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
                                    boardId: item.id,
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    boardItem: {
        backgroundColor: "white",
        borderRadius: 16,
        borderWidth: 2,
        paddingHorizontal: 32,
        paddingVertical: 16,
        margin: 16,
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
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    addListContainer: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
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
        width: 150,
    },
});
