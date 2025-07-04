import AppButton from "@/components/button";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { ListItem, UseItems } from "./context/ItemContext";
import { useStyle } from "./context/styleContext";

const MergeItemsScreen = () => {
    const { removeFromGrocery, removeFromPantry, updatePantryItem, updateGroceryItem, unitOptions } = UseItems();
    const { activeStyle } = useStyle();
    const [itemName, setItemName] = React.useState('');
    const [itemUnit, setItemUnit] = React.useState('');
    const [itemAmount, setItemAmount] = React.useState('');
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

    const { mergedItemsList } = useLocalSearchParams<{ mergedItemsList?: string }>();
    const { listType } = useLocalSearchParams();
    const convertedListType = listType === 'first' ? 'pantry' : 'grocery';

    const items = mergedItemsList ? JSON.parse(mergedItemsList) : [];

    const router = useRouter();

    const handleMergeNewItem = (name: string) => {
        if (!name || !itemUnit) {
            Alert.alert("Missing Info", "Please enter a name and select a unit.");
            return;
        }

        const unitsMatch = mergedItems.every(item => item.unit === itemUnit);

        if (!unitsMatch) {
            Alert.alert("Unit Mismatch", "All items must have the same unit as the selected unit to merge.", [{ text: "OK" }]);
            return;
        }

        const totalAmount = mergedItems.reduce((sum, item) => {
            const amt = parseFloat(item.amount || "0");
            return sum + (isNaN(amt) ? 0 : amt);
        }, 0);

        router.push({
            pathname: "/new",
            params: {
                itemName: name,
                itemUnit: itemUnit,
                itemAmount: totalAmount.toString(),
                merge: "true",
                mergedItemsList: JSON.stringify(mergedItems),
                listType: convertedListType,
            },
        });
    };

    React.useEffect(() => {
        if (mergedItemsList) {
            try {
                const parsed = JSON.parse(mergedItemsList);
                setMergedItems(parsed);
                const total = parsed.reduce((sum: number, item: ListItem) => {
                
                
                    const amt = parseFloat(item.amount || "0");
                    return sum + (isNaN(amt) ? 0 : amt);
                }, 0);
                setItemAmount(total.toString());
                setItemUnit(parsed[0]?.unit || "count");
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
            Alert.alert("Unit Mismatch", "All items must have the same unit to merge their amounts.", [{ text: "OK" }]);
            return;
        }

        const totalAmount = itemsToRemove.reduce((sum, item) => {
            const amt = parseFloat(item.amount || "0");
            return sum + (isNaN(amt) ? 0 : amt);
        }, parseFloat(itemToKeep.amount || "0") || 0);

        const updatedItem = {
            ...itemToKeep,
            amount: totalAmount.toString(),
        };

        if (convertedListType === "pantry") {
            await updatePantryItem(idToKeep, updatedItem);
        } else {
            await updateGroceryItem(idToKeep, updatedItem);
        }

        for (const item of itemsToRemove) {
            if (convertedListType === "pantry") {
                await removeFromPantry(item.id);
            } else {
                await removeFromGrocery(item.id);
            }
        }

        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>List of merged items</Text>

            <View style={{ alignItems: 'center', alignSelf: 'center' }}>
                <TextInput
                    value={itemName}
                    onChangeText={setItemName}
                    style={styles.input}
                    placeholder="Enter Name of Merged Item"
                    placeholderTextColor={isDark ? '#EADDCA' : '#b45309'}
                />
            </View>

            <View>
                <View style={{ paddingTop: 15 }}>
                    <AppButton
                        text="Merge items into New Name"
                        onPress={() => handleMergeNewItem(itemName)}
                        isFullWidth={true}
                    />
                </View>
            </View>

            <Text style={[styles.text, { paddingTop: 40 }]}> Or select an item to merge into </Text>

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

            <View style={styles.amountContainer}>
                <View style={styles.amountInputWrapper}>
                    <TextInput
                        placeholder="Enter Amount (Default: 1)"
                        style={styles.amountInput}
                        keyboardType="numeric"
                        maxLength={12}
                        value={itemAmount}
                        onChangeText={(text) => {
                            const numericValue = text.replace(/[^0-9]/g, '');
                            setItemAmount(numericValue);
                        }}
                    />
                </View>
                <SelectList
                    setSelected={setItemUnit}
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
        </View>
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
            color: textMain,
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
            backgroundColor: backgroundMain,
        },
    });
};

export default MergeItemsScreen;