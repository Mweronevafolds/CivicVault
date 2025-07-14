import { StyleSheet } from 'react-native';

export const HomeScreenStyles = StyleSheet.create({
    // Common Styles
    safeArea: { flex: 1, backgroundColor: '#fff' },

    // Mobile Styles
    mobileContainer: { flex: 1, padding: 20 },
    greeting: { fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 20 },
    cardContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    card: { 
        width: '45%', 
        aspectRatio: 1, 
        backgroundColor: '#f0f4f8', 
        borderRadius: 15, 
        padding: 15, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderWidth: 1, 
        borderColor: '#e5e7eb' 
    },
    cardText: { 
        marginTop: 10, 
        color: '#2563eb', 
        fontWeight: '600', 
        textAlign: 'center', 
        fontSize: 16 
    },

    // Admin (Web) Styles
    adminContainer: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    adminTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: '#111827' },
    adminItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 10, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: '#e5e7eb' 
    },
    adminItemDetails: { flex: 1, marginLeft: 15 },
    adminItemName: { fontSize: 16, fontWeight: 'bold' },
    adminItemType: { color: 'gray' },
    adminItemDate: { color: 'gray', marginRight: 10 },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' },

    // Access Denied Styles
    accessDeniedContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: '#fef2f2' 
    },
    accessDeniedTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#b91c1c', 
        marginTop: 15 
    },
    accessDeniedText: { 
        fontSize: 16, 
        color: '#991b1b', 
        textAlign: 'center', 
        marginTop: 10 
    }
});
