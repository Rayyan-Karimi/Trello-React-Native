import { Pressable, View, FlatList, Text, Platform, StyleSheet, Button, SafeAreaView, ScrollView } from 'react-native'
import { useEffect } from 'react'
import React from 'react'
import { fetchBoards } from '@/components/services/boards.service'
import { useState } from 'react'

const BoardScreen = ({ navigation }) => {

    const [boards, setBoards] = useState([])

    const fetchBoardsViaApi = async () => {
        try {
            const newBoards = await fetchBoards();
            // console.log("Boards:", newBoards)
            setBoards(newBoards);
        } catch (err) {
            console.error("error:", err)
        }
    }

    useEffect(() => {
        fetchBoardsViaApi();
    }, []);

    return (
        <SafeAreaView style={styles.container}>

            <FlatList data={boards} renderItem={({ item }) =>
                <Pressable style={[styles.boardItem, styles.text]} onPress={() => navigation.navigate("Lists", {
                    boardId: item.id
                })}>
                    <Text style={styles.text}>{item.name}</Text>
                </Pressable>
            } keyExtractor={(item) => item.id.toString()}
            />

        </SafeAreaView>
    )

}

export default BoardScreen

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#F5F5F5",
        padding: 0,
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
})