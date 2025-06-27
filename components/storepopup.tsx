import { Store, UseItems } from "@/app/context/ItemContext";
import { router } from "expo-router";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

interface StorePopupProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (storeItem: string ) => void;
    stores?: Store[];
    listType?: string;
}

const StoreForwardPopup: React.FC<StorePopupProps> = ({ 
    isVisible, 
    onClose, 
    onConfirm, 
}) => {

    const {
        stores,
    } = UseItems();

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
            <View style={styles.popupContent}>
                <Text style={styles.title}>
                    Select Store
                </Text>
                <View style={{flexDirection: 'column', width: '90%', alignSelf: 'center'}}>
                        <FlatList
                        style={styles.storeList}
                            data={[{label: 'All', value: 'all'}, ...stores]}
                            keyExtractor={(item, index) => typeof item === 'string' ? item : item.value || index.toString()}
                            renderItem={({ item }) => (
                                <View style={{ borderRadius: 16, backgroundColor: '#d97706', marginBottom: 6 }}>
                                    <Text
                                        style={{ padding: 10, textAlign: 'center' }}
                                        onPress={() => {
                                            onConfirm(item.label)
                                        }}>
                                        {typeof item === 'string' ? item : item.label || item.value}
                                    </Text>
                                </View>
                            )}
                            ListFooterComponent={
                                <View style={{ 
                                        maxHeight: '30%',
                                        flexDirection: 'row',
                                        alignSelf: 'center',
                                        marginBottom: Platform.select({
                                            web: '2%',
                                        }), 
                                        gap: '2%',
                                        height: '145%',
                                        padding: 10,
                                        justifyContent: 'center',
                                    }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose()
                                            router.push('/new_store')
                                        }}
                                        style={{backgroundColor: '#b45309', paddingVertical: '3%', borderRadius: 10, width: '50%'}}
                                    >
                                        <Text style={{fontFamily: 'sans-serif', fontSize: 14, textAlign: 'center', top: '20%', fontWeight: '500', color: '#EADDCA'}}>
                                            + Store
                                        </Text>
                                    </TouchableOpacity>
                                
                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose()
                                            router.push('/delete_store')
                                        }}
                                        style={{backgroundColor: '#b45309', paddingVertical: '3%', borderRadius: 10, width: '50%'}}
                                    >
                                        <Text style={{fontFamily: 'sans-serif', fontSize: 14, textAlign: 'center', top: '20%', fontWeight: '500', color: '#EADDCA'}}>
                                            - Store
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        />
                </View>
            </View>
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

export default StoreForwardPopup;