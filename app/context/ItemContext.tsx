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
    addToPantry: (item: { name: string; category: string; amount: string; unit: string }) => void;
    addToGrocery: (item: { name: string; category: string; amount: string; unit: string }) => void;
    removeFromPantry: (id: string) => void;
    removeFromGrocery: (id: string) => void;
    removeSinglePantryItem: (id: string) => void;
    removeSingleGroceryItem: (id: string) => void;
    addSinglePantryItem: (id: string) => void;
    addSingleGroceryItem: (id: string) => void;
    updatePantryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => void;
    updateGroceryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => void;
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

    const removeSinglePantryItem = (id: string) => {
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

    const removeSingleGroceryItem = (id: string) => {
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

    const addSinglePantryItem = (id: string) => {
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

    const addSingleGroceryItem = (id: string) => {
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