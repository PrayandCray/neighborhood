import AppButton from "@/components/button";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import Fuse from "fuse.js";
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Keyboard, Platform, SafeAreaView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SelectList } from "react-native-dropdown-select-list";
import { ListItem, UseItems } from "./context/ItemContext";
import { useStyle } from "./context/styleContext";

const NewItemScreen = () => {
    const router = useRouter();
    const inputRef = React.useRef(null);
    const {listType, itemName, dupeItemAlert, merge, photouri} = useLocalSearchParams();
    const [inputText, setInputText] = useState<string>(typeof itemName === 'string' ? itemName : '');
    const {addToPantry, addToGrocery, removeFromGrocery, removeFromPantry, stores, pantryItems, groceryItems, categories, unitOptions} = UseItems();
    const {activeStyle} = useStyle();
    const [category, setCategory] = useState('other');
    const [amount, setAmount] = useState('');
    const [unit, setUnit] = useState('count');
    const [store, setStore] = useState('any')
    const rawParam = useLocalSearchParams().mergedItemsList;
    const mergedItemsJson = typeof rawParam === 'string' ? rawParam : rawParam?.[0] ?? '[]';
    const parsedMergedItemsList: ListItem[] = JSON.parse(mergedItemsJson);

    const booleanMerge = merge === 'true'

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
        const baseTitle = listType === 'pantry' ? 'Add to Pantry' : 'Add to Grocery List';
        router.setParams({
            headerTitle: text ? `Add "${text}" to ${listType}` : baseTitle
        });
    };

    const handleDeleteMergedItems = async () => {
        const mergedIds = parsedMergedItemsList.map(item => item.id);
        console.log("IDs to delete:", mergedIds);

        if (listType === 'grocery') {
            for (const id of mergedIds) {
                const item = groceryItems.find(i => i.id === id);
                if (item) {
                    await removeFromGrocery(item.id);
                    console.log(`Deleted grocery item: ${item.name}`);
                } else {
                    console.warn(`Couldn't find grocery item with id: ${id}`);
                }
            }
        } else if (listType === 'pantry') {
            for (const id of mergedIds) {
                const item = pantryItems.find(i => i.id === id);
                if (item) {
                    await removeFromPantry(item.id);
                    console.log(`Deleted pantry item: ${item.name}`);
                } else {
                    console.warn(`Couldn't find pantry item with id: ${id}`);
                }
            }
        }
    };

    const handleDone = async () => {

        if (inputText.trim()) {
            const existingItems = listType === 'grocery'? groceryItems : pantryItems;
            const itemName = inputText.trim()
            const fuse = new Fuse(existingItems, ({
                keys: ['name'],
                threshold: 0.5,
            }));
            const results = fuse.search(itemName)
            const jsonResults = JSON.stringify(results)

            if (booleanMerge) {
                await handleDeleteMergedItems();
                await addNewItem();
                router.back();

            } else {
                if (results.length > 0 && !dupeItemAlert ) {
                Alert.alert(
                    'Similar item found',
                    `Do you want to add this to an item already in your ${listType === 'grocery' ? 'Grocery List' : 'Pantry'}?`,
                    [
                        {
                            text: `Add ${itemName} to existing item`,
                            onPress: () => {
                                router.back(),
                                setTimeout(() => {
                                    router.push({
                                    pathname: '/simmilar_item',
                                    params: {listType, jsonResults, }
                                })
                                }, 50)
                                
                            }
                        },
                        {
                            text: `Add ${itemName} as a new item`,
                            onPress: () => addNewItem()
                            
                        },
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                    ]
                )
            } else {
                addNewItem()
            }
            }
            

            
        }
    };

    const addNewItem = async () => {
        try {
            if (!inputText || !category || !unit || (listType === 'grocery' && !store)) {
                alert('Please fill out all of the boxes.');
                return;
            }
        
            const newItem = {
                id: Date.now().toString(),
                name: inputText,
                category,
                amount: amount || '1',
                unit: unit || 'count',
                store: store || 'General',
                photouri: photouri || null
            };
        
            console.log(newItem)
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
                    ref={inputRef}
                    autoFocus={true}
                    style={styles.input}
                    value={inputText}
                    onChangeText={handleTextChange}
                    placeholder="Enter Item Name"
                    placeholderTextColor= {activeStyle === 'dark' ? '#EADDCA' : '#b45309'}
                />

                <View style={styles.pickerStyle}>
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={activeStyle === 'dark' ? '#EADDCA' : '#b45309'}
                    >
                        {categories.map((cat) => (
                            <Picker.Item
                                key={cat.value}
                                label={cat.label}
                                value={cat.value}
                                color={activeStyle === 'dark' ? '#EADDCA' : '#b45309'}
                            />
                        ))}
                    </Picker>
                    {Platform.OS === 'android' && (
                        <Ionicons
                            name="caret-down"
                            size={12}
                            color={activeStyle === 'dark' ? '#EADDCA' : '#b45309'}
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
                            placeholderTextColor= {activeStyle === 'dark' ? '#EADDCA' : '#b45309'}
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
                            color: activeStyle === 'dark' ? '#EADDCA' : '#b45309',
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
                            <Ionicons name="caret-down" size={12} color= {activeStyle === 'dark' ? '#EADDCA' : '#b45309'} style={{left: '10%'}} />
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
                            defaultOption={{ key: 'General', value: 'general' }}
                            boxStyles={styles.unitDropdown}
                            inputStyles={{
                                fontWeight: '500',
                                color: '#a96733',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            dropdownStyles={styles.unitDropdownList}
                            dropdownTextStyles={{
                                color: activeStyle === 'dark' ? '#EADDCA' : '#b45309',
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
                        onPress={() => handleDone()}
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

export const getStyles = (activeStyle: string) => {
    const isDark = activeStyle === 'dark';

    const backgroundMain = isDark ? '#333' : '#EADDCA';
    const backgroundAlt = isDark ? '#444444' : '#fef3c7';
    const textMain = isDark ? '#EADDCA' : '#b45309';
    const textSecondary = isDark ? '#F5DEB3' : '#d97706';

    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: backgroundMain,
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
            color: textMain,
            marginVertical: 16,
            borderWidth: 1,
            borderColor: '#b45309',
            borderRadius: 10,
        },
})};

export default NewItemScreen;