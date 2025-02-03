import { Platform, StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    mainContent: {
        flex: 1, // Takes up all available space except for the Add List container
    },
    boardItem: {
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    listNameInput: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        padding: 4,
        borderWidth: 0,
    },
    editingInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    menuButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    menuButtonText: {
        fontSize: 24,
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        position: 'absolute',
        top: 40,
        right: 0,
        zIndex: 10,
        borderRadius: 4,
        padding: 8,
    },
    menuItemText: {
        fontSize: 16,
        color: 'red',
    },
    cardItem: {
        backgroundColor: "yellow",
        marginVertical: 10,
        padding: 8,
        borderRadius: 8,
    },
    cardText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 8,
    },
    addCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    cardInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
        flex: 1,
    },
    addListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 16,
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
        flex: 1,
    },
});