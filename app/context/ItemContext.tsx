import React, { createContext, useContext, useState, } from 'react';

type ListItem = {
    id: string;
    name: string;
    category: string;
    amount: string;
    unit: string;
};

type ItemContextType = {
    pantryItems: ListItem[];
    groceryItems: ListItem[];
    categories: { label: string; value: string }[];
    unitOptions: { key: string; value: string }[];
    addToPantry: (itemName: { amount: string; category: string; name: string }) => void;
    addToGrocery: (itemName: { amount: string; category: string; name: string }) => void;
    removeFromPantry: (id: string) => void;
    removeFromGrocery: (id: string) => void;
    updatePantryItem: (id: string, updates: { amount: string; category: string; name: string }) => void;
    updateGroceryItem: (id: string, updates: { amount: string; category: string; name: string }) => void;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined)

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
    const [pantryItems, setPantryItems] = useState<ListItem[]>([]);
    const [groceryItems, setGroceryItems] = useState<ListItem[]>([]);

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

    const updatePantryItem = (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => {
        setPantryItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };

    const updateGroceryItem = (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => {
        setGroceryItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ));
    };


    const addToPantry = (item: { name : string; category : string; amount : string, unit: string}) => {
        setPantryItems(prev=> [...prev, {
            id: Date.now().toString(),
            name: item.name,
            category: item.category,
            amount: item.amount,
            unit: item.unit
        }]);
    };

    const addToGrocery = (item: { name : string; category : string; amount : string, unit: string}) => {
        setGroceryItems(prev=> [...prev, {
            id: Date.now().toString(),
            name: item.name,
            category: item.category,
            amount: item.amount,
            unit: item.unit
        }]);
    };



    const removeFromPantry = (id: string) => {
        setPantryItems(prev=> prev.filter(item => item.id !== id));
    }

    const removeFromGrocery = (id: string) => {
        setGroceryItems(prev=> prev.filter(item => item.id !== id));
    }

    return (
        <ItemContext.Provider value={{
            pantryItems,
            groceryItems,
            categories,
            unitOptions,
            addToPantry,
            addToGrocery,
            removeFromPantry,
            removeFromGrocery,
            updatePantryItem,
            updateGroceryItem,
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