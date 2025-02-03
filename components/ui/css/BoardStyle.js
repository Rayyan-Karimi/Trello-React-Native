import { Platform, StyleSheet } from "react-native";

export default styles = StyleSheet.create({
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