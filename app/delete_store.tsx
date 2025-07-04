import AppButton from "@/components/button";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from 'react';
import {
    Alert,
    Keyboard,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SelectList } from "react-native-dropdown-select-list";
import { UseItems } from "./context/ItemContext";
import { useStyle } from "./context/styleContext";

const NewListScreen = () => {
    const { itemId, listType } = useLocalSearchParams();
    const router = useRouter();

    const {
        pantryItems,
        groceryItems,
        stores,
        deleteStore,
    } = UseItems();

    const {
        activeStyle
    } = useStyle();

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

    const item = listType === 'pantry'
        ? pantryItems.find(item => item.id === itemId)
        : groceryItems.find(item => item.id === itemId);

    const initialStoreValue = item
        ? stores.find(s => s.label === item.store)?.value ?? 'general'
        : 'general';

    const [store, setStore] = useState(initialStoreValue);

    const handleDelete = () => {
        if (store === 'general') {
            Alert.alert('Error', 'The General store cannot be deleted.');
            return;
        }
        deleteStore(store);
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

                    <View style={{backgroundColor: '#EADDCA', width: '90%', alignSelf: 'center'}}>

                        <Text style={styles.title}>Delete a Store</Text>

                        <Text style={styles.label}>Select Store</Text>

                        <View style={styles.dropdownWrapper}>
                            <SelectList
                                setSelected={setStore}
                                data={stores.map(store => ({
                                    key: store.value,
                                    value: store.label
                                }))}
                                save="key"
                                search={false}
                                defaultOption={{
                                    key: initialStoreValue,
                                    value: item?.store || 'General'
                                }}
                                boxStyles={styles.unitDropdown}
                                inputStyles={styles.inputText}
                                dropdownStyles={styles.unitDropdownList}
                                dropdownTextStyles={styles.dropdownText}
                                dropdownItemStyles={{ paddingVertical: 8 }}
                                arrowicon={
                                    <Ionicons name="caret-down" size={14} color="#a96733" style={{paddingLeft: '5%', top: '1.5%'}} />
                                }
                            />
                        </View>

                        <View style={{alignItems: 'center'}}>
                            <AppButton
                                text='Delete Store'
                                onPress={handleDelete}
                                backgroundColor="#DC2626"
                                textColor="#fff"
                                isFullWidth={false}
                                //@ts-ignore
                                width="60%"
                            />
                        </View>
                    </View>
                </SafeAreaView>
        </TouchableWithoutFeedback>   
    );
};

export const getStyles = (activeStyle: string) => {
    const isDark = activeStyle === 'dark';
    const backgroundMain = isDark ? '#333' : '#EADDCA';
    const backgroundAlt = isDark ? '#444444' : '#fef3c7';
    const textMain = isDark ? '#EADDCA' : '#b45309';
    const textSecondary = isDark ? '#F5DEB3' : '#d97706';

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: backgroundMain,
        },
        innerContent: {
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
        },
        label: {
            fontSize: 16,
            color: '#5B3A0D',
            marginBottom: 6,
            marginLeft: 10,
        },
        title: {
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '600',
            marginBottom: 20,
            color: '#843F00',
        },
        dropdownWrapper: {
            width: '100%',
            marginBottom: 20,
        },
        unitDropdown: {
            borderColor: '#b45309',
            borderRadius: 10,
            height: 45,
            backgroundColor: '#fff',
            justifyContent: 'center',
            paddingHorizontal: 12,
        },
        inputText: {
            fontFamily: 'sans-serif',
            color: textMain,
            textAlign: 'center',
        },
        unitDropdownList: {
            borderColor: '#b45309',
            backgroundColor: '#fff',
            borderRadius: 10,
        },
        dropdownText: {
            color: '#b45309',
            fontSize: 14,
            textAlign: 'center',
        },
        buttonWrapper: {
            width: '100%',
            marginTop: 10,
        },
})};

export default NewListScreen;