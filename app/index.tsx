import { auth } from '@/firebaseConfig';
import { Redirect } from 'expo-router';
import { getIdToken } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

const StartPage = () => {
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let tries = 0;
        const interval = setInterval(async () => {
            if (auth.currentUser) {
                try {
                    await getIdToken(auth.currentUser);
                    setIsAuthenticated(true);
                } catch (e) {
                    setIsAuthenticated(false);
                }
                setCheckingAuth(false);
                clearInterval(interval);
            } else if (tries > 20) { // ~2 seconds
                setCheckingAuth(false);
                clearInterval(interval);
            }
            tries++;
        }, 100);

        return () => clearInterval(interval);
    }, []);

    if (checkingAuth) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#b45309" />
            </View>
        );
    }

    return isAuthenticated ? <Redirect href="/(tabs)/Home" /> : <Redirect href="/signup" />;
};

export default StartPage;