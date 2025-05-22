import React from 'react';
import {Text, StyleSheet} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Home = () => {
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