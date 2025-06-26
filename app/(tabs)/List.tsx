import { ListItem, UseItems } from '@/app/context/ItemContext';
import AppWrapper from "@/components/appwrapper";
import AppButton from "@/components/button";
import PantryForwardPopup from '@/components/itempopup';
import StoreForwardPopup from '@/components/storepopup';
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
    const [mergeMode, setMergeMode] = React.useState(false)
    const [isPopupVisible, setIsPopupVisible] = React.useState(false);
    const [isStorePopupVisible, setIsStorePopupVisible] = React.useState(false);
    const [selectedMergeItems, setSelectedMergeItems] = React.useState<ListItem[]>([]);
    const [selectedItem, setSelectedItem] = React.useState<{id: string; name:string} | null>(null);
    const [store, setStore] = React.useState('General');

    const toggleItemSelection = (item: ListItem) => {
    setSelectedMergeItems(prev =>
        prev.some(i => i.id === item.id)
            ? prev.filter(i => i.id !== item.id)
            : [...prev, item]
    );
};

    const openItem = (item: ListItem) => {
        router.push({
            pathname: '/edit',
            params: {
                itemId: item.id,
                listType: activeList === 'first' ? 'pantry' : 'grocery'
            }
        })
    }

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

    function filterItemsByStore(store: string, items: typeof sortedItems) {
        if (!store || store === 'General') return items;
        return items.filter(item => item.store === store);
    }
    const filteredItems = React.useMemo(() => filterItemsByStore(store, sortedItems), [store, sortedItems]);


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

                    <View style={[styles.listItemContainer, {paddingBottom: '4%'}]}>
                            <View style={{
                                gap: Platform.select({
                                    ios: 8,
                                    android: 4,
                                    web: 8,
                                }),
                                flexDirection: 'row',
                                paddingBottom: 2,
                            }}>
                                <View style={{top: '10%'}}>
                                    <Ionicons
                                        style={{ justifyContent: 'center', paddingTop: '5%', paddingLeft: '2%'}}
                                        name='pencil'
                                        size={15}
                                    />
                                </View>
                                <Text style={[styles.listItem, {flex: 5, top: '50%', paddingLeft: '4%'}]}>
                                    Name
                                </Text>
                                {activeList === 'second' && (
                                    <View style={[styles.categoryContainer, {marginTop: '3.7%'}]}>
                                        <Text style={styles.categoryLabel}>
                                            Store
                                        </Text>
                                    </View>
                                )}
                                
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
                                <View style={[styles.plusMinusContainer, {alignSelf: 'center', width: 35, height: 40, gap: 2, flexDirection: 'column'}]}>
                                    <View style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30, paddingVertical: 5 }]}>
                                        <Text style={[styles.categoryLabel, {color: "#4076cc"}]} numberOfLines={1}>
                                            - 1
                                        </Text>
                                    </View>
                                    <View style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30, paddingVertical: 5 }]}>
                                        <Text style={[styles.categoryLabel, {color: "#4076cc"}]} numberOfLines={1}>
                                            + 1
                                        </Text>
                                    </View>
                                </View>
                                <View style={{justifyContent: 'center', paddingRight: 8}}>
                                    <Ionicons
                                        name = 'trash-bin-outline'
                                        size = {25}
                                        color = "#b45309"
                                    />
                                </View>
                            </View>
                    </View>
                    
                    <FlatList
                        style={styles.listContainer}
                        data={filterItemsBySearch(search, filteredItems)}
                        scrollEnabled={true}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={true}
                        persistentScrollbar={true}
                        renderItem={({item}) => (
                            <View style={styles.listItemContainer}>

                                <TouchableOpacity
                                    style={styles.itemContentContainer}
                                    onPress={() => mergeMode ? toggleItemSelection(item) : openItem(item)}>

                                        <Ionicons 
                                            name={mergeMode
                                                ?   (selectedMergeItems.includes(item) 
                                                        ? 'checkmark-circle-outline' 
                                                        : 'ellipse-outline')
                                                :   'pencil'
                                            } 
                                            style={{
                                                backgroundColor: mergeMode && selectedMergeItems.includes(item) ? '#ADD8E6' : 'transparent',
                                                padding: '2%',
                                                borderRadius: 5
                                            }} 
                                        />
                                        <Text style={styles.listItem} numberOfLines={1}>{item.name}</Text>

                                        {activeList === 'second' && (
                                            <View style={styles.categoryContainer}>
                                            <Text style={[styles.categoryLabel]} numberOfLines={1}>{item.store}</Text>
                                            </View>
                                        )}

                                    <View style={{flexDirection: 'column', gap: 4, alignItems: 'center'}}>
                                        <View style={styles.categoryContainer}>
                                            <Text style={styles.categoryLabel} numberOfLines={1}>
                                                {`${item.amount || '1'} ${item.unit || 'count'}`}
                                            </Text>
                                        </View>

                                        {item.category && (
                                            <View style={styles.categoryContainer}>
                                                <Text style={styles.categoryLabel} numberOfLines={1}>
                                                    {itemCategories.find(cat => cat.value === item.category)?.label || 'Other'}
                                                </Text>
                                            </View>
                                        )}

                                    </View>
                                    
                                    <View style={[styles.plusMinusContainer, {flexDirection: 'column'}]}>
                                        <TouchableOpacity
                                            style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30, padding: 5,}]}
                                            onPress={() => handleDecrement({
                                                id: item.id,
                                                name: item.name,
                                                amount: item.amount
                                            })
                                        }
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[styles.categoryLabel, {color: "#4076cc",}]}>
                                                -1
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.categorySmallContainer, {alignSelf: 'center', width: 30, padding: 5,}]}
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

                                    <View style={styles.trashContainer}>
                                        <Ionicons
                                            name='trash-bin-outline'
                                            size={25}
                                            color="#b45309"
                                            onPress={() => {
                                                if (activeList === 'first') {
                                                        removeFromPantry(item.id);
                                                    } else {
                                                        removeFromGrocery(item.id);
                                                    }
                                                console.log(stores);
                                            }}
                                        />
                                    </View>
                                
                                </TouchableOpacity>

                            </View>
                        )}
                        ListHeaderComponent={
                            <View style={{gap: '10'}}>

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

                                <View style={styles.searchBar}>
                                    <Ionicons
                                        style={{paddingLeft: '3%', alignSelf: 'center'}}
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
                                {activeList === 'second' && (
                                <View>
                                    <Text style={[styles.subtitle, {color: '#b45309', paddingHorizontal: 10, paddingBottom: 10}]}>
                                        Sort by store
                                    </Text>
                                    <View style={[styles.storeContainer]}>
                                        <View style={{ 
                                                width: '50%', 
                                                flexDirection: 'row',
                                                alignSelf: 'center',
                                                marginBottom: Platform.select({
                                                    web: '2%',
                                                }), 
                                                gap: '2%',
                                                height: '145%',
                                                paddingVertical: 10,
                                                justifyContent: 'center',
                                            }}>
                                            <TouchableOpacity
                                                onPress={() => {router.push('/new_store')}}
                                                style={{backgroundColor: '#b45309', paddingVertical: '3%', borderRadius: 10, width: '50%'}}
                                            >
                                                <Text style={{fontFamily: 'sans-serif', fontSize: 14, textAlign: 'center', top: '20%', fontWeight: '500', color: '#EADDCA'}}>
                                                    + Store
                                                </Text>
                                            </TouchableOpacity>
                                        
                                            <TouchableOpacity
                                                onPress={() => {router.push('/delete_store')}}
                                                style={{backgroundColor: '#b45309', paddingVertical: '3%', borderRadius: 10, width: '50%'}}
                                            >
                                                <Text style={{fontFamily: 'sans-serif', fontSize: 14, textAlign: 'center', top: '20%', fontWeight: '500', color: '#EADDCA'}}>
                                                    - Store
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {setIsStorePopupVisible(true)}}
                                            style={{backgroundColor: '#b45309', paddingVertical: '4%', borderRadius: 10, width: '50%', }}
                                        >
                                            <Text style={{fontFamily: 'sans-serif', fontSize: 14, textAlign: 'center', fontWeight: '500', color: '#EADDCA'}}>
                                                Set Sorted Store
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                )}
                                <Text style={styles.listHeaderText}>
                                    {activeList === 'first' ? 'My Pantry' : 'Grocery List'}
                                </Text>
                                <View style={{alignItems: 'center', paddingBottom: 5}}>
                                    <AppButton
                                        text='Select Merge Items'
                                        onPress={() => setMergeMode(mergeMode === false ? true : false)}
                                        textColor='#EADDCA'
                                        isFullWidth={false}
                                        //@ts-ignore
                                        width='90%'
                                    />
                                </View>
                            </View>
                        }
                        ListEmptyComponent={
                            <Text style={styles.emptyList}>
                                No Items Found
                            </Text>
                        }
                        ListFooterComponent={
                            <View style={{paddingBottom: 10}}>
                                {mergeMode && 
                                    <View style={{alignItems: 'center', paddingTop: 5}}>
                                        <AppButton
                                            text='Merge Items'
                                            textColor='#EADDCA'
                                            isFullWidth={false}
                                            //@ts-ignore
                                            width={'90%'}
                                            onPress={() =>
                                                router.push({
                                                    pathname: '/merge_items',
                                                    params: { mergedItemsList: JSON.stringify(selectedMergeItems), listType: activeList}
                                                })
                                            }
                                        />
                                    </View>
                                }
                            </View>
                        }
                    />
                    <View style={styles.buttonContainer}>
                        <AppButton
                            text="Scan Items"
                            onPress={() => router.push({
                                pathname: '/scan',
                                params: {listType: activeList === 'first' ? 'pantry' : 'grocery'}
                            })}
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
                    <StoreForwardPopup
                        isVisible={isStorePopupVisible}
                        stores={stores}
                        onClose={() => setIsStorePopupVisible(false)}
                        onConfirm={(storeItem) => {
                            setStore(storeItem);
                            setIsStorePopupVisible(false)
                        }}
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
        paddingVertical: 2,
        paddingHorizontal: 3,

    },
    categoryContainer: {
        flex: 1,
        minWidth: 60,
        maxWidth: 70,
        minHeight: 30,
        maxHeight: 35,
        justifyContent: 'center',
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
    storeContainer: {
        marginBottom: '1%',
        position: 'relative',
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        gap: 10,
        zIndex: 1,
        marginTop: 10,
        height: 45,   
    },
    unitDropdown: {
        flex: 1,
        height: 40,
        borderColor: '#b45309',
        borderRadius: 10,
        backgroundColor: 'transparent',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    storeDropdownStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderRadius: 8,
        backgroundColor: '#fef3c7',
    },
    unitDropdownList: {
        position: 'absolute',
        width: '80%',
        top: 45,
        borderColor: '#b45309',
        backgroundColor: '#fff',
        zIndex: 5,
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
        paddingVertical: '2%',
        backgroundColor: '#fef3c7',
        borderRadius: 25
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        top: '25%',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 20,
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