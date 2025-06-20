import AppButton from '@/components/button';
import ScanItemPopup from '@/components/scanItemPopup';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const fetchProduct = async (
    barcode: string
): Promise<string[] | null> => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();
        const categories = data.product?.categories || null;
        const productName = data.product?.product_name || null;
        if (data.status === 1) {
            return [productName, categories] as string[];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
};

const ScanScreen = () => {
    const router = useRouter()
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const { listType } = useLocalSearchParams<{ listType?: string }>();
    const [itemProduct, setItemProduct] = useState<[string | null, string | null, string | null] | null>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [hasScanned, setHasScanned] = React.useState(false);

    const handleScanConfirm = (selectedItem: string) => {
        setIsPopupVisible(false);
        
        console.log(listType);
        router.push({
            pathname: '/new',
            params: {listType: listType, itemName: selectedItem}
        })
    }

    if (!cameraPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (!cameraPermission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Camera permission is required.</Text>
                <AppButton 
                    text="Grant Camera Permission" 
                    onPress={requestCameraPermission}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={{ flex: 1, width: '100%' }}
                facing={facing}
                onCameraReady={() => console.log('Camera is ready')}
                barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'ean8', 'code128', 'itf14' ],
                }}
                onBarcodeScanned={(event) => {
                    if (hasScanned) return;
                    setHasScanned(true)

                    const barcodeValue = event.data;
                    fetchProduct(barcodeValue).then((product) => {
                        if (product) {
                            setItemProduct([...(product as [string | null, string | null]), null]);
                            setIsPopupVisible(true);
                        } else {
                            console.log('No product found for this barcode.');
                            setHasScanned(false)
                        }
                    });
                }}
            />
            
            <View style={styles.cameraBottomView}>
                <Text style={[styles.text, {color: 'white', fontWeight: 500, bottom: 15}]}>Scan Barcode/Reciept</Text>
                <Ionicons
                    name="camera-reverse"
                    size={32}
                    color="#fff"
                    style={{ position: 'absolute', bottom: 50, right: 20 }}
                    onPress={() => {
                        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
                    }}
                />
            </View>
            <ScanItemPopup
                isVisible={isPopupVisible}
                barcodeItemList={itemProduct ? itemProduct.filter((item): item is string => !!item && item.trim() !== '') : []}
                onConfirm={handleScanConfirm}
                onClose={() => {
                    setIsPopupVisible(false);
                    setHasScanned(false);
                }}
                listType={listType}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
    cameraBottomView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ScanScreen;