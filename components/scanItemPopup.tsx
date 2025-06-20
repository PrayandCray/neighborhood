import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

interface ScanItemPopupProps {
    isVisible: boolean;
    barcodeItemList: string[];
    listType?: string;
    onClose: () => void;
}

const ScanItemPopup: React.FC<ScanItemPopupProps> = ({
    isVisible,
    barcodeItemList,
    listType,
    onClose,
}) => {
    const [itemName, setItemName] = React.useState('');

    React.useEffect(() => {
        if (isVisible) {
            setItemName('')
        }
    })

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
            <Text style={styles.title}>
                New Scan Item for {listType === 'first' ? 'Pantry' : 'Grocery List'}
            </Text>
            <Text style={styles.subtitle}>
                Pick a Name that Resembles the Item
            </Text>
            <FlatList
                data={barcodeItemList}
                keyExtractor={(item, index) => item}
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => {
                            setItemName(item);
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
        </Modal>
    );
};

const styles = StyleSheet.create ({
    modalContainer: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
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