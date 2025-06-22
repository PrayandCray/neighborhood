import AppButton from "@/components/button";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, Platform, SafeAreaView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SelectList } from "react-native-dropdown-select-list";
import { UseItems } from './context/ItemContext';

const NewItemScreen = () => {
    const router = useRouter();
    const inputRef = React.useRef(null);
    const {listType, itemName} = useLocalSearchParams();
    const [inputText, setInputText] = useState<string>(typeof itemName === 'string' ? itemName : '');
    const {addToPantry, addToGrocery, stores, pantryItems, groceryItems, categories, unitOptions} = UseItems();
    const [category, setCategory] = useState('other');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('count');
    const [store, setStore] = useState('any')

    const handleTextChange = (text: string) => {
        setInputText(text);
        const baseTitle = listType === 'pantry' ? 'Add to Pantry' : 'Add to Grocery List';
        router.setParams({
            headerTitle: text ? `Add "${text}" to ${listType}` : baseTitle
        });
    };

    const handleDone = async () => {
    if (inputText.trim()) {
        try {
            const newItem = {
                id: Date.now().toString(),
                name: inputText,
                category,
                amount: amount || '1',
                unit: unit || 'count',
                store: listType === 'grocery' ? store : 'any',
            };

            if (listType === 'pantry') {
                await addToPantry(newItem);
                console.log('Added to pantry:', newItem);
            } else if (listType === 'grocery') {
                await addToGrocery(newItem);
                console.log('Added to grocery:', newItem);
            }
            router.back();
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add item. Please try again.');
        }
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
                    ref={inputRef}
                    autoFocus={true}
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
                        dropdownIconColor='#EADDCA'
                    >
                        {categories.map((cat) => (
                            <Picker.Item
                                key={cat.value}
                                label={cat.label}
                                value={cat.value}
                                color={'#a96733'}
                            />
                        ))}
                    </Picker>
                    {Platform.OS === 'android' && (
                        <Ionicons
                            name="caret-down"
                            size={12}
                            color="#a96733"
                            style={{
                                position: 'absolute',
                                right: 20,
                                top: '60%',
                                marginTop: -10,
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </View>

                <View style={styles.amountContainer}>
                    <View style={styles.amountInputWrapper}>
                        <TextInput
                            placeholder="Amount (Default: 1)"
                            placeholderTextColor="#a96733"
                            style={styles.amountInput}
                            keyboardType="numeric"
                            maxLength={10}
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
                        defaultOption={{key: 'count', value: 'count'}}
                        boxStyles={styles.unitDropdown}
                        inputStyles={{
                            color: '#a96733',
                            textAlign: 'left',
                            fontWeight: '500',
                        }}
                        dropdownStyles={styles.unitDropdownList}
                        dropdownTextStyles={{
                            color: '#b45309',
                            fontSize: 14,
                            textAlign: 'left',
                        }}
                        arrowicon={
                            <Ionicons name="caret-down" size={12} color="#a96733" style={{left: '10%'}} />
                        }
                    />
                </View>

                {listType === 'grocery' && (
                    <View style={[styles.storeContainer, {justifyContent: 'center'}]}>
                        <View style={{ width: '64%' }}>
                            <AppButton
                                text="+ Add New Store"
                                onPress={() => { router.push({ pathname: '/new_store' }) }}
                                isFullWidth={true}
                                fontSize={14}
                                backgroundColor="#b45309"
                                textColor="#EADDCA"
                            />
                        </View>
                        <SelectList
                            setSelected={setStore}
                            data={stores.map(store => ({
                                key: store.label,
                                value: store.label
                            }))}
                            save="value"
                            search={false}
                            defaultOption={{ key: 'general', value: 'General' }}
                            boxStyles={styles.unitDropdown}
                            inputStyles={{
                                fontWeight: '500',
                                color: '#a96733',
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
                            placeholder="General"
                            arrowicon={
                                <Ionicons name="caret-down" size={12} color="#a96733" style={{left: '10%'}} />
                            }   
                        />
                    </View>
                    )}

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
    pickerStyle: {
        width: '90%',
        height: Platform.select({
            ios: 210,
        }),
        marginBottom: 10,
        borderWidth: 1,
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
        flex: 2,
        height: 40,
        borderColor: '#b45309',
        borderRadius: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        minWidth: 100,
        paddingHorizontal: 8,
        zIndex: 3,
    },
    unitDropdownList: {
        position: 'absolute',
        minWidth: 100,
        top: 45,
        borderColor: '#b45309',
        backgroundColor: '#fff',
    },
    storeContainer: {
        position: 'relative',
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        zIndex: 1,
        marginTop: 10,
        height: 45,   
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