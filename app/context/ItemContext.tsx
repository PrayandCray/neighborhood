import React, { createContext, useContext, useState, } from 'react';

type ListItem = {
    id: string;
    name: string;
};

type ItemContextType = {
    pantryItems: ListItem[];
    groceryItems: ListItem[];
    addToPantry: (itemName: string) => void;
    addToGrocery: (itemName: string) => void;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined)

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
    const [pantryItems, setPantryItems] = useState<ListItem[]>([]);
    const [groceryItems, setGroceryItems] = useState<ListItem[]>([]);

    const addToPantry = (itemName: string) => {
        setPantryItems(prev=> [...prev, {
            id: Date.now().toString(),
            name: itemName
        }]);
    };

    const addToGrocery = (itemName: string) => {
        setGroceryItems(prev=> [...prev, {
            id: Date.now().toString(),
            name: itemName
        }]);
    };

    return (
        <ItemContext.Provider value={{
            pantryItems,
            groceryItems,
            addToPantry,
            addToGrocery,
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