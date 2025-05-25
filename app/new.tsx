import AppButton from "@/components/button";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UseItems } from './context/ItemContext';

const NewItemScreen = () => {
    const router = useRouter();
    const {listType} = useLocalSearchParams();
    const [inputText, setInputText] = useState('');
    const {addToPantry, addToGrocery, categories} = UseItems();
    const [category, setCategory] = useState('other');

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
            };

            if (listType === 'pantry') {
                addToPantry(newItem);
            } else if (listType === 'grocery') {
                addToGrocery(newItem);
            }
            router.back();
        }
    };

    return (
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
        );
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#EADDCA',
            width: '100%',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            paddingTop: 50,
            width: '100%',
        },
        pickerStyle: {
            width: '90%',
            height: 160,
            marginVertical: 16,
            borderWidth: 0,
            backgroundColor: 'transparent',
        },
        text: {
            paddingTop: 16,
            color: '#b45309',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        picker: {
            width: '100%',
            height: 40,
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