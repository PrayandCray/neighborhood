import AppButton from "@/components/button";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ListItem, UseItems } from "./context/ItemContext";
import { useStyle } from "./context/styleContext";

const MergeItemsScreen = () => {
    const {removeFromGrocery, removeFromPantry, updatePantryItem, updateGroceryItem} = UseItems();
    const { activeStyle } = useStyle();
    const [itemName, setItemName] = React.useState('');
    const [mergedItems, setMergedItems] = React.useState<ListItem[]>([]);

    const styles = getStyles(activeStyle);

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

    const { mergedItemsList } = useLocalSearchParams<{
        mergedItemsList?: string;
    }>();

    const {listType} = useLocalSearchParams()
    const convertedListType = listType === 'first' ? 'pantry' : 'grocery';

    const items = mergedItemsList ? JSON.parse(mergedItemsList) : [];

    const handleMergeNewItem = (name: string) => {
        useRouter().push({
            pathname: '/new',
            params: {itemName: name, merge: 'true', mergedItemsList, listType: convertedListType}
        })
        console.log(name)
    }

    React.useEffect(() => {
        if (mergedItemsList) {
            try {
                const parsed = JSON.parse(mergedItemsList);
                setMergedItems(parsed);
            } catch (e) {
                console.error("Failed to parse mergedItemsList", e);
            }
        }
    }, [mergedItemsList]);

    const handleRemoveMergeSelectedItem = async (idToKeep: string) => {
        const itemToKeep = mergedItems.find(item => item.id === idToKeep);
        const itemsToRemove = mergedItems.filter(item => item.id !== idToKeep);
        const unitsMatch = mergedItems.every(item => item.unit === itemToKeep?.unit);

        if (!itemToKeep) return;

        if (!unitsMatch) {
            Alert.alert(
                'Unit Mismatch',
                'All items must have the same unit to merge their amounts.',
                [{ text: 'OK' }]
            );
            return;
        }
        const totalAmount = itemsToRemove.reduce((sum, item) => {
            const amt = parseFloat(item.amount || '0');
            return sum + (isNaN(amt) ? 0 : amt);
        }, parseFloat(itemToKeep.amount || '0') || 0);

        const updatedItem = {
            ...itemToKeep,
            amount: totalAmount.toString(),
        };

        if (convertedListType === 'pantry') {
            await updatePantryItem(idToKeep, updatedItem);
        } else {
            await updateGroceryItem(idToKeep, updatedItem);
        }

        for (const item of itemsToRemove) {
            if (convertedListType === 'pantry') {
                await removeFromPantry(item.id);
            } else {
                await removeFromGrocery(item.id);
            }
        }

        useRouter().back();
    };



    return (
        <View style={styles.container}>
            <Text style={styles.text}>List of merged items</Text>

            <View style={{alignItems: 'center', alignSelf: 'center'}}>
                <TextInput
                    value={itemName}
                    onChangeText={setItemName}
                    style={styles.input}
                    placeholder="Enter Name of Merged Item"
                    placeholderTextColor={isDark ? '#EADDCA' : '#b45309'}
                />
            </View>

            <View>
                <View style={{paddingTop: 15}}>
                    <AppButton
                        text="Merge items into New Name"
                        onPress={() => handleMergeNewItem(itemName)}
                        isFullWidth={true}
                    />
                </View>
            </View>

            <Text style={[styles.text, {paddingTop: 40}]}> Or select an item to merge into </Text>

            <View style={styles.flatListContainer}>
                <FlatList
                    style={{ alignSelf: 'center' }}
                    data={items}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={true}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleRemoveMergeSelectedItem(item.id)}>
                            <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: 16 }}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

        </View>
    );
};
export const getStyles =  (activeStyle: string) => {
    const isDark = activeStyle === 'dark';

    const backgroundMain = isDark ? '#333' : '#EADDCA';
    const backgroundAlt = isDark ? '#444444' : '#fef3c7';
    const textMain = isDark ? '#EADDCA' : '#b45309';
    const textSecondary = isDark ? '#F5DEB3' : '#d97706';

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            paddingTop: 8,
            backgroundColor: backgroundMain,
        },
        flatListContainer: {
            width: '100%',
            maxHeight: 150,
            marginBottom: 16,
            textAlign: 'center',
            padding: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 8,
            backgroundColor: backgroundAlt,
        },
        text: {
            textAlign: 'center',
            color: textSecondary,
            fontSize: 18,
            marginBottom: 12,
        },
        input: {
            width: '90%',
            height: 40,
            padding: 10,
            marginVertical: 10,
            borderWidth: 1,
            color: textMain,
            borderColor: '#b45309',
            borderRadius: 10,
        },
})};

export default MergeItemsScreen;