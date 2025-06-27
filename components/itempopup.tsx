import { UseItems } from "@/app/context/ItemContext";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import AppButton from "./button";

interface PantryPopupProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    itemId?: string;
    listType?: string;
}

const PantryForwardPopup: React.FC<PantryPopupProps> = ({ 
    isVisible, 
    onClose, 
    onConfirm, 
    itemName,
    itemId,
    listType,
}) => {

    const {
        stores,
        pantryItems,
        groceryItems,
        removeFromGrocery,
        removeFromPantry,
        addToPantry,
        addToGrocery,
    } = UseItems();

    const getItemById = (id: string) => {
        return listType === 'first'
            ? pantryItems.find(item => item.id === id)
            : groceryItems.find(item => item.id === id)
    };

    const [amount, setAmount] = React.useState('');

    React.useEffect(() => {
        if (isVisible) {
            setAmount(''); 
        }
    }, [isVisible]);

    const router = useRouter();

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropTransitionOutTiming={0}
            style={styles.modalContainer}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
        >
            {listType === 'first' &&
            <View style={styles.popupContent}>
                <Text style={styles.title}>
                    Do you want to delete {itemName || 'item'}?
                </Text>
                <View style={{flexDirection: 'column'}}>

                    <View>
                        <Text style={[styles.title, {fontSize: 14, color: 'black', fontWeight: '600'}]}>
                            (Or select a store to move it to)
                        </Text>
                        <TextInput style={styles.textInputStyle}
                        keyboardType="numeric"
                        placeholder='Enter Item Amount'
                        placeholderTextColor='#444444'
                        value={amount}
                        onChangeText={setAmount}
                        />
                            <TouchableOpacity style={{ alignItems: 'center', marginBottom: 10 }}>
                                <AppButton
                                    text="+ Add New Store"
                                    onPress={() => {
                                        onClose();
                                        setTimeout(() => {
                                            router.push({ pathname: '/new_store' });
                                        }, 300); // delay 4 modal to close
                                    }}
                                    isFullWidth={false}
                                    //@ts-ignore
                                    width='60%' 
                                    fontSize={14}
                                    backgroundColor="#b45309"
                                    textColor="#EADDCA"
                                />
                            </TouchableOpacity>

                        <FlatList
                        style={styles.storeList}
                            data={stores}
                            keyExtractor={(item, index) => typeof item === 'string' ? item : item.value || index.toString()}
                            renderItem={({ item }) => (
                                <View style={{ borderRadius: 16, backgroundColor: '#d97706', marginBottom: 6 }}>
                                    <Text
                                        style={{ padding: 10, textAlign: 'center' }}
                                        onPress={async () => {
                                            if (itemId) {
                                                const originalItem = getItemById(itemId);
                                                if (originalItem) {
                                                    await addToGrocery({
                                                        //@ts-ignore
                                                        dontAsk: true,
                                                        ...originalItem,
                                                        id: Date.now().toString(),
                                                        store: typeof item === 'string' ? item : item.value,
                                                        unit: 'count',
                                                        amount: amount || '1'
                                                    });
                                                    await removeFromPantry(itemId);
                                                    console.log('moved to grocery')
                                                }
                                            }
                                            onClose();
                                        }}>
                                        {typeof item === 'string' ? item : item.label || item.value}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <AppButton
                            text="Cancel"
                            onPress={onClose}
                            backgroundColor="#6B7280"
                            width={120}
                        />
                        <AppButton
                            text="Delete"
                            onPress={onConfirm}
                            backgroundColor="#DC2626"
                            width={120}
                        />
                    </View>
                </View>
            </View>
            }

            {listType === 'second' &&
            
            <View style={styles.popupContent}>
                <Text style={styles.title}>
                    Do you want to move {itemName || 'item'} to the Pantry?
                </Text>

                <TextInput style={styles.textInputStyle}
                    placeholder='Enter Item Amount'
                    placeholderTextColor='#444444 '
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <View style={styles.buttonContainer}>
                        <AppButton
                            text="Yes"
                            onPress={async () => {
                                if (itemId) {
                                    const originalItem = getItemById(itemId);
                                    if (originalItem) {
                                        await addToPantry({
                                            ...originalItem,
                                            id: Date.now().toString(),
                                            unit: 'count',
                                            amount: amount || '1',
                                        });
                                        await removeFromGrocery(itemId);
                                        console.log('Moved to pantry');
                                    }
                                }
                                onClose();
                            }}
                            backgroundColor="#6B7280"
                            width={120}
                        />
                        <AppButton
                            text="No, Delete"
                            onPress={onClose}
                            backgroundColor="#DC2626"
                            width={120}
                        />
                    </View>
            </View>

            }
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popupContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '80%',
        alignItems: 'center',
    },
    storeList: {
        width: '100%',
        maxHeight: 150,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        backgroundColor: '#f9fafb',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    textInputStyle: {
        height: 40,
        borderColor: '#b45309',
        borderWidth: 1,
        borderRadius: 8,
        alignSelf: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
        width: '90%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    }
});

export default PantryForwardPopup;