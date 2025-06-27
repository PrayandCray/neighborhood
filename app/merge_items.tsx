import AppButton from "@/components/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ListItem, UseItems } from "./context/ItemContext";

const MergeItemsScreen = () => {
    const {removeFromGrocery, removeFromPantry} = UseItems()
    const [itemName, setItemName] = React.useState('')
    const [mergedItems, setMergedItems] = React.useState<ListItem[]>([]);

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

    const updateMergedItems = async (idToRemove: string) => {
        setMergedItems(prev => prev.filter(item => item.id !== idToRemove));
        console.log('Updated merged items:', mergedItems);
    }

    const handleRemoveMergeSelectedItem = async (idToRemove: string) => {
        await updateMergedItems(idToRemove)
        for (const item of mergedItems) {
            if (convertedListType === 'pantry') {
                await removeFromPantry(item.id);
                console.log(`deleted pantry item ${item.name}`)
            } else {
                await removeFromGrocery(item.id);
                console.log(`deleted grocery item ${item.name}`)
            }
            useRouter().back()
        }
        setMergedItems([]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>List of merged items</Text>

            <View style={[styles.input, {alignItems: 'center', alignSelf: 'center'}]}>
                <TextInput
                    value={itemName}
                    onChangeText={setItemName}
                    placeholder="Enter Name of Merged Item"
                    placeholderTextColor={'#b45309'}
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
                    style={{alignSelf: 'center'}}
                    data={items}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={true}
                    persistentScrollbar={true}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                handleRemoveMergeSelectedItem(item.id)
                            }}
                        >
                            <Text style={{textAlign: 'center', paddingVertical: 5, fontSize: 16}}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 8,
        backgroundColor: "#EADDCA",
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
        backgroundColor: '#f9fafb',
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 12,
    },
    input: {
        width: '90%',
        height: 40,
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 10,
    },
});

export default MergeItemsScreen;
