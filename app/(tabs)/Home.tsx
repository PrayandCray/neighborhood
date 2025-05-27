import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from "@/components/button";
import { useRouter, useLocalSearchParams } from 'expo-router';

const Home = () => {
    const router = useRouter();

    const handleAddNewPantryItem = () => {
        router.push({
            pathname: "/(tabs)/List",
            params: { initialList: 'first' }
        });
        setTimeout(() => {
            router.push({
                pathname: '/new',
                params: { listType: 'pantry' }
            });
        }, 150);
    };

    const handleAddNewGroceryItem = () => {
        router.push({
            pathname: "/(tabs)/List",
            params: { initialList: 'second' }
        });
        setTimeout(() => {
            router.push({
                pathname: '/new',
                params: { listType: 'grocery' }
            });
        }, 150);
    };

    return (
        <LinearGradient
            colors={['#E2E2E2', '#B39171', '#843F00']}
            style={styles.container}
        >
            <Text style={styles.title}>
                Welcome to Shelfie
            </Text>
            <Text style={styles.subtitle}>
                An app that helps you keep track of your shelves, pantries and everything else!
            </Text>
            <View style={styles.shortcutsContainer}>
                <AppButton
                    text="Add New Item to Pantry"
                    onPress={handleAddNewPantryItem}
                    isFullWidth={false}
                    width={150}
                    borderPadding={20}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />

                <AppButton
                    text="Add New Item to Grocery"
                    onPress={handleAddNewGroceryItem}
                    isFullWidth={false}
                    width={150}
                    borderPadding={20}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    shortcutsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        gap: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#b45309',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#d97706',
        textAlign: 'center',
    },
});

export default Home;