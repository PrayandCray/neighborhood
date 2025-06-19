import AppButton from "@/components/button";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { Alert, Keyboard, Platform, SafeAreaView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { UseItems } from "./context/ItemContext";

const NewListScreen = () => {
    const router = useRouter();
    const { addStore } = UseItems();
    const inputRef = React.useRef(null);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleTextChange = (text: string) => {
        setInputText(text);
        router.setParams({
            headerTitle: text ? `Add "${text}" as a new Store`: "Add new Store"
        });
    };

    const handleDone = async () => {
        if (!inputText.trim()) {
            Alert.alert('Error', 'Please enter a store name');
            return;
        }

        try {
            setIsLoading(true);
            await addStore(inputText);
            // Wait a brief moment to ensure store is added
            setTimeout(() => {
                setIsLoading(false);
                router.back();
            }, 500);
        } catch (error) {
            console.error('Error adding store:', error);
            setIsLoading(false);
            Alert.alert(
                'Error', 
                error instanceof Error ? error.message : 'Failed to add store'
            );
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (Platform.OS !== 'web') {
                    Keyboard.dismiss();
                }
            }}
        >
            <SafeAreaView style={styles.container}>
                <TextInput
                    ref = {inputRef}
                    autoFocus={true}
                    style={styles.input}
                    value={inputText}
                    onChangeText={handleTextChange}
                    placeholder="Enter Store Name"
                    placeholderTextColor="#a96733"
                />

                <View style={styles.buttonContainer}>
                    <AppButton
                        text="Done"
                        onPress={handleDone}
                        isFullWidth={false}
                        width={150}
                        borderPadding={20}
                        borderColor={'#fff'}
                        textColor={'#EADDCA'}
                    />
                </View>

            </SafeAreaView>
        </TouchableWithoutFeedback>
    )

}

const styles = StyleSheet.create({
     container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#EADDCA',
        width: '100%',
        paddingTop: 20,
        zIndex: 1
    },
    buttonContainer: {
        paddingTop: 50,
        bottom: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        height: 40,
        padding: 10,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 10,
    },
})

export default NewListScreen;