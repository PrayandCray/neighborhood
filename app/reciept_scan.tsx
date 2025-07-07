import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useStyle } from './context/styleContext';

const RecieptScanScreen = () => {
    const [parsedItems, setParsedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {activeStyle} = useStyle();

    const navigation = useNavigation();
        const isDark = activeStyle === 'dark';
    
        useLayoutEffect(() => {
            navigation.setOptions({
                headerStyle: {
                    backgroundColor: isDark ? '#333333' : '#EADDCA',
                },
                headerTintColor: isDark ? '#EADDCA' : '#b45309',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            });
        }, [navigation, activeStyle]);
    
        const styles = getStyles(activeStyle)

    const pickImageAndScan = async () => {
        setParsedItems([]);
        setError('');
        setLoading(true);

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.4,
            allowsEditing: false,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            await uploadToFastAPI(uri);
        } else {
            setLoading(false);
        }
    };

    const uploadToFastAPI = async (uri: string) => {
        const formData = new FormData();

        //@ts-ignore
        formData.append('file', {
            uri,
            type: 'image/jpeg',
            name: 'receipt.jpg',
        });

        try {
            const response = await fetch('http://10.0.0.135:8000/upload-receipt/', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();

            if (data.items) {
                setParsedItems(data.items);
            } else {
                setError('No items found in receipt.');
            }
        } catch (err) {
            setError('Failed to connect to server.');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={pickImageAndScan}>
                <Text style={styles.buttonText}>Scan Receipt</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#b45309" />}

            {!loading && parsedItems.length > 0 && (
                <ScrollView style={styles.resultContainer}>
                    {parsedItems.map((item, idx) => (
                        // This is how each individual item is going to look
                        <View key={idx} style={styles.itemContainer}>
                            <Text style={styles.resultText}>
                                • {item.Name} — {item.Amount ?? '—'} {item.Unit ?? ''}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}

            {!loading && error !== '' && (
                <Text style={{ color: 'red', marginTop: 12 }}>{error}</Text>
            )}
        </View>
    );
};

export const getStyles = (activeStyle: string) => {
    const isDark = activeStyle === 'dark';
    const backgroundMain = isDark ? '#333' : '#EADDCA';
    const backgroundAlt = isDark ? '#444444' : '#fef3c7';
    const textMain = isDark ? '#EADDCA' : '#b45309';
    const textSecondary = isDark ? '#F5DEB3' : '#d97706';

    return StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: backgroundMain,
    },
    button: {
        backgroundColor: '#b45309',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultContainer: {
        flex: 1,
        gap: 5,
    },
    resultText: {
        color: textSecondary,
        fontSize: 16,
    },
    itemContainer: {
        marginBottom: 12,
        paddingVertical: 15,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: backgroundAlt,
        paddingHorizontal: 10,
        borderRadius: 12
    },
})};

export default RecieptScanScreen;
