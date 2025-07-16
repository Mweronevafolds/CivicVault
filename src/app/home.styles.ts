import { StyleSheet, ViewStyle, TextStyle, ShadowStyleIOS } from 'react-native';

type StyleType = {
    [key: string]: ViewStyle | TextStyle | ShadowStyleIOS;
};

const styles = StyleSheet.create<StyleType>({
    // Common Styles
    card: {
        padding: 15 as number,
        borderRadius: 8 as number,
        backgroundColor: '#fff' as string,
        shadowColor: '#000' as string,
        shadowOffset: {
            width: 0 as number,
            height: 2 as number
        } as const,
        shadowOpacity: 0.25 as number,
        shadowRadius: 3.84 as number,
        elevation: 5 as number
    },
    cardTitle: {
        fontSize: 18 as number,
        fontWeight: '600' as const,
        color: '#1f2937' as string
    },
    cardSubtitle: {
        fontSize: 14 as number,
        color: '#6b7280' as string
    },
    formContainer: {
        padding: 15 as number,
        backgroundColor: '#fff' as string
    },
    formInput: {
        borderWidth: 1 as number,
        borderColor: '#e5e7eb' as string,
        borderRadius: 8 as number,
        padding: 12 as number,
        marginBottom: 15 as number,
        fontSize: 16 as number
    },
    formLabel: {
        fontSize: 14 as number,
        color: '#6b7280' as string,
        marginBottom: 4 as number
    },
    errorText: {
        color: '#ef4444' as string,
        fontSize: 12 as number,
        marginTop: 4 as number
    },
    actionButton: {
        padding: 12 as number,
        borderRadius: 8 as number,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        backgroundColor: '#2563eb' as string
    },
    actionButtonText: {
        color: '#fff' as string,
        fontSize: 16 as number,
        fontWeight: '500' as const
    },

    // Web Admin Dashboard Styles
    adminContainer: {
        flex: 1 as number,
        padding: 20 as number
    },
    statsContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        marginBottom: 20 as number
    },
    statCard: {
        flex: 1 as number,
        padding: 15 as number,
        borderRadius: 8 as number,
        backgroundColor: '#fff' as string,
        shadowColor: '#000' as string,
        shadowOffset: {
            width: 0 as number,
            height: 2 as number
        } as const,
        shadowOpacity: 0.1 as number,
        shadowRadius: 4 as number,
        elevation: 3 as number,
        marginRight: 10 as number
    },
    statTitle: {
        fontSize: 14 as number,
        color: '#6b7280' as string
    },
    statValue: {
        fontSize: 24 as number,
        fontWeight: '600' as const,
        color: '#1f2937' as string
    },
    mapAndChartsContainer: {
        flex: 1 as number,
        marginBottom: 20 as number
    },
    mapContainer: {
        height: 300 as number,
        width: '100%' as const,
        borderRadius: 8 as number,
        backgroundColor: '#fff' as string,
        shadowColor: '#000' as string,
        shadowOffset: {
            width: 0 as number,
            height: 2 as number
        } as const,
        shadowOpacity: 0.1 as number,
        shadowRadius: 4 as number,
        elevation: 3 as number
    },
    chartsContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const
    },
    chartBox: {
        flex: 1 as number,
        padding: 15 as number,
        borderRadius: 8 as number,
        backgroundColor: '#fff' as string,
        shadowColor: '#000' as string,
        shadowOffset: {
            width: 0 as number,
            height: 2 as number
        } as const,
        shadowOpacity: 0.1 as number,
        shadowRadius: 4 as number,
        elevation: 3 as number,
        marginRight: 10 as number
    },
    applicationsContainer: {
        marginTop: 20 as number
    },
    adminTitle: {
        fontSize: 20 as number,
        fontWeight: '600' as const,
        color: '#1f2937' as string,
        marginBottom: 15 as number
    },

    // Mobile Admin Dashboard Styles
    mobileContainer: {
        flex: 1 as number,
        backgroundColor: '#f3f4f6' as string
    },
    mobileStatsContainer: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        justifyContent: 'space-between' as const,
        marginBottom: 20 as number,
        paddingHorizontal: 15 as number
    },
    mobileStatCard: {
        flex: 1 as number,
        minWidth: 150 as number,
        maxWidth: 150 as number,
        marginRight: 10 as number,
        marginBottom: 10 as number,
        backgroundColor: '#fff' as string,
        padding: 15 as number,
        borderRadius: 8 as number,
        shadowColor: '#000' as string,
        shadowOffset: {
            width: 0 as number,
            height: 2 as number
        } as const,
        shadowOpacity: 0.25 as number,
        shadowRadius: 3.84 as number,
        elevation: 5 as number
    },
    mobileApplicationsContainer: {
        backgroundColor: '#fff' as string,
        padding: 15 as number,
        borderRadius: 8 as number,
        shadowColor: '#000' as string,
        shadowOffset: {
            width: 0 as number,
            height: 2 as number
        } as const,
        shadowOpacity: 0.05 as number,
        shadowRadius: 4 as number,
        elevation: 2 as number
    },

    // Access Denied Styles
    accessDeniedContainer: {
        flex: 1 as number,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: 20 as number,
        backgroundColor: '#f3f4f6' as string
    },
    accessDeniedTitle: {
        fontSize: 24 as number,
        fontWeight: 'bold' as const,
        color: '#1F2937' as string,
        marginTop: 20 as number
    },
    accessDeniedText: {
        fontSize: 16 as number,
        color: '#4B5563' as string,
        textAlign: 'center' as const,
        marginTop: 10 as number
    },
    accessDeniedButton: {
        backgroundColor: '#3b82f6' as string,
        padding: 12 as number,
        borderRadius: 8 as number,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginTop: 20 as number
    },
    accessDeniedButtonText: {
        color: '#fff' as string,
        fontSize: 16 as number,
        fontWeight: 'bold' as const
    },

    // Mobile Dashboard Styles
    headerContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        marginBottom: 24 as number
    },
    greeting: {
        fontSize: 20 as number,
        fontWeight: 'bold' as const
    },
    signOutButton: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        padding: 8 as number,
        borderRadius: 8 as number,
        borderWidth: 1 as number
    },
    signOutText: {
        marginLeft: 6 as number,
        fontWeight: '500' as const,
        fontSize: 14 as number
    },
    cardContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        marginBottom: 24 as number,
        flexWrap: 'wrap' as const,
        gap: 16 as number
    },
    iconContainer: {
        width: 60 as number,
        height: 60 as number,
        borderRadius: 30 as number,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginBottom: 12 as number
    },
    cardText: {
        marginTop: 8 as number,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
        fontSize: 15 as number
    },
    container: {
        flex: 1 as number
    },

    // Admin Styles
    adminItem: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        padding: 16 as number,
        backgroundColor: '#fff' as string,
        borderRadius: 12 as number,
        marginBottom: 16 as number,
        shadowColor: '#000' as string,
        shadowOffset: {
            width: 0 as number,
            height: 2 as number
        } as const,
        shadowOpacity: 0.25 as number,
        shadowRadius: 3.84 as number,
        elevation: 5 as number
    },
    adminItemDetails: {
        flex: 1 as number,
        marginLeft: 12 as number
    },
    adminItemName: {
        fontSize: 16 as number,
        fontWeight: '600' as const,
        marginBottom: 4 as number
    },
    adminItemType: {
        fontSize: 14 as number,
        color: '#6b7280' as string
    },
    adminItemDate: {
        fontSize: 14 as number,
        color: '#6b7280' as string,
        marginRight: 12 as number
    },
    emptyText: {
        textAlign: 'center' as const,
        color: '#6b7280' as string,
        fontSize: 16 as number
    }
});

export default styles;
