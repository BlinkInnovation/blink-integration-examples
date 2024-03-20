import React, { useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, ScrollView, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import { useAccessTokenStore } from "./userStore";
import { useFocusEffect } from '@react-navigation/native';
import { ENV_FrontendUrl } from "./environment";

export default function WidgetView({ route }) {
    const { accessToken } = useAccessTokenStore();
    const [isLoading, setIsLoading] = useState(true);
    const { view } = route.params;

    const webViewUrl = `${ENV_FrontendUrl}/widgets/${view}?token=${accessToken}&basic=true`;

    const renderLoadingView = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );

    const renderErrorView = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load content.</Text>
        </View>
    );

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true); 
        }, [])
    );

    return (
        <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <WebView
                    source={{ uri: webViewUrl }}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    renderLoading={renderLoadingView}
                    renderError={renderErrorView}
                    onError={() => setIsLoading(false)}
                    onLoad={() => setIsLoading(false)}
                />
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1
    },
    container: {
        flex: 1,
        backgroundColor: "#f3f9ff",
        justifyContent: "center",
        alignItems: "center",
        height: 280
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    webview: {
        flex: 1,
        width: "100%",
        height: "100%",
        borderColor: "green",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
    },
});
