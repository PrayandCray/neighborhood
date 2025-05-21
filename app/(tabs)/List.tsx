import React from 'react';
import {useRouter} from 'expo-router';
import AppButton from "@/components/button";
import {SafeAreaView, View, Text, StyleSheet, FlatList} from 'react-native';
import { UseItems } from '../context/ItemContext';
import {Ionicons} from "@expo/vector-icons";

const List = () => {
    const router = useRouter();
    const {
        pantryItems,
        groceryItems,
        removeFromPantry,
        removeFromGrocery,
    } = UseItems();

    const [activelist, setActiveList] = React.useState<'first' | 'second'>('first');

    const renderListContent = () => {
        const items = activelist === 'first' ? pantryItems : groceryItems;
        const removeitem = activelist === 'first' ? removeFromPantry : removeFromGrocery;

        return (
            <View style={styles.listContainer}>
                <Text style={styles.listExampleText}>
                    {activelist === 'first' ? 'My Pantry' : 'Grocery List'}
                </Text>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={styles.listItemContainer}>
                            <Text style={styles.listItem}>
                                {item.name}
                            </Text>

                            <Ionicons
                                name="trash-outline"
                                size={24}
                                color="#b45309"
                                onPress={() => removeitem(item.id)}
                            />
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyList}>
                            No Items in Lists
                        </Text>
                    }
                />
            </View>

        );

    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                List
            </Text>
            <Text style={styles.subtitle}>
                This is where your lists are stored
            </Text>
            <View style={styles.buttonContainer}>
                <AppButton
                    text="My Pantry"
                    onPress={() => setActiveList('first')}
                    width={150}
                    borderPadding={10}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />

                <AppButton
                    text='Grocery List'
                    onPress={() => setActiveList('second')}
                    width={150}
                    borderPadding={10}
                    borderColor={activelist === 'first' ? '#b45309' : '#fff'}
                    textColor={'#EADDCA'}
                />
            </View>

            {renderListContent()}

            <AppButton
                text="Scan Items"
                onPress={() => console.log('New Scan Item')}
                isFullWidth={false}
                width={150}
                borderPadding={20}
                borderColor={'#fff'}
                textColor={'#EADDCA'}
            />

            <AppButton
                text="Manually Add"
                onPress={() => router.push({
                    pathname: '/new',
                    params: { listType: activelist === 'first' ? 'pantry' : 'grocery'}
                })}
                isFullWidth={false}
                width={150}
                borderPadding={20}
                borderColor={'#fff'}
                textColor={'#EADDCA'}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#EADDCA',
        padding: 16,
        gap: 16,
        width: '100%',
    },
    listContainer: {
        flex: 1,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
    listItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    listExampleText: {
        color: '#b45309',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listItem: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingEnd: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#b45309',
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
    title: {
        paddingTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#b45309',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#d97706',
        textAlign: 'center',
    },
});

export default List;