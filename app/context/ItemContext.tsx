import React, { createContext, useContext, useState, } from 'react';

type ListItem = {
    id: string;
    name: string;
    category: string;
    amount: string;
};

type ItemContextType = {
    pantryItems: ListItem[];
    groceryItems: ListItem[];
    categories: { label: string; value: string }[];
    addToPantry: (itemName: { name: string; category: string, amount: string }) => void;
    addToGrocery: (itemName: { name: string; category: string, amount: string }) => void;
    removeFromPantry: (id: string) => void;
    removeFromGrocery: (id: string) => void;
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

    const addToPantry = (item: { name : string; category : string; amount : string}) => {
        setPantryItems(prev=> [...prev, {
            id: Date.now().toString(),
            name: item.name,
            category: item.category,
            amount: item.amount
        }]);
    };

    const addToGrocery = (item: { name : string; category : string; amount : string}) => {
        setGroceryItems(prev=> [...prev, {
            id: Date.now().toString(),
            name: item.name,
            category: item.category,
            amount: item.amount
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
            addToPantry,
            addToGrocery,
            removeFromPantry,
            removeFromGrocery,
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