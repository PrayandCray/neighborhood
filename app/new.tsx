import AppButton from "@/components/button";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SelectList} from "react-native-dropdown-select-list";
import { SafeAreaView, View, StyleSheet, Text, TextInput, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UseItems } from './context/ItemContext';

const NewItemScreen = () => {
    const router = useRouter();
    const {listType} = useLocalSearchParams();
    const [inputText, setInputText] = useState('');
    const {addToPantry, addToGrocery, categories, unitOptions} = UseItems();
    const [category, setCategory] = useState('other');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('count')

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
                amount: amount || '1',
                unit: unit || 'count',
            };

            if (listType === 'pantry') {
                addToPantry(newItem);
                console.log(newItem);
            } else if (listType === 'grocery') {
                addToGrocery(newItem);
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
                    placeholderTextColor="#a96733"
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

                <View style={styles.amountContainer}>
                    <View style={styles.amountInputWrapper}>
                        <TextInput
                            placeholder="Enter Amount (Default: 1)"
                            placeholderTextColor="#a96733"
                            style={styles.amountInput}
                            keyboardType="numeric"
                            maxLength={12}
                            value={amount}
                            onChangeText={(text) => {
                                const numericValue = text.replace(/[^0-9]/g, '');
                                setAmount(numericValue);
                            }}
                        />
                    </View>
                    <SelectList
                        setSelected={setUnit}
                        data={unitOptions}
                        save="value"
                        search={false}
                        defaultOption={{ key: 'count', value: 'count' }}
                        boxStyles={styles.unitDropdown}
                        inputStyles={{
                            color: '#b45309',
                            justifyContent: 'center',
                            alignItems: 'center',
                    }}
                        dropdownStyles={styles.unitDropdownList}
                        dropdownTextStyles={{
                            color: '#b45309',
                            fontSize: 14,
                            alignItems: 'center',
                            justifyContent: 'center',
                    }}
                        dropdownItemStyles={{
                            paddingVertical: 8,
                        }}
                    />
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
            zIndex: 1
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
        amountContainer: {
            width: '90%',
            flexDirection: 'row',
            gap: 10,
            height: 45,
            alignItems: 'center',
            zIndex: 2,
            position: 'relative',
        },
        amountInputWrapper: {
            flex: 2,
            height: 40,
            borderWidth: 1,
            borderColor: '#b45309',
            borderRadius: 10,
            overflow: 'hidden',
        },
        amountInput: {
            flex: 1,
            height: '100%',
            padding: 10,
            color: '#b45309',
        },
        unitDropdown: {
            flex: 1,
            height: 40,
            borderColor: '#b45309',
            borderRadius: 10,
            backgroundColor: 'transparent',
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
        },
        unitDropdownList: {
            position: 'absolute',
            width: '100%',
            top: 45,
            borderColor: '#b45309',
            backgroundColor: '#fff',
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
        },
    });

export default NewItemScreen;