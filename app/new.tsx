import React, {useState} from 'react';
import {SafeAreaView, Text, StyleSheet, TextInput} from 'react-native';
import AppButton from "@/components/button";
import {useLocalSearchParams, useRouter} from 'expo-router';
import { UseItems } from './context/ItemContext';


const NewItemScreen = () => {
    const router = useRouter();
    const { listType } = useLocalSearchParams();
    const [inputText, setInputText] = useState('');
    const { addToPantry, addToGrocery } = UseItems();

    const handleDone = () => {
        if (inputText.trim()) {
            if (listType === 'pantry') {
                addToPantry(inputText);
            } else if (listType === 'grocery') {
                addToGrocery(inputText);
            }
            router.back();
        }
    };

    return(
        <SafeAreaView style={styles.container}>

            <Text style={styles.text}>
                Add New Item to {listType === 'pantry' ? 'Pantry' : 'Grocery List'}
            </Text>

            {/* Name */}
            <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Enter Item Name"
                placeholderTextColor="#b45309"
            />

            <AppButton
                text="Done"
                onPress={handleDone} //change so it can create new value for the list
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        width: '90%',
        height: 40,
        padding: 10,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 10,
    }
});

export default NewItemScreen;