import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SimilarItemScreen = () => {
    const router = useRouter();
    const { listType, jsonResults } = useLocalSearchParams<{
        listType?: string;
        jsonResults?: string;
    }>();

    const results = jsonResults ? JSON.parse(jsonResults) : [];

    const handleAction = (itemName: string, action: 'add' | 'replace') => {
        console.log(`Replacing with "${itemName}"`);
        router.push({
            pathname: '/edit',
            params: { listType, itemName },
        });
    };

    return (
        <ScrollView style={styles.contentContainerStyle}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                Found similar items:
            </Text>

            {results.map((result: any, index: number) => (
                <View
                    key={index}
                    style={{
                        marginBottom: 16,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{result.item.name}</Text>
                    <Text style={{ fontSize: 12, color: '#999' }}>
                        Similarity: {(1 - result.score).toFixed(2)}
                    </Text>

                    <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => handleAction(result.item.name, 'replace')}
                            style={{
                                padding: 10,
                                backgroundColor: '#4076cc',
                                borderRadius: 6,
                            }}
                        >
                            <Text style={{ color: '#fff' }}>Use this item</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    contentContainerStyle: { 
        padding: 20 }
})

export default SimilarItemScreen;