import { Platform, StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === "android" ? 0 : 25,
        paddingBottom: Platform.OS === "android" ? 75 : 0,
    },
    boardItem: {
        backgroundColor: "white",
        borderRadius: 16,
        borderWidth: 2,
        paddingHorizontal: Platform.OS === "android" ? 100 : 0,
        paddingVertical: 12,
        marginBottom: 10,
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
        bottom: 8,
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
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 30,
        marginRight: 8,
    },
    headerTitleText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    cardItem: {
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
        // any other styling you need
      },
      cardText: {
        fontSize: 16,
        color: '#333',
      },
      cardBadgeContainer: {
        marginTop: 4,
        backgroundColor: 'yellow',  // or your preferred yellow shade
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 2,
        alignSelf: 'flex-start',
      },
      cardBadgeText: {
        fontSize: 12,
        color: '#333',
      },
});