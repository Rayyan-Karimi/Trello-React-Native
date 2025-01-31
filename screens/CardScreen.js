import { Button, View, FlatList, Pressable, Platform, Text, StyleSheet, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'
import { fetchChecklists } from '@/components/services/api.service';

const CardScreen = ({ route }) => {

    const navigation = useNavigation();
    const { boardId, listId, cardId } = route.params;

    //checklists
    const [checklist, setChecklist] = useState([])
    const fetchChecklistViaApi = async (theId) => {
        try {
            const response = await fetchChecklists(theId);
            console.log("CHECKLIST:", response)
            setChecklist(response);
        } catch (err) {
            console.error(err);
        }
    }

    // initial mount
    useEffect(() => {
        fetchChecklistViaApi(cardId)
    }, [])

    const toggleCheckItemState = (checklistId, checkItemId) => {
        setChecklist(prevChecklist =>
            prevChecklist.map(checklist =>
                checklist.id === checklistId
                    ? {
                        ...checklist,
                        checkItems: checklist.checkItems.map(item =>
                            item.id === checkItemId
                                ? { ...item, state: item.state === 'incomplete' ? 'complete' : 'incomplete' }
                                : item
                        )
                    }
                    : checklist
            )
        );
    };



    return (
        <SafeAreaView style={styles.container}>
            <View>
                <FlatList
                    data={checklist}
                    renderItem={({ item }) => (
                        <View style={styles.boardItem}>
                            {item.checkItems.length > 0 ? (
                                item.checkItems.map((checkItem, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => toggleCheckItemState(item.id, checkItem.id)}
                                        style={[styles.checkItem, { backgroundColor: checkItem.state === 'incomplete' ? 'red' : 'green' }]}
                                    >
                                        <Text style={styles.checkItemText}>{checkItem.name}</Text>
                                    </Pressable>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No checklist items available</Text>
                            )}
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No checklists found</Text>
                    }
                />

            </View>
        </SafeAreaView>
    )
}

export default CardScreen

const styles = StyleSheet.create({
    checkItem: {
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
    container: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: "#F5F5F5",
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cardItem: {
        backgroundColor: "yellow",
        marginVertical: 10,
    },
    checklistText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 18,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    }

});