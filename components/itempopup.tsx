import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import AppButton from "./button";

interface PantryPopupProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

const PantryForwardPopup: React.FC<PantryPopupProps> = ({ 
    isVisible, 
    onClose, 
    onConfirm, 
    itemName 
}) => {
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
                    Where do you want to move {itemName || 'item'}?
                </Text>
                <View style={{flexDirection: 'column'}}>

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
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    }
});

export default PantryForwardPopup;