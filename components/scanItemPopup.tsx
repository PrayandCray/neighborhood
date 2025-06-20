import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

interface ScanItemPopupProps {
    isVisible: boolean;
    barcodeItemList: string[];
    listType?: string;
    onClose: () => void;
    onConfirm?: (selectedItem: string) => void;
}

const ScanItemPopup: React.FC<ScanItemPopupProps> = ({
    isVisible,
    barcodeItemList,
    listType,
    onClose,
    onConfirm,
}) => {
    const [itemName, setItemName] = React.useState('');

    React.useEffect(() => {
        if (isVisible) {
            setItemName('')
        }
    })

    const processedList = barcodeItemList
        .flatMap(item =>
            typeof item === 'string'
                ? item.split(',').map(str => str.trim()).filter(Boolean)
                : []
        );

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
                    New Scan Item for {listType}
                </Text>
                <Text style={styles.subtitle}>
                    Pick a Name that Resembles the Item
                </Text>
                <FlatList
                    data={processedList}
                      keyExtractor={(item, index) => `${item ?? 'unknown'}-${index}`}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => {
                                if (!item) return;
                                setItemName(item);
                                if (onConfirm) {
                                    onConfirm(item);
                                }
                                onClose();
                            }}
                            style={{
                                padding: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: '#ccc',
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create ({
    modalContainer: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
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
        maxHeight: 400,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    subtitle: {
        paddingTop: 10,
        fontSize: 12,
        fontWeight:500,
        textAlign: 'center'
    },
})

export default ScanItemPopup;