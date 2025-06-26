import AppButton from "@/components/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const MergeItemsScreen = () => {
    const [itemName, setItemName] = React.useState('')

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

    return (
        <View style={styles.container}>
            <Text style={styles.text}>List of merged items</Text>

            <View style={styles.flatListContainer}>
                <FlatList
                    style={{alignSelf: 'center'}}
                    data={items}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={true}
                    persistentScrollbar={true}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{textAlign: 'center', paddingVertical: 5}}>{item.name}</Text>
                        </View>
                    )}
                />
            </View>

            <View style={styles.input}>
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

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
