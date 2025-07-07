import AppButton from '@/components/button';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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
        <SafeAreaView style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <Ionicons
                name='caret-back-circle'
                onPress={() => router.back()}
                size={30}
                style={{paddingTop: 15, marginLeft: 12}}
                color={"#b45309"}
                />
                <TouchableOpacity style={styles.button} onPress={pickImageAndScan}>
                    <Text style={styles.buttonText}>Scan Receipt</Text>
                </TouchableOpacity>
            </View>

            {loading && <ActivityIndicator size="large" color="#b45309" />}

            {!loading && parsedItems.length > 0 && (
                <ScrollView style={styles.resultContainer}>
                    {parsedItems.map((item, idx) => (
                        // This is how each individual item is going to look

                        <View key={idx} style={styles.itemContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.resultText, {paddingTop: 5}]}>Name: </Text>
                                <TextInput style={styles.input}
                                    placeholder={item.Name}
                                    placeholderTextColor={activeStyle == 'dark' ? '#EADDCA' : '#b45309'}
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <AppButton
                                    text='Add New'
                                    onPress={() => {console.log('this is where you add an item')}}
                                    isFullWidth={true}
                                    textColor={activeStyle === 'dark' ? '#EADDCA' : '#b45309'}
                                />
                                <AppButton
                                    text='Remove'
                                    onPress={() => {console.log('this is where you delete this item')}}
                                    isFullWidth={true}
                                    textColor={activeStyle === 'dark' ? '#EADDCA' : '#b45309'}
                                />
                            </View>
                        </View>

                    ))}
                </ScrollView>
            )}

            {!loading && error !== '' && (
                <Text style={{ color: 'red', marginTop: 12 }}>{error}</Text>
            )}
        </SafeAreaView>
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
        marginHorizontal: 15,
        backgroundColor: '#b45309',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 24,
        width: '80%'
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
        alignSelf: 'center',
        backgroundColor: backgroundAlt,
        paddingHorizontal: 10,
        borderRadius: 12,
        maxWidth: '95%',
        minWidth: '90%',
        gap: 10
    },
    buttonContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 4
    },
    input: {
        width: '85%',
        alignSelf: 'center',
        borderWidth: 1,
        color: textMain,
        borderColor: '#b45309',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
})};

export default RecieptScanScreen;
