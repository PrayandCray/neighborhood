import { UseItems } from '@/app/context/ItemContext';
import AppWrapper from "@/components/appwrapper";
import AppButton from "@/components/button";
import PantryForwardPopup from '@/components/itempopup';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const List = () => {
    const router = useRouter();
    const { initialList } = useLocalSearchParams();
    const [activeList, setActiveList] = React.useState<'first' | 'second'>(
        initialList === 'second' ? 'second' : 'first'
    );
    const [sortByCategory, setSortByCategory] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [isPopupVisible, setIsPopupVisible] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<{id: string; name:string} | null>(null);

    const handleDecrement = async (item: { id: string; name: string; amount: string }) => {
        const newAmount = Math.max(0, parseInt(item.amount) - 1);
        
        if (newAmount === 0) {
            setSelectedItem(item);
            setIsPopupVisible(true);
        } else {
            if (activeList === 'first') {
                await removeSinglePantryItem(item.id);
            } else {
                await removeSingleGroceryItem(item.id);
            }
        }
    };

    const handleConfirmMove = async () => {
        if (selectedItem) {
            try {
                if (activeList === 'first') {
                    await removeFromPantry(selectedItem.id);
                } else {
                    if (activeList == 'second') {
                        const groceryItem = groceryItems.find(item => item.id === selectedItem.id);
                        if (groceryItem) {
                            await updateGroceryItem(selectedItem.id as string, {
                                ...groceryItem,
                                listType: 'first',
                            });
                        }
                        await removeFromGrocery(selectedItem.id);
                    }
                }
            } catch (error) {
                console.error('failed to remove item', error)
            }
        }
        setIsPopupVisible(false);
        setSelectedItem(null);
    };

    const {
        pantryItems,
        groceryItems,
        categories: itemCategories,
        stores,
        addStore,
        removeFromGrocery,
        removeFromPantry,
        removeSinglePantryItem,
        removeSingleGroceryItem,
        updateGroceryItem,
        addSinglePantryItem,
        addSingleGroceryItem,
    } = UseItems();

    const currentItems = activeList === 'first' ? pantryItems : groceryItems;

    const sortedItems = React.useMemo(() => {
        if (!sortByCategory) return currentItems;

        return [...currentItems].sort((a, b) => {
            const catA = itemCategories.find((cat: { value: string; label: string }) => cat.value === a.category)?.label;
            const catB = itemCategories.find((cat: { value: string; label: string }) => cat.value === b.category)?.label;

            if (catA === 'Other' && catB !== 'Other') return 1;
            if (catB === 'Other' && catA !== 'Other') return -1;

            return catA?.localeCompare(catB || '') || 0;
        });
    }, [sortByCategory, currentItems, itemCategories]);

    function filterItemsBySearch(input: string, items: typeof sortedItems) {
        if (!input) return items;
        return items.filter(item =>
            item.name.toLowerCase().includes(input.toLowerCase()),
        );
    }

    const searchItems = React.useMemo(() => filterItemsBySearch(search, sortedItems), [search, sortedItems]);


    return (
        <LinearGradient
            colors={['#E2E2E2', '#B39171', '#843F00']}
            locations={[0, 0.275, 1]}
            style={styles.container}>
            <AppWrapper>
                <SafeAreaView style={{ flex: 1, maxHeight:'100%' }}>

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
                                    web: 8,
                                }),
                                flexDirection: 'row',
                                paddingBottom: 2,
                            }}>
                                <Text style={[styles.listItem, {flex: 5, paddingTop: '4%', paddingLeft: '4%'}]}>
                                    Name
                                </Text>
                                <View style={{flexDirection: 'column', gap: 2, height: '100%'}}>
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
                                </View>
                                <View style={[styles.categoryContainer, {justifyContent: 'center'}]}>
                                    <Text style={[styles.categoryLabel, {color: "#4076cc"}]}>
                                        Edit
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'column', gap: 2, paddingRight: '5%'}}>
                                    <View style={styles.categorySmallContainer}>
                                        <Text style={[styles.categoryLabel, {color: "#4076cc"}]}>
                                            - 1
                                        </Text>
                                    </View>
                                    <View style={styles.categorySmallContainer}>
                                        <Text style={[styles.categoryLabel, {color: "#4076cc"}]}>
                                            + 1
                                        </Text>
                                    </View>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Ionicons
                                        name = 'trash-bin-outline'
                                        size = {20}
                                        color = "#b45309"
                                    />
                                </View>
                            </View>


                    </View>

                    <FlatList
                        style={styles.listContainer}
                        data={searchItems}
                        scrollEnabled={true}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={true}
                        persistentScrollbar={true}
                        renderItem={({item}) => (
                            <View style={styles.listItemContainer}>

                                <View style={styles.itemContentContainer}>

                                    <Text style={styles.listItem} numberOfLines={1}>{item.name}</Text>

                                    {activeList === 'second' && (
                                        <Text style={[styles.categoryLabel, styles.categoryContainer, {paddingVertical: '4%'}]} numberOfLines={1}>{item.store}</Text>
                                    )}

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
                                    <View>
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
                                            borderColor="#fef3c7"
                                        />
                                    </View>
                                    
                                    <View style={[styles.plusMinusContainer, {flexDirection: 'column'}]}>
                                        <View style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30,}]}>
                                            <TouchableOpacity
                                                onPress={() => handleDecrement({
                                                    id: item.id,
                                                    name: item.name,
                                                    amount: item.amount
                                                })
                                            }
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[styles.categoryLabel, {color: "#4076cc"}]}>
                                                    -1
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30,}]}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (activeList === 'first') {
                                                        addSinglePantryItem(item.id)
                                                    } else {
                                                        addSingleGroceryItem(item.id)
                                                    }
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[styles.categoryLabel, {color: "#4076cc"}]}>
                                                    +1
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                    <View style={styles.trashContainer}>
                                            <Ionicons
                                                name = 'trash-bin-outline'
                                                size = {20}
                                                color = "#b45309"
                                                onPress={() => {
                                                    if (activeList === 'first') {
                                                        removeFromPantry(item.id);
                                                    } else {
                                                        removeFromGrocery(item.id);
                                                    }
                                                }}
                                            />
                                    </View>

                                </View>

                            </View>
                        )}
                        ListHeaderComponent={
                            <View style={{gap: '10'}}>
                                <View style={styles.searchBar}>
                                    <Ionicons
                                        style={{paddingLeft: '2%'}}
                                        name='search'
                                        size={20}
                                        color="#b45309"
                                    />
                                    <TextInput
                                        style={{paddingLeft: '3%', color: '#b45309', width: '100%'}}
                                        placeholder='Search'
                                        placeholderTextColor='#b45309'
                                        value={search}
                                        onChangeText={(text) => {
                                            setSearch(text);
                                        }}
                                    />
                                </View>
                                <View style={[styles.buttonContainer, {paddingBottom: '0.5%'}]}>
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
                                <Text style={styles.listHeaderText}>
                                    {activeList === 'first' ? 'My Pantry' : 'Grocery List'}
                                </Text>
                            </View>
                        }
                        ListEmptyComponent={
                            <Text style={styles.emptyList}>
                                No Items Found
                            </Text>
                        }
                    />
                    <View style={styles.buttonContainer}>
                        <AppButton
                            text="Scan Items"
                            onPress={() => router.push({ pathname: '/scan' })}
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
                    <PantryForwardPopup
                        isVisible={isPopupVisible}
                        onClose={() => setIsPopupVisible(false)}
                        onConfirm={handleConfirmMove}
                        itemName={selectedItem?.name}
                        itemId={selectedItem?.id}
                        listType={activeList}
                    />
                </SafeAreaView>
            </AppWrapper>
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
        paddingBottom: Platform.select({
            web: 16,
            default: 80,
        }),
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
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',
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
        marginLeft: Platform.select({
            web: 16,
            default: 0,
        }),
        marginRight: Platform.select({
            web: 16,
            default: 0,
        }),
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
    searchBar: {
        flexDirection: 'row',
        paddingVertical: 8,
        backgroundColor: '#fef3c7',
        borderRadius: 25
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