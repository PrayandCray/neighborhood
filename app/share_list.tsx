import { UseItems } from '@/app/context/ItemContext';
import AppButton from '@/components/button';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Switch, Text, View } from 'react-native';

const ShareListScreen = () => {

    const {groceryItems, pantryItems} = UseItems()

    const params = useLocalSearchParams();
    const includeGroceryParam = params.includeGrocery === 'true';
    const includePantryParam = params.includePantry === 'true'

    const [includeGrocery, setIncludeGrocery] = useState(includeGroceryParam);
    const [includePantry, setIncludePantry] = useState(includePantryParam);

    const formatList = (title: string, items: any[]) => {
        if (!items.length) return `${title}:\n(no items)\n`;

        return `${title}:\n` + items.map(item => {
            const amount = item.amount || 1;
            const unit = item.unit && item.unit !== 'count' ? `${item.unit}` : '';
            return `- ${amount} ${unit} ${item.name}`;
        }).join('\n');
    };

    const getShareText = () => {
        let sections = [];
        if (includeGrocery) sections.push(formatList('🛒 Grocery List', groceryItems));
        if (includePantry) sections.push(formatList('🏠 Pantry', pantryItems));
        return sections.join('\n\n');
    };

    const handleCopy = async () => {
        const text = getShareText();
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied!', 'List copied to clipboard.');
    };

    const handleShare = async () => {
        try {
            const message = getShareText();
            await Share.share({ message });
        } catch (err) {
            Alert.alert('Error', 'Could not share the list.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}> Select lists to share </Text>

            <View style={styles.toggleRow}>
                <Text> Include Grocery List</Text>
                <Switch value={includeGrocery} onValueChange={setIncludeGrocery}/>
            </View>

            <View style={styles.toggleRow}>
                <Text> Include Pantry </Text>
                <Switch value={includePantry} onValueChange={setIncludePantry}/>
            </View>

            <View style={styles.buttonContainer}>
                <AppButton
                    text="📋 Copy List"
                    onPress={handleCopy}
                    isFullWidth={true}
                />
                <AppButton
                    text="📋 Share List"
                    onPress={handleShare}
                    isFullWidth={true}
                />
            </View>

            <Text style={styles.previewTitle}> Preview: </Text>
            <Text style={styles.previewText}> {getShareText()} </Text>

        </ScrollView>
    )

};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#EADDCA',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonContainer: {
        marginTop: 16,
        gap: 10,
    },
    previewTitle: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 16,
    },
    previewText: {
        marginTop: 8,
        fontFamily: 'monospace',
    },
});

export default ShareListScreen;
