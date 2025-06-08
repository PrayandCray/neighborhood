import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { UseItems } from './context/ItemContext';

const StartPage = () => {
    const { isAuthenticated, isLoading } = UseItems();

    useEffect(() => {
        console.log('StartPage state:', { isAuthenticated, isLoading });
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#b45309" />
            </View>
        );
    }

    console.log('Redirecting to:', isAuthenticated ? '/(tabs)/Home' : '/signup');
    if (isAuthenticated) {
        return <Redirect href="/(tabs)/Home" />;
    }
        
    return <Redirect href="/signup"/>;
};

export default StartPage;