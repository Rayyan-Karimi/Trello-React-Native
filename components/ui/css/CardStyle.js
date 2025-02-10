import { Platform, StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: "#F5F5F5",
        paddingTop: Platform.OS === "android" ? 25 : 0,
    },
    addChecklistContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    checklistContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        borderWidth: 2,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        // @TODO: Adjust width to full screen minus margins if needed
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    checklistName: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    percentageText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
    },
    checkItem: {
        borderRadius: 16,
        borderWidth: 2,
        padding: 16,
        marginVertical: 8,
    },
    checkItemText: {
        fontSize: 16,
    },
    emptyText: {
        fontSize: 18,
        color: "#888",
        textAlign: "center",
        marginVertical: 8,
    },
    addItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginRight: 8,
        flex: 1,
    },
});
