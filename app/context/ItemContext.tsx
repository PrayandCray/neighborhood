import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from 'react-native';
import { StyleProvider } from './styleContext';

export type ListItem = {
    id: string;
    name: string;
    category: string;
    amount: string;
    unit: string;
    store: string;
    photo?: string;
};

export type Store = {
    label: string;
    value: string;
};

type ItemContextType = {
    pantryItems: ListItem[];
    groceryItems: ListItem[];
    categories: { label: string; value: string }[];
    unitOptions: { key: string; value: string }[];
    stores: Store[];
    isLoading: boolean;
    error: Error | null;
    isAuthenticated: boolean;
    fetchItems: () => Promise<void>;
    addStore: (storeName: string) => Promise<void>;
    updateStore: (storeId: string, updates: { label?: string; value?: string }) => Promise<void>;
    deleteStore: (storeId: string) => Promise<void>
    addToPantry: (item: ListItem) => Promise<void>;
    addToGrocery: (item: ListItem) => Promise<void>;
    removeFromPantry: (id: string) => Promise<void>;
    removeFromGrocery: (id: string) => Promise<void>;
    removeSinglePantryItem: (id: string) => Promise<void>;
    removeSingleGroceryItem: (id: string) => Promise<void>;
    addSinglePantryItem: (id: string, givenAmount?: number) => Promise<void>;
    addSingleGroceryItem: (id: string, givenAmount?: number) => Promise<void>;
    updatePantryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string; store?: string; listType?: string}) => Promise<void>;
    updateGroceryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string; store?: string; listType?: string}) => Promise<void>;
    resetData: () => Promise<void>;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

const PANTRY_KEY = 'pantryItems';
const GROCERY_KEY = 'groceryItems';
const STORES_KEY = 'stores'

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
    const [pantryItems, setPantryItems] = useState<ListItem[]>([]);
    const [groceryItems, setGroceryItems] = useState<ListItem[]>([]);
    const [stores, setStores] = useState<Store[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true)

    const categories = [
        {label: 'Other', value: 'other' },
        { label: 'Fruits', value: 'fruits' },
        { label: 'Vegetables', value: 'vegetables' },
        { label: 'Dairy', value: 'dairy' },
        { label: 'Meat', value: 'meat' },
        { label: 'Grains', value: 'grains' },
        { label: 'Snacks', value: 'snacks' },
        { label: 'Beverages', value: 'beverages' },
    ];

    const unitOptions = [
        { key: 'count', value: 'count' },
        { key: 'g', value: 'g' },
        { key: 'kg', value: 'kg' },
        { key: 'L', value: 'L' },
        { key: 'ml', value: 'ml' },
        { key: 'lb', value: 'lb' },
        { key: 'oz', value: 'oz' },
    ];


    //save changes to async

    useEffect(() => {
        fetchItems().then(() => setHasLoaded(true));
    }, []);

    useEffect(() => {
        if (hasLoaded) {
        AsyncStorage.setItem(PANTRY_KEY, JSON.stringify(pantryItems))
        }
    }, [pantryItems])
    useEffect(() => {
        if (hasLoaded) {
            AsyncStorage.setItem(GROCERY_KEY, JSON.stringify(groceryItems))
        }
    }, [groceryItems])
    useEffect(() => {
        if (hasLoaded) {
            AsyncStorage.setItem(STORES_KEY, JSON.stringify(stores))
        }
    }, [stores])

    

    const fetchItems = async () => {
    setIsLoading(true);
    try {
        const [pantry, grocery, storeList] = await Promise.all([
            AsyncStorage.getItem(PANTRY_KEY),
            AsyncStorage.getItem(GROCERY_KEY),
            AsyncStorage.getItem(STORES_KEY),
        ]);

        // add a general store at beginning
        if(storeList) {
            const parsedStores = JSON.parse(storeList);
            setStores(parsedStores.length > 0 ? parsedStores : [{ label: 'General', value: 'general' }])
            console.log(stores)
        } else {
            setStores(storeList ? JSON.parse(storeList) : []);
        }

        setPantryItems(pantry ? JSON.parse(pantry) : []);
        setGroceryItems(grocery ? JSON.parse(grocery) : []);
        
    } catch (err) {
        setError(err as Error);
    }
    setIsLoading(false);
    };

    const updatePantryItem = async (id: string, updates: { name?: string; amount?: string; unit: string; category?: string, store?: string, listType?: string }) => {
        setPantryItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
        console.log(id, updates)
    };

    const updateGroceryItem = async (id: string, updates: { name?: string; amount?: string; unit: string; category?: string, store?: string, listType?: string }) => {
        setGroceryItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const addToPantry = async (item: ListItem,) => {
        const duplicate = pantryItems.find(existingItem =>
            existingItem.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        if (duplicate) {
            const itemAmount = (parseInt(item.amount))
            duplicate.amount = (parseInt(duplicate.amount) + itemAmount). toString();
        } else{
            setPantryItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
        }

    };

    const addToGrocery = async (item: ListItem, dontAsk?: boolean ) => {
        const duplicate = groceryItems.find(existingItem =>
            existingItem.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        const pantryDuplicate = pantryItems.find(existingItem =>
            existingItem.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        if (duplicate) {
            const itemAmount = (parseInt(item.amount))
            duplicate.amount = (parseInt(duplicate.amount) + itemAmount). toString();
        } else {
            if (pantryDuplicate && dontAsk) {
                Alert.alert(
                    'Already in pantry',
                    `${item.name} is already in your pantry.`,
                    [
                        {
                            text: 'Add anyway',
                            onPress: () => setGroceryItems(prev => [...prev, { ...item, id: Date.now().toString() }])
                        },
                        { 
                            text: 'Cancel', 
                            style: 'cancel',
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                setGroceryItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
            }
        }
    };

    const removeFromPantry = async (id: string) => {
        setPantryItems(prev => prev.filter(item => item.id !== id));
    };

    const removeFromGrocery = async (id: string) => {
        setGroceryItems(prev => prev.filter(item => item.id !== id));
    };

    const addStore = async (storeName: string) => {
        const storeValue = storeName.toLowerCase().replace(/\s+/g, '');
        if (stores.some(store => store.value === storeValue)) {
            setError(new Error('Store already exists!'));
            return;
        }
        setStores(prev => [...prev, { label: storeName, value: storeValue }]);
    };

    const updateStore = async (storeId: string, updates: { label?: string; value?: string }) => {
        setStores(prev =>
            prev.map(store =>
                store.value === storeId ? { ...store, ...updates} : store
            )
        );
    };

    const deleteStore = async (storeId: string) => {
        console.log(storeId)
        if (storeId === 'general') {
            Alert.alert('Failed to delete Store', 'The General store cannot be deleted.');
            return;
        } else {
            setStores(prev => {
                const updatedStores = prev.filter(store => store.value !== storeId);
                console.log(`Deleted store from context ${storeId}`)
                return updatedStores;
            });
            setPantryItems(prev => prev.map(item => {
                if (item.store === storeId) {
                    return { ...item, storeId: 'general' };
                } else {
                    return item;
                }
            }))
        }
    }

    const removeSinglePantryItem = async (id: string): Promise<void> => {
        setPantryItems(prev => prev.map(item =>{
            if (item.id === id) {
                const newAmount = Math.max(0, parseInt(item.amount) - 1);
                if (newAmount === 0) {
                    return item;
                }
                return { ...item, amount: newAmount.toString() };
            }
            return item;
        }));
    };

    const removeSingleGroceryItem = async (id: string): Promise<void> => {
        setGroceryItems(prev => prev.map(item => {
            if (item.id === id) {
                const newAmount = Math.max(0, parseInt(item.amount) - 1);
                if (newAmount === 0) {
                    return item;
                }
                return { ...item, amount: newAmount.toString() };
            }
            return item;
        }));
    };

    const addSinglePantryItem = async (id: string, givenAmount?: number): Promise<void> => {
        setPantryItems(prev => prev.map(item =>{
            if (item.id === id) {
                const amountToAdd = typeof givenAmount === 'number' ? givenAmount : 1
                const newAmount = Math.max(0, parseInt(item.amount) + amountToAdd);
                return { ...item, amount: newAmount.toString() };
            }
            return item;
        }));
    };

    const addSingleGroceryItem = async (id: string, givenAmount?: number): Promise<void> => {
        setGroceryItems(prev => prev.map(item => {
            if (item.id === id) {
                const amountToAdd = typeof givenAmount === 'number' ? givenAmount : 1
                const newAmount = Math.max(0, parseInt(item.amount) + 1);
                return { ...item, amount: newAmount.toString() };
            }
            return item;
        }));
    };

    const resetData = async (): Promise<void> => {
        return new Promise((resolve) => {
            Alert.alert(
                'Reset all data',
                'Are you sure you want to do this?',
                [
                  {text: 'Cancel', onPress: () => { console.log('Cancel Pressed'); resolve(); }, style: 'cancel'},
                  { 
                    text: 'OK', 
                    onPress: async () => {
                      await AsyncStorage.multiRemove([PANTRY_KEY, GROCERY_KEY, STORES_KEY]);
                      setPantryItems([]);
                      setGroceryItems([]);
                      setStores([{ label: 'General', value: 'general' }]);
                      resolve();
                    }
                  },
                ],
                {cancelable: true}
            );
        });
    };
    
    return (
        <StyleProvider>
            <ItemContext.Provider value={{
                pantryItems,
                groceryItems,
                categories,
                unitOptions,
                stores,
                addStore,
                updateStore,
                deleteStore,
                fetchItems,
                addToPantry,
                addToGrocery,
                removeFromPantry,
                removeFromGrocery,
                removeSinglePantryItem,
                removeSingleGroceryItem,
                addSinglePantryItem,
                addSingleGroceryItem,
                updatePantryItem,
                updateGroceryItem,
                resetData,
                isLoading,
                error,
                isAuthenticated,
            }}>
                {children}
            </ItemContext.Provider>
        </StyleProvider>
    );
};

export const UseItems = () => {
    const context = useContext(ItemContext);
    if (context === undefined) {
        throw new Error('UseItems must be used within a ItemProvider');
    }
    return context;
}

export default ItemContext;