import React, { useEffect } from 'react';
import {useRouter, useLocalSearchParams} from 'expo-router';
import AppButton from "@/components/button";
import {SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { UseItems } from '../context/ItemContext';
import {Ionicons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const List = () => {
    const router = useRouter();
    const { initialList } = useLocalSearchParams();
    const [activeList, setActiveList] = React.useState<'first' | 'second'>(
        initialList === 'second' ? 'second' : 'first'
    );
    const [sortByCategory, setSortByCategory] = React.useState(false);

    useEffect(() => {
        if (initialList) {
            setActiveList(initialList === 'second' ? 'second' : 'first');
        }
    }, [initialList]);

    const {
        pantryItems,
        groceryItems,
        categories: itemCategories,
        removeFromPantry,
        removeFromGrocery,
    } = UseItems();

    const currentItems = activeList === 'first' ? pantryItems : groceryItems;
    const removeItem = activeList === 'first' ? removeFromPantry : removeFromGrocery;

    const sortedItems = React.useMemo(() => {
        if (!sortByCategory) return currentItems;

        return [...currentItems].sort((a, b) => {
            const catA = itemCategories.find(cat => cat.value === a.category)?.label;
            const catB = itemCategories.find(cat => cat.value === b.category)?.label;

            if (catA === 'Other' && catB !== 'Other') return 1;
            if (catB === 'Other' && catA !== 'Other') return -1;

            // @ts-ignore
            return catA.localeCompare(catB);
        });
    }, [currentItems, sortByCategory, itemCategories]);

    return (
        <LinearGradient
            colors={['#E2E2E2', '#B39171', '#843F00']}
            locations={[0, 0.275, 1]}
            style={styles.container}>
            <SafeAreaView>

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
                        width={130}
                        borderPadding={10}
                        borderColor={activeList === 'first' ? '#fff' : '#b45309'}
                        textColor={'#EADDCA'}/>
                    <AppButton
                        text='Grocery List'
                        onPress={() => setActiveList('second')}
                        width={130}
                        borderPadding={10}
                        borderColor={activeList === 'second' ? '#fff' : '#b45309'}
                        textColor={'#EADDCA'}/>
                </View>

                <View style={styles.sortButtonContainer}>
                    <TouchableOpacity
                        onPress={() => setSortByCategory(!sortByCategory)}
                        activeOpacity={0.45}
                        style={[styles.sortButton, sortByCategory && styles.sortButtonActive]}>
                        <Text style={[
                            styles.sortButtonText,
                            sortByCategory && styles.sortButtonTextActive
                        ]}>
                            {sortByCategory ? 'Sort by Date Added' : 'Sort by Category'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listExampleContainer}>

                    <Text style={[styles.listItem, {paddingLeft: 26}]}>
                        Name
                    </Text>
                    <View style={{gap: 16, flexDirection: 'row'}}>
                        <View style={[styles.amountDisplayContainer, {
                            paddingHorizontal: 5,
                            paddingVertical: 1,
                        }]}>
                            <Text>
                                Amt.
                            </Text>
                        </View>
                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryLabel}>
                                Category
                            </Text>
                        </View>
                    </View>
                    <View style={{paddingLeft: 100, paddingRight: 14}}>
                        <Ionicons
                            name="trash-outline"
                            size={24}
                            color="#b45309"
                            style={{paddingTop: 6}}
                        />
                    </View>

                </View>

                <FlatList
                    style={styles.listContainer}
                    data={sortedItems}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={true}
                    persistentScrollbar={true}
                    renderItem={({item}) => (
                        <View style={styles.listItemContainer}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16}}>
                                <Text style={styles.listItem}>{item.name}</Text>
                                <Text style={styles.amountDisplayContainer}>
                                    {item.amount ? `${item.amount}` : ''}
                                </Text>
                                {item.category && (
                                    <View style={styles.categoryContainer}>
                                        <Text style={styles.categoryLabel}>
                                            {itemCategories.find(cat => cat.value === item.category)?.label || 'Other'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Ionicons
                                name="trash-outline"
                                size={24}
                                color="#b45309"
                                onPress={() => removeItem(item.id)}
                            />
                        </View>
                    )}
                    ListHeaderComponent={
                        <Text style={styles.listHeaderText}>
                            {activeList === 'first' ? 'My Pantry' : 'Grocery List'}
                        </Text>
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyList}>
                            {activeList === 'first' ? 'Your pantry is empty!' : 'Your grocery list is empty!'}
                        </Text>
                    }
                />
                <View style={styles.buttonContainer}>
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
                            params: { listType: activeList === 'first' ? 'pantry' : 'grocery'}
                        })}
                        isFullWidth={false}
                        width={150}
                        borderPadding={20}
                        borderColor={'#fff'}
                        textColor={'#EADDCA'}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
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
        paddingBottom: 80,
        gap: 16,
        width: '100%',

    },
    listContainer: {
        flex: 2,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 16,
        marginVertical: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingBottom: 5,
    },
    listExampleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        //alignItems: 'flex-start',
        paddingVertical: 6,
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderBottomColor: '#fff',
    },
    sortButtonContainer: {
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#fef3c7',
    },
    sortButtonActive: {
        backgroundColor: '#b45309',
    },
    sortButtonText: {
        fontSize: 12,
        color: '#b45309',
        fontWeight: '600',
        textAlign: 'center',
    },
    sortButtonTextActive: {
        color: '#EADDCA',
    },
    listItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#b45309',
    },
    listExampleText: {
        color: '#b45309',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listHeaderText: {
        color: '#b45309',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
        paddingBottom: 10,
    },
    listItem: {
        fontSize: 13,
        fontWeight: '600',
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingEnd: 15,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '400',
        color: '#d97706',
        textAlign: 'center',
        paddingVertical: 5,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#fef3c7',
    },
    amountDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: '#CBC3E3',
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
        alignSelf: 'center',
        paddingTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#b45309',
        marginBottom: 8,
    },
    subtitle: {
        alignItems: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#d97706',
        textAlign: 'center',
        paddingBottom: 10,
    },
});

export default List;

