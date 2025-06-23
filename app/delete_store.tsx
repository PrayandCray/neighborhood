import AppButton from "@/components/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from 'react';
import { Keyboard, Platform, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SelectList } from "react-native-dropdown-select-list";
import { UseItems } from "./context/ItemContext";

const DeleteStoreScreen = () => {
    const { itemId, listType } = useLocalSearchParams();
    const router = useRouter();

    const {
        pantryItems,
        groceryItems,
        stores,
        deleteStore,
    } = UseItems();

    const item = listType === 'pantry'
        ? pantryItems.find(item => item.id === itemId)
        : groceryItems.find(item => item.id === itemId);

    // Use store value, not label
    const [store, setStore] = useState(item?.store || 'general');

    const handleDeleteStore = (storeValue: string) => {
        deleteStore(storeValue);
        console.log(`Deleted store ${storeValue}`);
        console.log('list of current stores', stores);
        router.back();
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
                <View style={styles.storeContainer}>
                    <AppButton
                        text='Delete'
                        onPress={() => handleDeleteStore(store)}
                    />
                    <SelectList
                        setSelected={setStore}
                        data={stores.map(store => ({
                            key: store.value,
                            value: store.label
                        }))}
                        save="key"
                        search={false}
                        defaultOption={{
                            key: store,
                            value: stores.find(s => s.value === store)?.label || store
                        }}
                        boxStyles={styles.unitDropdown}
                        inputStyles={{
                            fontFamily: 'sans-serif',
                            color: '#b45309',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        dropdownStyles={styles.unitDropdownList}
                        dropdownTextStyles={{
                            color: '#b45309',
                            fontSize: 13,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        dropdownItemStyles={{
                            paddingVertical: 8,
                        }}
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
    input: {
        width: '90%',
        height: 40,
        padding: 10,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 10,
    },
    unitDropdown: {
        paddingTop: 10,
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
    storeContainer: {
        marginBottom: '1%',
        position: 'relative',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        gap: 10,
        zIndex: 1,
        marginTop: 10,
        height: 45,
    },
});

export default DeleteStoreScreen;