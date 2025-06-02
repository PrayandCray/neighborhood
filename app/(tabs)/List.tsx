import React, { useEffect } from 'react';
import {useRouter, useLocalSearchParams} from 'expo-router';
import AppButton from "@/components/button";
import {SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Platform} from 'react-native';
import { UseItems } from '../context/ItemContext';
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
        unitOptions: itemUnits,
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
    }, [sortByCategory, currentItems, itemCategories]);

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

                <View style={styles.listItemContainer}>
                        <View style={{
                            gap: Platform.select({
                                ios: 8,
                                android: 4,
                            }),
                            flexDirection: 'row',
                            paddingBottom: 2,
                        }}>
                            <Text style={[styles.listItem, {flex: 5}]}>
                                Name
                            </Text>
                            <View style={styles.categoryContainer}>
                                <Text style={styles.categoryLabel}>
                                    Amt.
                                </Text>
                            </View>
                            <View style={styles.categoryContainer}>
                                <Text style={styles.categoryLabel}>
                                    Category
                                </Text>
                            </View>
                            <View style={styles.categoryContainer}>
                                <Text style={[styles.categoryLabel, {color: "#4076cc"}]}>
                                    Edit
                                </Text>
                            </View>
                            <View style={styles.categorySmallContainer}>
                                <Text style={[styles.categoryLabel, {color: "#b45309"}]}>
                                    - 1
                                </Text>
                            </View>
                            <View style={styles.categorySmallContainer}>
                                <Text style={[styles.categoryLabel, {color: "#b45309"}]}>
                                    + 1
                                </Text>
                            </View>
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

                            <View style={styles.itemContentContainer}>

                                <Text style={styles.listItem} numberOfLines={1}>{item.name}</Text>
                                <View style={{flexDirection: 'column', gap: 4, alignItems: 'center'}}>
                                    <Text style={[styles.categoryContainer, styles.categoryLabel]} numberOfLines={1}>
                                        {`${item.amount || '1'} ${item.unit || 'count'}`}
                                    </Text>
                                    {item.category && (
                                        <View style={styles.categoryContainer}>
                                            <Text style={styles.categoryLabel} numberOfLines={1}>
                                                {itemCategories.find(cat => cat.value === item.category)?.label || 'Other'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View style={[styles.categoryContainer, {alignSelf: 'center'}]}>
                                    <AppButton
                                        text="Edit"
                                        isFullWidth={true}
                                        fontSize={10}
                                        fontWeight="normal"
                                        backgroundColor="#fef3c7"
                                        onPress={() => router.push({
                                            pathname: '/edit',
                                            params: {
                                                itemId: item.id,
                                                listType: activeList === 'first' ? 'pantry' : 'grocery'
                                            }
                                        })}
                                        textColor="#4076cc"
                                        borderColor="#b45309"
                                    />
                                </View>
                                <View style={[styles.plusMinusContainer, {flexDirection: 'column'}]}>
                                    <View style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30,}]}>
                                        <TouchableOpacity
                                            onPress={() => removeItem(item.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.categoryLabel, {color: "#b45309"}]}>
                                                -1
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30,}]}>
                                        <TouchableOpacity
                                            onPress={() => removeItem(item.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.categoryLabel, {color: "#b45309"}]}>
                                                +1
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>

                        </View>
                    )}
                    ListHeaderComponent={
                        <View>
                            <View style={[styles.buttonContainer, {paddingBottom: 5}]}>
                                <AppButton
                                    text="My Pantry"
                                    onPress={() => setActiveList('first')}
                                    width={120}
                                    fontSize={12}
                                    borderPadding={10}
                                    borderColor={activeList === 'first' ? '#fff' : '#b45309'}
                                    textColor={'#EADDCA'}/>
                                <AppButton
                                    text='Grocery List'
                                    onPress={() => setActiveList('second')}
                                    width={120}
                                    fontSize={12}
                                    borderPadding={10}
                                    borderColor={activeList === 'second' ? '#fff' : '#b45309'}
                                    textColor={'#EADDCA'}/>
                            </View>
                            <Text style={[styles.listHeaderText, {paddingTop: 16}]}>
                                {activeList === 'first' ? 'My Pantry' : 'Grocery List'}
                            </Text>
                        </View>
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
        alignItems: 'center',
        width: '100%',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#b45309',
    },
    itemContentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    listHeaderText: {
        color: '#b45309',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
        paddingBottom: 10,
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
        width: 32,
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

