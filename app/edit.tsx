import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UseItems } from './context/ItemContext';
import AppButton from '@/components/button';
import { Picker } from '@react-native-picker/picker';
import { SelectList } from "react-native-dropdown-select-list";

const EditScreen = () => {
    const { itemId, listType } = useLocalSearchParams();
    const router = useRouter();
    const {
        pantryItems,
        groceryItems,
        categories,
        unitOptions: units,
        updatePantryItem,
        updateGroceryItem
    } = UseItems();

    const item = listType === 'pantry'
        ? pantryItems.find(item => item.id === itemId)
        : groceryItems.find(item => item.id === itemId);

    const [name, setName] = useState(item?.name || '');
    const [amount, setAmount] = useState(item?.amount || '');
    const [category, setCategory] = useState(item?.category || 'other');
    const [unit, setUnit] = useState(item?.unit || 'count');

    const handleSave = () => {
        const updates = {
            name,
            amount,
            category,
            unit,
        };

        if (listType === 'pantry') {
            updatePantryItem(itemId as string, updates);

        } else {
            updateGroceryItem(itemId as string, updates);
        }

        router.back();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.content}>

                <View style={styles.container}>
                    <Text style={styles.label}>
                        Name
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter item name"
                    />

                    <Text style={styles.label}>
                        Amount
                    </Text>
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
                            data={units}
                            save="value"
                            search={false}
                            defaultOption={{ key: unit, value: unit }}
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

                    <Text style={styles.label}> Category </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue) => setCategory(itemValue)}
                            style={styles.pickerStyle}
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
                </View>

                <View style={styles.buttonContainer}>
                    <AppButton
                        text="Save"
                        onPress={handleSave}
                        isFullWidth={false}
                        width={100}
                        borderPadding={12}
                        textColor={'#fff'}
                        backgroundColor={'#b45309'}
                    />
                    <AppButton
                        text="Cancel"
                        onPress={() => router.back()}
                        isFullWidth={false}
                        width={100}
                        borderPadding={12}
                        textColor={'#fff'}
                        backgroundColor={'#b45309'}
                    />
                </View>

            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EADDCA',
    },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: '#EADDCA'
    },
    amountContainer: {
        width: '90%',
        alignSelf: 'center',
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
    label: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#b45309',
    },
    input: {
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
    pickerContainer: {
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 8,
        marginBottom: 16,
    },
    pickerStyle: {
        width: '90%',
        alignSelf: 'center',
        height: Platform.select({
            ios: 210,
        }),
        marginVertical: 10,
        borderWidth: Platform.select({
            ios: 1,
            android: 1,
        }),
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    buttonContainer: {
        backgroundColor: '#EADDCA',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 24,
    },
});

export default EditScreen;