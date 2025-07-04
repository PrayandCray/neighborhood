import AppButton from "@/components/button";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Keyboard, Platform, SafeAreaView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { UseItems } from "./context/ItemContext";
import { useStyle } from "./context/styleContext";

const NewListScreen = () => {
    const router = useRouter();
    const { addStore } = UseItems();
    const { activeStyle } = useStyle();
    const inputRef = React.useRef(null);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);


        const navigation = useNavigation();
        const isDark = activeStyle === 'dark';
    
        useLayoutEffect(() => {
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: isDark ? '#333333' : '#EADDCA',
                },
                headerTintColor: isDark ? '#EADDCA' : '#b45309',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            });
        }, [navigation, activeStyle]);

    const styles = getStyles(activeStyle)

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
            <SafeAreaView style={[styles.container, {backgroundColor: activeStyle === 'dark' ? '#333' : '#EADDCA'}]}>
                <TextInput
                    ref = {inputRef}
                    autoFocus={true}
                    style={styles.input}
                    value={inputText}
                    onChangeText={handleTextChange}
                    placeholder="Enter Store Name"
                    placeholderTextColor={activeStyle == 'dark' ? '#EADDCA' : '#b45309'}
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

export const getStyles =  (activeStyle: string) => {
    const isDark = activeStyle === 'dark';

    const backgroundMain = isDark ? '#333' : '#EADDCA';
    const backgroundAlt = isDark ? '#444444' : '#fef3c7';
    const textMain = isDark ? '#EADDCA' : '#b45309';
    const textSecondary = isDark ? '#F5DEB3' : '#d97706';

    return StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        paddingTop: 20,
        zIndex: 1
    },
    buttonContainer: {
        paddingTop: 50,
        backgroundColor: 'transparent',
        bottom: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        color: textMain,
        height: 40,
        padding: 10,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 10,
    },
})};

export default NewListScreen;