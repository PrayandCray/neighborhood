import React from 'react';
import AppButton from "@/components/button";
import {SafeAreaView, Text, StyleSheet} from 'react-native';

const List = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                List
            </Text>
            <Text style={styles.subtitle}>
                This is where your lists are stored
            </Text>

            <AppButton
                text="Add List"
                onPress={() =>console.log('pressed')}
                isFullWidth={true} // this is for auto-padding, otherwise specify width with width{number}
                borderPadding={20}
                borderColor={'#fff'}
                textColor={'#EADDCA'}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#EADDCA',
        padding: 16,
        gap: 16,
        width: '100%',
    },
    title: {
        paddingTop: 30,
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

export default List;