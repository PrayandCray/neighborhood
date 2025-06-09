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
    isLoading: boolean;
    error: Error | null;
    isAuthenticated: boolean;
    fetchItems: () => Promise<void>;
    addToPantry: (item: { name: string; category: string; amount: string; unit: string}) => Promise<void>;
    addToGrocery: (item: { name: string; category: string; amount: string; unit: string}) => Promise<void>;
    removeFromPantry: (id: string) => Promise<void>;
    removeFromGrocery: (id: string) => Promise<void>;
    removeSinglePantryItem: (id: string) => Promise<void>;
    removeSingleGroceryItem: (id: string) => Promise<void>;
    addSinglePantryItem: (id: string) => Promise<void>;
    addSingleGroceryItem: (id: string) => Promise<void>;
    updatePantryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => Promise<void>;
    updateGroceryItem: (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => Promise<void>;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
    const [pantryItems, setPantryItems] = useState<ListItem[]>([]);
    const [groceryItems, setGroceryItems] = useState<ListItem[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            console.log('Auth state changed:', user ? `logged in as ${user.uid}` : 'logged out');
            setIsAuthenticated(!!user);
            setCurrentUserId(user?.uid || null);
            
            if (!user) {
                setPantryItems([]);
                setGroceryItems([]);
                setError(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        let unsubscribePantry: (() => void) | undefined;
        let unsubscribeGrocery: (() => void) | undefined;

        const setupListeners = async () => {
            if (!currentUserId) {
                setIsLoading(false);
                return;
            }

            console.log(`Setting up listeners for user: ${currentUserId}`);
            setIsLoading(true);
            setError(null);

            try {
                // clear data and then setup new incase if user signs in and out
                setPantryItems([]);
                setGroceryItems([]);

                const pantryQuery = query(
                    collection(db, 'users', currentUserId, 'items'),
                    where('listType', '==', 'pantry')
                );

                const groceryQuery = query(
                    collection(db, 'users', currentUserId, 'items'),
                    where('listType', '==', 'grocery')
                );

                unsubscribePantry = onSnapshot(pantryQuery, (snapshot) => {
                    const items = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as ListItem));
                    console.log(`Received ${items.length} pantry items for user ${currentUserId}`);
                    setPantryItems(items);
                });

                unsubscribeGrocery = onSnapshot(groceryQuery, (snapshot) => {
                    const items = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as ListItem));
                    console.log(`Received ${items.length} grocery items for user ${currentUserId}`);
                    setGroceryItems(items);
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error setting up listeners:', error);
                setError(error as Error);
                setIsLoading(false);
            }
        };

        setupListeners();

        // cleanup
        return () => {
            console.log('Cleaning up listeners...');
            if (unsubscribePantry) unsubscribePantry();
            if (unsubscribeGrocery) unsubscribeGrocery();
        };
    }, [currentUserId]);

    useEffect(() => {
        console.log('Current state:', {
            isLoading,
            error: error?.message,
            pantryItemsCount: pantryItems.length,
            groceryItemsCount: groceryItems.length
        });
    }, [isLoading, error, pantryItems, groceryItems]);

    const fetchItems = async () => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) return;

            // return them pantry items from big boy cloud
            const pantryQuery = query(
                collection(db, 'users', userId, 'items'),
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
                collection(db, 'users', userId, 'items'),
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
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated')
                
            const docRef = doc(db, 'users', userId, 'items', id);
            await updateDoc(docRef, updates);

        }   catch (error) {
            console.error('Error updating pantry item:', error);
            throw error;
        }
    };

    const updateGroceryItem = async (id: string, updates: { name?: string; amount?: string; unit: string; category?: string }) => {
        const userId = auth.currentUser?.uid;
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');
            const docRef = doc(db, 'users', userId, 'items', id);
            await updateDoc(docRef, updates);

        } catch (error) {
            console.error('Error updating grocery item:', error);
            throw error;
        }
    };



    const addToPantry = async (item: { name: string; category: string; amount: string; unit: string }) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            addDoc(
                collection(db, 'users', userId, 'items'),
                {
                    ...item,
                    userId,
                    listType: 'pantry',
                    createdAt: new Date(),
                }
            );

            console.log('added pantry item:', item)

        } catch (error) {
            console.error('Error adding pantry item:', error);
            throw error;
        }
    };


    const addToGrocery = async (item: { name : string; category : string; amount : string, unit: string}) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            await addDoc(
                collection(db, 'users', userId, 'items'),
                {
                    ...item,
                    userId,
                    listType: 'grocery',
                    createdAt: new Date(),
                }
            );

            console.log('added grocery item:', item)

        } catch (error) {
            console.error('Error adding grocery item:', error);
            throw error;
        }
    };



    const removeFromPantry = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            await deleteDoc(doc(db, 'users', userId, 'items', id));

        } catch (error) {
            console.error('Error removing pantry item:', error);
            throw error;
        }
    };

    const removeFromGrocery = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            await deleteDoc(doc(db, 'users', userId, 'items', id));
            
        } catch (error) {
            console.error('Error removing grocery item:', error);
            throw error;
        }
    };


    const removeSinglePantryItem = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            const item = pantryItems.find(item => item.id === id);
            if (!item) return;

            const newAmount = Math.max(0, parseInt(item.amount) - 1);
            if (newAmount === 0) return;

            const docRef = doc(db, 'users', userId, 'items', id);
            await updateDoc(docRef, { amount: newAmount.toString() });

        } catch (error) {
            console.error('Error updating pantry item amount:', error);
            throw error;
        }
    };

    const removeSingleGroceryItem = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            const item = groceryItems.find(item => item.id === id);
            if (!item) return;

            const newAmount = Math.max(0, parseInt(item.amount) - 1);
            if (newAmount === 0) return;

            const docRef = doc(db, 'users', userId, 'items', id);
            await updateDoc(docRef, { amount: newAmount.toString() });

        } catch (error) {
            console.error('Error updating grocery item amount:', error);
            throw error;
        }
    };

    const addSinglePantryItem = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            const item = pantryItems.find(item => item.id === id);
            if (!item) return;

            const newAmount = parseInt(item.amount) + 1;
            const docRef = doc(db, 'users', userId, 'items', id);
            await updateDoc(docRef, { amount: newAmount.toString() });

        } catch (error) {
            console.error('Error updating pantry item amount:', error);
            throw error;
        }
    };

    const addSingleGroceryItem = async (id: string) => {
        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('User not authenticated');

            const item = groceryItems.find(item => item.id === id);
            if (!item) return;

            const newAmount = parseInt(item.amount) + 1;
            const docRef = doc(db, 'users', userId, 'items', id);
            await updateDoc(docRef, { amount: newAmount.toString() });

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