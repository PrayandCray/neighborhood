import React from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import AppButton from "@/components/button";
import { useRouter} from 'expo-router';

const NewItemScreen = () => {
    const router = useRouter();

    return(
        <SafeAreaView style={styles.container}>

            <Text style={styles.text}>New Item Screen</Text>

            <AppButton
                text="Done"
                onPress={() => router.back()} //change so it can create new value for the list
                isFullWidth={false}
                width={150}
                borderPadding={20}
                borderColor={'#fff'}
                textColor={'#EADDCA'}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EADDCA',
        width: '100%',
    },
    text: {
        paddingTop: 16,
        color: '#b45309',
    }
});

export default NewItemScreen;