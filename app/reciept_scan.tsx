import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const api_key = 'K81062778588957';

const RecieptScanScreen = () => {
    const [scannedText, setScannedText] = useState('');
    const [loading, setLoading] = useState(false);

    const pickImageAndScan = async () => {
        setScannedText('');
        setLoading(true);
        let result = await ImagePicker.launchCameraAsync({
            quality: 0.3,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            await sendToOCRSpace(uri);
        } else {
            setLoading(false);
        }
    };

    const sendToOCRSpace = async (uri: string) => {
        const formData = new FormData();

        //@ts-ignore
        formData.append('file', {
            uri,
            type: 'image/jpeg',
            name: 'reciept.jpg',
        });
        formData.append('language', 'eng')
        formData.append('isOverlayRequired', 'false')

        try {
            const response = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                headers: {
                    apikey: api_key,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
            const data = await response.json();
            console.log(data || 'no data recieved')
            const text = data.ParsedResults?.[0]?.ParsedText || 'No text found';
            setScannedText(text);
        } catch (err) {
            setScannedText('Failed to scan text');
        }
        setLoading(false)
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={pickImageAndScan}>
              <Text style={styles.buttonText}>Scan Receipt</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#b45309" />}
            <ScrollView style={styles.resultContainer}>
              <Text selectable style={styles.resultText}>{scannedText}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#EADDCA' },
  button: {
    backgroundColor: '#b45309',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultContainer: { flex: 1, marginTop: 16 },
  resultText: { color: '#333', fontSize: 16 },
});

export default RecieptScanScreen;