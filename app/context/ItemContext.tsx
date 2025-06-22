import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export type ListItem = {
    id: string;
    name: string;
    category: string;
    amount: string;
    unit: string;
    store: string;
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
    addToPantry: (item: ListItem) => Promise<void>;
    addToGrocery: (item: ListItem) => Promise<void>;
    removeFromPantry: (id: string) => Promise<void>;
    removeFromGrocery: (id: string) => Promise<void>;
    removeSinglePantryItem: (id: string) => Promise<void>;
    removeSingleGroceryItem: (id: string) => Promise<void>;
    addSinglePantryItem: (id: string) => Promise<void>;
    addSingleGroceryItem: (id: string) => Promise<void>;
    updatePantryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string; store?: string; listType?: string}) => Promise<void>;
    updateGroceryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string; store?: string; listType?: string}) => Promise<void>;
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
        setPantryItems(pantry ? JSON.parse(pantry) : []);
        setGroceryItems(grocery ? JSON.parse(grocery) : []);
        setStores(storeList ? JSON.parse(storeList) : []);
    } catch (err) {
        setError(err as Error);
    }
    setIsLoading(false);
    };

    const updatePantryItem = async (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => {
        setPantryItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const updateGroceryItem = async (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => {
        setGroceryItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const addToPantry = async (item: ListItem) => {
        const duplicate = pantryItems.find(existingItem =>
            existingItem.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        if (duplicate) {
            duplicate.amount = (parseInt(duplicate.amount) +1). toString();
        } else{
            setPantryItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
        }

    };

    const addToGrocery = async (item: ListItem) => {
        const duplicate = groceryItems.find(existingItem =>
            existingItem.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        const pantryDuplicate = pantryItems.find(existingItem =>
            existingItem.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        if (duplicate) {
            duplicate.amount = (parseInt(duplicate.amount) +1). toString();
        } else {
            if (pantryDuplicate) {
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
                    ]
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

    const addSinglePantryItem = async (id: string): Promise<void> => {
        setPantryItems(prev => prev.map(item =>{
            if (item.id === id) {
                const newAmount = Math.max(0, parseInt(item.amount) + 1);
                if (newAmount === 0) {
                    return item;
                }
                return { ...item, amount: newAmount.toString() };
            }
            return item;
        }));
    };

    const addSingleGroceryItem = async (id: string): Promise<void> => {
        setGroceryItems(prev => prev.map(item => {
            if (item.id === id) {
                const newAmount = Math.max(0, parseInt(item.amount) + 1);
                if (newAmount === 0) {
                    return item;
                }
                return { ...item, amount: newAmount.toString() };
            }
            return item;
        }));
    };
    
    return (
        <ItemContext.Provider value={{
            pantryItems,
            groceryItems,
            categories,
            unitOptions,
            stores,
            addStore,
            updateStore,
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
            isLoading,
            error,
            isAuthenticated,
        }}>
            {children}
        </ItemContext.Provider>
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