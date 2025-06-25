import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UseItems } from './context/ItemContext';

const SimilarItemScreen = () => {
    const {addSingleGroceryItem, addSinglePantryItem} = UseItems();
    const [amount, setAmount] = React.useState<number | undefined>(undefined);
    const router = useRouter();
    const { listType, jsonResults } = useLocalSearchParams<{
        listType?: string;
        jsonResults?: string;
    }>();

    const results = jsonResults ? JSON.parse(jsonResults) : [];
    const handleAction = (itemId: string, amt: number) => {
        if (listType === 'grocery') {
            addSingleGroceryItem(itemId, amt)
        } else {
            addSinglePantryItem(itemId, amt)
        }
        router.back()
    };

    return (
        <ScrollView style={styles.contentContainerStyle}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                Found similar items:
            </Text>

            <TextInput
                autoFocus={true}
                style={styles.input}
                value={amount?.toString() ?? ''}
                onChangeText={(text) => {
                    const parsed = parseInt(text);
                    setAmount(isNaN(parsed) ? undefined : parsed);
                }}
                keyboardType="numeric"
                placeholder="Enter Amount (Default: 1)"
                placeholderTextColor="#a96733"
            />

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

                    <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                        <TouchableOpacity
                            onPress={() => handleAction(result.item.id, amount ?? 1)}
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
        padding: 20,
        backgroundColor: '#EADDCA'
    },
    input: {
        alignSelf: 'center',
        width: '90%',
        height: 40,
        padding: 10,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 10,
    },
})

export default SimilarItemScreen;