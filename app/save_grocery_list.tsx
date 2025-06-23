import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

const SaveGroceryListScreen = () => {
    const { selectedList } = useLocalSearchParams();
    const [text, setText] = useState('')

    // Parse the grocery list from params
    let items: any[] = [];
    try {
        items = selectedList ? JSON.parse(selectedList as string) : [];
    } catch {
        items = [];
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Set a name for your saved list</Text>
            <TextInput
                placeholder="Amount (Default: 1)"
                placeholderTextColor="#a96733"
                style={styles.input}
                keyboardType="web-search"
                maxLength={10}
                onChangeText={(text) => {
                    setText(text);
                }}
            />
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItemContainer}>
                        <View style={styles.itemContentContainer}>
                            <Text style={styles.listItem} numberOfLines={1}>{item.name}</Text>
                            <Text style={[styles.categoryLabel, styles.categoryContainer, {paddingVertical: '4%'}]} numberOfLines={1}>{item.store}</Text>
                            <View style={{flexDirection: 'column', gap: 4, alignItems: 'center'}}>
                                <Text style={[styles.categoryContainer, styles.categoryLabel]} numberOfLines={1}>
                                    {`${item.amount || '1'} ${item.unit || 'count'}`}
                                </Text>
                                {item.category && (
                                    <View style={styles.categoryContainer}>
                                        <Text style={styles.categoryLabel} numberOfLines={1}>
                                            {item.category}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View>
                                <Ionicons
                                    style={{paddingLeft: '5%', paddingRight: '2%', justifyContent: 'center'}}
                                    name='create-outline'
                                    size={20}
                                    color="#4076cc"
                                />
                            </View>
                            <View style={[styles.plusMinusContainer, {flexDirection: 'column'}]}>
                                <View style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30,}]}>
                                    <Text style={[styles.categoryLabel, {color: "#4076cc"}]}>
                                        -1
                                    </Text>
                                </View>
                                <View style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30,}]}>
                                    <Text style={[styles.categoryLabel, {color: "#4076cc"}]}>
                                        +1
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.trashContainer}>
                                <Ionicons
                                    name = 'trash-bin-outline'
                                    size = {20}
                                    color = "#b45309"
                                />
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyList}>No Items Found</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EADDCA',
        padding: 16,
    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#b45309',
        marginBottom: 8,
    },
    listItemContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        width: '90%',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#b45309',
    },
    itemContentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1%',
        minWidth: 0,
    },
    listItem: {
        flex: 2,
        fontSize: 11,
        fontWeight: '600',
        paddingRight: 4,
    },
    categoryLabel: {
        fontSize: 10,
        fontWeight: '400',
        color: '#d97706',
        textAlign: 'center',
        paddingVertical: 4,
    },
    categoryContainer: {
        flex: 1,
        minWidth: 50,
        maxWidth: 60,
        paddingHorizontal: 4,
        borderRadius: 8,
        backgroundColor: '#fef3c7',
    },
    plusMinusContainer: {
        flex: 0,
        flexDirection: "row",
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categorySmallContainer: {
        width: 30,
        borderRadius: 8,
        backgroundColor: '#fef3c7',
    },
    trashContainer: {
        alignItems: 'center',
        marginLeft: 4,
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#b45309',
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

export default SaveGroceryListScreen;