import AppButton from '@/components/button';
import ScanItemPopup from '@/components/scanItemPopup';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { UseItems } from './context/ItemContext';

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
    const {groceryItems, pantryItems } = UseItems() 
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const { listType } = useLocalSearchParams<{ listType?: string }>();
    const [itemProduct, setItemProduct] = useState<[string | null, string | null, string | null] | null>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [hasScanned, setHasScanned] = React.useState(false);

    const handleScanConfirm = (selectedItem: string) => {
        const existingItems = listType === 'grocery' ? groceryItems : pantryItems;
        const itemName = selectedItem.trim().toLowerCase();

        const fuse = new Fuse(existingItems, ({
            keys: ['name'],
            threshold: 0.5,
        }));

        const results = fuse.search(itemName);
        const jsonResults = JSON.stringify(results);

        if (results.length > 0) {
            setIsPopupVisible(true)
            Alert.alert(
                'Similar item found',
                'Do you want to add this to an item already in your pantry?',
                [
                    {
                        text: `Add ${itemName} to existing item`,
                        onPress: () => {
                            router.push({
                                pathname: '/simmilar_item',
                                params: {listType, jsonResults, }
                            })
                        }
                    },
                    {
                        text: `Add ${itemName} as a new item`,
                        onPress: () => {
                            router.push({
                                pathname: '/new',
                                params: {listType, itemName: selectedItem, amount: 1, dupeItemAlert: String(true)}
                            })
                        }
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => setIsPopupVisible(false)
                    },
                ]
            )
        } else {
            
            console.log(listType);
            router.push({
                pathname: '/new',
                params: {listType: listType, itemName: selectedItem}
            })
        }
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
                <Text style={[styles.text, {marginTop: '2%'}]}>(does not work on web).</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!isPopupVisible && (
                <CameraView
                style={{ flex: 1, width: '100%' }}
                facing={facing}
                onCameraReady={() => console.log('Camera is ready')}
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
            )}
            

            <View style={styles.cameraBottomView}>
                <Text style={[styles.text, {color: 'white', fontWeight: 500, bottom: 15}]}>Scan Barcode/Reciept</Text>
                <Text style={[styles.text, {color: 'white', fontWeight: 300, bottom: 15}]}>Frame barcode clearly</Text>
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
                    setHasScanned(false);
                    setIsPopupVisible(false)
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
        flex: 0,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 18,
        color: '#333',
        marginHorizontal: 24
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