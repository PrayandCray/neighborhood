import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { UseItems } from './context/ItemContext';

const StartPage = () => {
    const { pantryItems, groceryItems, isLoading } = UseItems();

    useEffect(() => {
        if (!isLoading) {
            [...pantryItems, ...groceryItems].forEach(item => {
                console.log('Loaded item:', item);
            });
        }
    }, [isLoading]);

    return <Redirect href="/(tabs)/Home" />
};

export default StartPage;