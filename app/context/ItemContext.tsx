import { auth, db } from '@/firebaseConfig';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ListItem = {
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
    addToPantry: (item: { name: string; category: string; amount: string; unit: string }) => Promise<void>;
    addToGrocery: (item: { name: string; category: string; amount: string; unit: string }) => Promise<void>;
    removeFromPantry: (id: string) => Promise<void>;
    removeFromGrocery: (id: string) => Promise<void>;
    removeSinglePantryItem: (id: string) => void;
    removeSingleGroceryItem: (id: string) => void;
    addSinglePantryItem: (id: string) => void;
    addSingleGroceryItem: (id: string) => void;
    updatePantryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => Promise<void>;
    updateGroceryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => Promise<void>;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
    const [pantryItems, setPantryItems] = useState<ListItem[]>([]);
    const [groceryItems, setGroceryItems] = useState<ListItem[]>([]);

    useEffect(() => {
        const pantryQuery = query(collection(db, 'items'), where('listType', '==', 'pantry'));
        const unsubscribePantry = onSnapshot(pantryQuery, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name ?? '',
                    category: data.category ?? '',
                    amount: data.amount ?? '',
                    unit: data.unit ?? ''
                } as ListItem;
            });
            setPantryItems(items);
        });

        // Subscribe to grocery items
        const groceryQuery = query(collection(db, 'items'), where('listType', '==', 'grocery'));
        const unsubscribeGrocery = onSnapshot(groceryQuery, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name ?? '',
                    category: data.category ?? '',
                    amount: data.amount ?? '',
                    unit: data.unit ?? ''
                } as ListItem;
            });
            setGroceryItems(items);
        });

        // Cleanup subscriptions
        return () => {
            unsubscribePantry();
            unsubscribeGrocery();
        };
    }, []);

    const fetchItems = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            // return them pantry items from big boy cloud
            const pantryQuery = query(
                collection(db, 'items'),
                where('userId', '==', userId),
                where('listType', '==', 'pantry'),
            );
            const pantrySnapshot = await getDocs(pantryQuery);
            const pantryData = pantrySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as ListItem));
            setPantryItems(pantryData);

            // ofc dont forget that big boy grocery list
            const groceryQuery = query(
                collection(db, 'items'),
                where('userId', '==', userId),
                where('listType', '==', 'grocery'),
            );

            const grocerySnapshot = await getDocs(groceryQuery);
            const groceryData = grocerySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            } as ListItem));

            setGroceryItems(groceryData);
        } catch(error) {
            console.error("Error fetching items:", error);
        }
    };

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

    const updatePantryItem = async (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => {
        try {
            const docRef = doc(db, 'items', id);
            await updateDoc(docRef, updates);
            setPantryItems(prev => prev.map(item =>
                item.id === id ? { ...item, ...updates } : item
            ));
        } catch (error) {
            console.error('Error updating pantry item:', error);
            throw error;
        }
    };

    const updateGroceryItem = async (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => {
        try {
            const docRef = doc(db, 'items', id);
            await updateDoc(docRef, updates);
            setGroceryItems(prev => prev.map(item =>
                item.id === id ? { ...item, ...updates } : item
            ));
        } catch (error) {
            console.error('Error updating grocery item:', error);
            throw error;
        }
    };



    const addToPantry = async (item: { name: string; category: string; amount: string; unit: string }) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            const docRef = await addDoc(collection(db, 'items'), {
                ...item,
                userId,
                listType: 'pantry',
                createdAt: new Date(),
            });

            const newItem = {
                id: docRef.id,
                ...item,
            } as ListItem;

            setPantryItems(prev => [...prev, newItem]);
        } catch (error) {
            console.error('Error adding pantry item:', error);
            throw error;
        }
    };


    const addToGrocery = async (item: { name : string; category : string; amount : string, unit: string}) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            const docRef = await addDoc(collection(db, 'items'), {
                ...item,
                userId,
                listType: 'grocery',
                createdAt: new Date(),
            });

            const newItem = {
                id: docRef.id,
                ...item,
            } as ListItem;

            setGroceryItems(prev => [...prev, newItem]);
        } catch (error) {
            console.error('Error adding grocery item:', error);
            throw error;
        }
    };



    const removeFromPantry = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'items', id));
            setPantryItems(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing pantry item:', error);
            throw error;
        }
    };

    const removeFromGrocery = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'items', id));
            setGroceryItems(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing grocery item:', error);
            throw error;
        }
    };


    const removeSinglePantryItem = async (id: string) => {
        try {
            const item = pantryItems.find(item => item.id === id);
            if (!item) return;

            const newAmount = Math.max(0, parseInt(item.amount) - 1);
            if (newAmount === 0) return;

            const docRef = doc(db, 'items', id);
            await updateDoc(docRef, { amount: newAmount.toString() });

            setPantryItems(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, amount: newAmount.toString() };
                }
                return item;
            }));
        } catch (error) {
            console.error('Error updating pantry item amount:', error);
            throw error;
        }
    };

    const removeSingleGroceryItem = async (id: string) => {
        try {
            const item = groceryItems.find(item => item.id === id);
            if (!item) return;

            const newAmount = Math.max(0, parseInt(item.amount) - 1);
            if (newAmount === 0) return;

            const docRef = doc(db, 'items', id);
            await updateDoc(docRef, { amount: newAmount.toString() });

            setGroceryItems(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, amount: newAmount.toString() };
                }
                return item;
            }));
        } catch (error) {
            console.error('Error updating grocery item amount:', error);
            throw error;
        }
    };

    const addSinglePantryItem = async (id: string) => {
        try {
            const item = pantryItems.find(item => item.id === id);
            if (!item) return;

            const newAmount = parseInt(item.amount) + 1;
            const docRef = doc(db, 'items', id);
            await updateDoc(docRef, { amount: newAmount.toString() });

            setPantryItems(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, amount: newAmount.toString() };
                }
                return item;
            }));
        } catch (error) {
            console.error('Error updating pantry item amount:', error);
            throw error;
        }
    };

    const addSingleGroceryItem = async (id: string) => {
        try {
            const item = groceryItems.find(item => item.id === id);
            if (!item) return;

            const newAmount = parseInt(item.amount) + 1;
            const docRef = doc(db, 'items', id);
            await updateDoc(docRef, { amount: newAmount.toString() });

            setGroceryItems(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, amount: newAmount.toString() };
                }
                return item;
            }));
        } catch (error) {
            console.error('Error updating grocery item amount:', error);
            throw error;
        }
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