import AppButton from "@/components/button";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UseItems } from './context/ItemContext';

const NewItemScreen = () => {
    const router = useRouter();
    const {listType} = useLocalSearchParams();
    const [inputText, setInputText] = useState('');
    const {addToPantry, addToGrocery, categories} = UseItems();
    const [category, setCategory] = useState('other');
    const [amount, setAmount] = useState('');

    const handleTextChange = (text: string) => {
        setInputText(text);
        const baseTitle = listType === 'pantry' ? 'Add to Pantry' : 'Add to Grocery List';
        router.setParams({
            headerTitle: text ? `Add "${text}" to ${listType}` : baseTitle
        });
    };

    const handleDone = () => {
        if (inputText.trim()) {
            const newItem = {
                name: inputText,
                category: category,
                amount: amount || '0',
            };

            if (listType === 'pantry') {
                addToPantry(newItem)
                console.log(newItem);
            } else if (listType === 'grocery') {
                addToGrocery(newItem)
                console.log(newItem);
            }
            router.back();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={handleTextChange}
                    placeholder="Enter Item Name"
                    placeholderTextColor="#b45309"
                />

                <View style={styles.pickerStyle}>
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={'#b45309'}
                    >
                        {categories.map((cat) => (
                            <Picker.Item
                                key={cat.value}
                                label={cat.label}
                                value={cat.value}
                                color={'#b45309'}
                            />
                        ))}
                    </Picker>
                </View>

                <TextInput
                    placeholder="Amount"
                    placeholderTextColor="#b45309"
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={12}
                    onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, '');
                        setAmount(numericValue);
                    }}
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
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#EADDCA',
            width: '100%',
            paddingTop: 20,
        },
        buttonContainer: {
            paddingTop: 50,
            bottom: 40,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        pickerStyle: {
            width: '90%',
            height: Platform.select({
                ios: 210,
            }),
            marginVertical: 10,
            borderWidth: Platform.select({
                ios: 1,
                android: 1,
            }),
            borderColor: '#b45309',
            borderRadius: 10,
            backgroundColor: 'transparent',
            overflow: 'hidden',
        },
        picker: {
            width: '100%',
            height: 60,
            backgroundColor: 'transparent',
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