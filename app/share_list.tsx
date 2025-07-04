import { UseItems } from '@/app/context/ItemContext';
import AppButton from '@/components/button';
import StoreForwardPopup from '@/components/storepopup';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Switch, Text, View } from 'react-native';
import { useStyle } from './context/styleContext';

const ShareListScreen = () => {

    const {groceryItems, pantryItems, stores} = UseItems()
    const {activeStyle} = useStyle();

    const params = useLocalSearchParams();
    const includeGroceryParam = params.includeGrocery === 'true';
    const includePantryParam = params.includePantry === 'true'

    const [includeGrocery, setIncludeGrocery] = useState(includeGroceryParam);
    const [selectedStore, setSelectedStore] = useState<string>('all');
    const [showStoreModal, setShowStoreModal] = useState(false);
    const [includePantry, setIncludePantry] = useState(includePantryParam);

    const navigation = useNavigation();
    const isDark = activeStyle === 'dark';
    const styles = getStyles(activeStyle);

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

    const formatList = (title: string, items: any[]) => {
        if (!items.length) return `${title}:\n(no items)\n`;

        return `${title}:\n` + `${items.length} items\n\n` + items.map(item => {
            const amount = item.amount || 1;
            const unit = item.unit && item.unit !== 'count' ? `${item.unit}` : '';
            return `- ${amount} ${unit} ${item.name}`;
        }).join('\n');
    };

    const getShareText = () => {
        let sections = [];
        if (includeGrocery) {
            const filtered = filterByStore(groceryItems)
            sections.push(formatList('🛒 Grocery List', filtered));
        }
        if (includePantry) {
            const filtered = filterByStore(pantryItems)
            sections.push(formatList('🏠 Pantry', filtered));
        }
        return sections.join('\n\n');
    };

    const handleCopy = async () => {
        const text = getShareText();
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied!', 'List copied to clipboard.');
    };

    const filterByStore = (items: any[]) => {
        if (!selectedStore || selectedStore.toLowerCase() === 'all') return items;
        return items.filter(item =>
            item.store?.toLowerCase().trim() === selectedStore.toLowerCase().trim()
        );
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
                <Text style={{color: activeStyle === 'dark' ? '#F5DEB3' : '#d97706'}}> Include Grocery List</Text>
                <Switch value={includeGrocery} onValueChange={setIncludeGrocery}/>
            </View>

            <View style={styles.toggleRow}>
                <Text style={{color: activeStyle === 'dark' ? '#F5DEB3' : '#d97706'}}> Include Pantry </Text>
                <Switch value={includePantry} onValueChange={setIncludePantry}/>
            </View>

            <View style={styles.buttonContainer}>
                <Text style={{ fontWeight: 'bold', color: activeStyle === 'dark' ? '#EADDCA' : '#b45309'}}>Store: {selectedStore}</Text>
                <AppButton
                    text="🛒 Choose Store"
                    textColor={activeStyle === 'dark' ? '#F5DEB3' : '#eaddca'}
                    isFullWidth={true}
                    onPress={() => setShowStoreModal(true)}
                />
                <AppButton
                    text="📋 Copy List"
                    textColor={activeStyle === 'dark' ? '#F5DEB3' : '#eaddca'}
                    onPress={handleCopy}
                    isFullWidth={true}
                />
                <AppButton
                    text="📋 Share List"
                    textColor={activeStyle === 'dark' ? '#F5DEB3' : '#eaddca'}
                    onPress={handleShare}
                    isFullWidth={true}
                />
            </View>

            <Text style={styles.previewTitle}> Preview: </Text>
            <Text style={[styles.previewText, {paddingBottom: 200}]}> {getShareText()} </Text>

            <StoreForwardPopup
                isVisible={showStoreModal}
                onClose={() => setShowStoreModal(false)}
                onConfirm={(storeName: string) => {
                    setSelectedStore(storeName);
                    setShowStoreModal(false);
                }}
                stores={stores}
            />

        </ScrollView>
    )

};
export const getStyles =  (activeStyle: string) => {
    const isDark = activeStyle === 'dark';

    const backgroundMain = isDark ? '#333' : '#EADDCA';
    const backgroundAlt = isDark ? '#444444' : '#fef3c7';
    const textMain = isDark ? '#EADDCA' : '#b45309';
    const textSecondary = isDark ? '#F5DEB3' : '#333';
    return StyleSheet.create({
        container: {
            padding: 16,
            backgroundColor: backgroundMain,
        },
        title: {
            color: textMain,
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
            color: textMain,
            marginTop: 20,
            fontWeight: 'bold',
            fontSize: 16,
        },
        previewText: {
            marginTop: 8,
            color: textSecondary,
            fontFamily: 'monospace',
        },
})};

export default ShareListScreen;
