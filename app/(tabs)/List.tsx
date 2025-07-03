import { ListItem, UseItems } from '@/app/context/ItemContext';
import AppWrapper from "@/components/appwrapper";
import AppButton from "@/components/button";
import PantryForwardPopup from '@/components/itempopup';
import StoreForwardPopup from '@/components/storepopup';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useStyle } from '../context/styleContext';

function getBackgroundColor(activeStyle: string): string {
    return activeStyle === 'dark' ? 'dark' : 'light';
}

const List = () => {
    const router = useRouter();
    const { initialList, showStorePopup } = useLocalSearchParams();
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
    const [store, setStore] = React.useState('All');

    React.useEffect(() => {
            setIsStorePopupVisible(showStorePopup === 'true');
        }, [showStorePopup]);

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

    const handleMergeItems = () => {
        router.push({
            pathname: '/merge_items',
            params: { mergedItemsList: JSON.stringify(selectedMergeItems), listType: activeList }
        })
        setSelectedMergeItems([])
    }

    const handleDecrement = async (item: { id: string; name: string; amount: string }) => {
        const newAmount = Math.max(0, parseInt(item.amount) - 1);
        
        if (newAmount === 0) {
            await deleteItem(item)
        } else {
            if (activeList === 'first') {
                await removeSinglePantryItem(item.id);
            } else {
                await removeSingleGroceryItem(item.id);
            }
        }
    };

    const deleteItem = async (item: { id: string; name: string; amount: string }) => {
            setSelectedItem(item);
            setIsPopupVisible(true);
    }

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

    const {
        activeStyle
    } = useStyle();

    const styles = getStyles(activeStyle);

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
        if (!store || store.toLowerCase() === 'all') {
            return items;
        }

        return items.filter(item => item.store === store);
    }

    const filteredItems = React.useMemo(() => filterItemsByStore(store, sortedItems), [store, sortedItems]);

    const handleShareList = (activeList: string) => {
        if (activeList === 'first') {
            router.push({
                pathname: '/share_list',
                params: { includePantry: 'true', includeGrocery: 'false' },
            });
        } else {
            router.push({
                pathname: '/share_list',
                params: { includePantry: 'false', includeGrocery: 'true' },
            });
        }
    };


    return (
            <AppWrapper>
                <SafeAreaView style={{ flex: 1 }}>

                    <Text style={styles.title}>
                        List
                    </Text>

                    <View style={[styles.listItemContainer, {paddingBottom: '4%', width: '90%', alignSelf: 'center'}]}>
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
                            <View style={[styles.listItemContainer, mergeMode && selectedMergeItems.includes(item) ? { backgroundColor: '#ADD8E6', borderRadius: 12} : { backgroundColor: 'transparent' }]}>

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
                                                deleteItem(item)
                                                console.log(stores);
                                            }}
                                        />
                                    </View>
                                
                                </TouchableOpacity>

                            </View>
                        )}
                        ListHeaderComponent={
                            <View style={{gap: '10'}}>

                                <View>
                                    {activeList === 'first' &&
                                        <Text style={[styles.subtitle, {paddingTop: 4, paddingBottom: 0}]}>
                                            currently {pantryItems.length} items in your pantry list
                                        </Text>
                                    }
                                    {activeList === 'second' &&
                                        <Text style={[styles.subtitle, {paddingTop: 4, paddingBottom: 0}]}>
                                            currently {groceryItems.length} items in your grocery list
                                        </Text>
                                    }
                                </View>

                                {currentItems.length > 0 && (

                                <>
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
                        
                                <Text style={styles.listHeaderText}>
                                    {activeList === 'first' ? 'My Pantry' : 'Grocery List'}
                                </Text>

                                {activeList === 'second' && (
                                    <View>
                                        <View style={[styles.storeContainer]}>
                                            <TouchableOpacity
                                                onPress={() => {setIsStorePopupVisible(true)}}
                                                style={{backgroundColor: '#b45309', paddingVertical: '4%', borderRadius: 10, width: '85%', }}
                                            >
                                                <Text style={{fontFamily: 'sans-serif', fontSize: 14, textAlign: 'center', fontWeight: '800', color: '#EADDCA'}}>
                                                    Set Sorted Store
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                <View style={{alignItems: 'center', paddingBottom: 5}}>
                                    <AppButton
                                        text='Select Merge Items'
                                        onPress={() => {
                                            if (mergeMode) {
                                                setSelectedMergeItems([])
                                            }
                                            setMergeMode(!mergeMode)
                                        }}
                                        textColor='#EADDCA'
                                        isFullWidth={false}
                                        //@ts-ignore
                                        width='90%'
                                    />
                                </View>
                                </>

                                )}

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

                                
                            </View>
                        }
                        ListEmptyComponent={
                            <Text style={styles.emptyList}>
                                Add your first Item to get started
                            </Text>
                        }
                        ListFooterComponent={
                            <View style={{ paddingBottom: 10 }}>
                                    {mergeMode && selectedMergeItems.filter(selectedItem =>
                                        [...pantryItems, ...groceryItems].some(item => item.id === selectedItem.id)
                                    ).length > 1 && (
                                        <View style={{ alignItems: 'center', paddingTop: 5 }}>
                                            <AppButton
                                                text="Merge Items"
                                                textColor="#EADDCA"
                                                isFullWidth={false}
                                                //@ts-ignore
                                                width={'90%'}
                                                onPress={handleMergeItems}
                                            />
                                        </View>
                                    )}

                                    <View style={{ paddingTop: 8, alignItems: 'center' }}>
                                        {currentItems.length > 0 && (
                                            <AppButton
                                                text="Share this List"
                                                onPress={() => handleShareList(activeList)}
                                                isFullWidth={false}
                                                //@ts-ignore
                                                width={'90%'}
                                                textColor="#EADDCA"
                                            />
                                        )}
                                    </View>
                                </View>
                            }

                    />
                    <View style={[styles.buttonContainer, {paddingBottom: '15%'}]}>
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
                        onClose={() => setIsStorePopupVisible(false)}
                        onConfirm={(storeItem) => {
                            setStore(storeItem);
                            setIsStorePopupVisible(false)
                        }}
                    />
                </SafeAreaView>
            </AppWrapper>
    );
}

export const getStyles = (activeStyle: string) => {
    const isDark = activeStyle === 'dark';

    const backgroundMain = isDark ? '#333333' : '#fffaec';
    const backgroundAlt = isDark ? '#444444' : '#fef3c7';
    const textMain = isDark ? '#EADDCA' : '#b45309';
    const textSecondary = isDark ? '#F5DEB3' : '#d97706';

    return StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: backgroundMain,
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
            backgroundColor: backgroundMain,
            borderRadius: 15,
            padding: 16,
            marginVertical: 8,
            width: '90%',
            alignSelf: 'center',
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
        },
        sortButtonActive: {
            backgroundColor: textMain,
        },
        sortButtonText: {
            fontSize: 12,
            color: textMain,
            fontWeight: '600',
            textAlign: 'center',
        },
        sortButtonTextActive: {
            color: backgroundMain,
        },
        listItemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            width: '100%',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: textMain,
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
            color: textMain,
            fontSize: 16,
            fontWeight: '800',
            textAlign: 'center',
            paddingBottom: 10,
        },
        listItem: {
            color: textMain,
            flex: 2,
            fontSize: 11,
            fontWeight: '600',
            paddingRight: 4,
        },
        categoryLabel: {
            fontSize: 10,
            fontWeight: '400',
            color: textSecondary,
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
            backgroundColor: backgroundAlt,
        },
        plusMinusContainer: {
            flex: 0,
            flexDirection: 'row',
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
            borderColor: textMain,
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
            backgroundColor: backgroundAlt,
        },
        unitDropdownList: {
            position: 'absolute',
            width: '80%',
            top: 45,
            borderColor: textMain,
            backgroundColor: isDark ? '#222' : '#fff',
            zIndex: 5,
        },
        categorySmallContainer: {
            width: 30,
            borderRadius: 8,
            backgroundColor: backgroundAlt,
        },
        trashContainer: {
            alignItems: 'center',
            marginLeft: 4,
        },
        searchBar: {
            flexDirection: 'row',
            paddingVertical: '2%',
            backgroundColor: backgroundAlt,
            borderRadius: 25,
        },
        emptyList: {
            flex: 1,
            alignItems: 'center',
            top: '50%',
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: '700',
            fontSize: 20,
            color: textMain,
        },
        title: {
            alignSelf: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: textMain,
            marginBottom: 8,
        },
        subtitle: {
            alignItems: 'center',
            fontSize: 14,
            fontWeight: '600',
            color: textSecondary,
            textAlign: 'center',
            paddingBottom: 10,
        },
    });
};

export default List;