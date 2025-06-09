import { auth } from '@/firebaseConfig';
import { Redirect } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { UseItems } from './context/ItemContext';

const StartPage = () => {
    const { isAuthenticated, isLoading } = UseItems();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Checking auth:', user ? `User ${user.email} found` : 'No user found');
            setCheckingAuth(false);
        });

        return () => unsubscribe();
    }, []);

    if (checkingAuth || isLoading) {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#b45309" />
            </View>
        );
    }

    return isAuthenticated ? <Redirect href="/(tabs)/Home" /> : <Redirect href="/signup" />;
};

export default StartPage;