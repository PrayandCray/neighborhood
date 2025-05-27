import React, { useEffect } from 'react';
import {useRouter, useLocalSearchParams} from 'expo-router';
import AppButton from "@/components/button";
import {SafeAreaView, View, Text, StyleSheet, FlatList} from 'react-native';
import { UseItems } from '../context/ItemContext';
import {Ionicons} from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const List = () => {
    const router = useRouter();
    const { initialList } = useLocalSearchParams();
    const [activelist, setActiveList] = React.useState<'first' | 'second'>(
        initialList === 'second' ? 'second' : 'first'
    );

    useEffect(() => {
        if (initialList) {
            setActiveList(initialList === 'second' ? 'second' : 'first');
        }
    }, [initialList]);

    const {
        pantryItems,
        groceryItems,
        categories,
        removeFromPantry,
        removeFromGrocery,
    } = UseItems();


    const items = activelist === 'first' ? pantryItems : groceryItems;
    const removeitem = activelist === 'first' ? removeFromPantry : removeFromGrocery;

    return (
        <LinearGradient
            colors={['#E2E2E2', '#B39171', '#843F00']}
            locations={[0, 0.275, 1]}
            style={styles.container}>
            <SafeAreaView>

                <Text style={styles.title}>
                    List
                </Text>

                <Text style={styles.subtitle}>
                    This is where your lists are stored
                </Text>

                <View style={styles.buttonContainer}>
                    <AppButton
                        text="My Pantry"
                        onPress={() => setActiveList('first')}
                        width={130}
                        borderPadding={10}
                        borderColor={activelist === 'first' ? '#fff' : '#b45309'}
                        textColor={'#EADDCA'}/>
                    <AppButton
                        text='Grocery List'
                        onPress={() => setActiveList('second')}
                        width={130}
                        borderPadding={10}
                        borderColor={activelist === 'second' ? '#fff' : '#b45309'}
                        textColor={'#EADDCA'}/>
                </View>

                <FlatList
                    style={styles.listContainer}
                    data={items}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={true}
                    persistentScrollbar={true}
                    renderItem={({item}) => (
                        <View style={styles.listItemContainer}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16}}>
                                <Text style={styles.listItem}>{item.name}</Text>
                                {item.category && (
                                    <View style={ styles.categoryContainer}>
                                        <Text style={styles.categoryLabel}>
                                            {categories.find(cat => cat.value === item.category)?.label || 'Other'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Ionicons
                                name="trash-outline"
                                size={24}
                                color="#b45309"
                                onPress={() => removeitem(item.id)}
                            />
                        </View>
                    )}
                    ListHeaderComponent={
                        <Text style={styles.listHeaderText}>
                            {activelist === 'first' ? 'My Pantry' : 'Grocery List'}
                        </Text>
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyList}>
                            No Items in Lists
                        </Text>
                    }
                />
                <View style={styles.buttonContainer}>
                    <AppButton
                        text="Scan Items"
                        onPress={() => console.log('New Scan Item')}
                        isFullWidth={false}
                        width={150}
                        borderPadding={20}
                        borderColor={'#fff'}
                        textColor={'#EADDCA'}
                    />
                    <AppButton
                        text="Manually Add"
                        onPress={() => router.push({
                            pathname: '/new',
                            params: { listType: activelist === 'first' ? 'pantry' : 'grocery'}
                        })}
                        isFullWidth={false}
                        width={150}
                        borderPadding={20}
                        borderColor={'#fff'}
                        textColor={'#EADDCA'}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#EADDCA',
        padding: 16,
        paddingBottom: 80,
        gap: 16,
        width: '100%',

    },
    listContainer: {
        flex: 2,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 16,
        //width: '100%',
        //allignSelf: 'center',
        marginVertical: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingBottom: 5,
    },
    listItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#b45309',
    },
    listExampleText: {
        color: '#b45309',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listHeaderText: {
        color: '#b45309',
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
        paddingBottom: 10,
    },
    listItem: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingEnd: 15,
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '400',
        color: '#d97706',
        textAlign: 'center',
        paddingVertical: 5,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#fef3c7',
    },
    emptyList: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#b45309',
    },
    title: {
        alignSelf: 'center',
        paddingTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#b45309',
        marginBottom: 8,
    },
    subtitle: {
        alignItems: 'center',
        fontSize: 14,
        fontWeight: '600',
        color: '#d97706',
        textAlign: 'center',
        paddingBottom: 10,
    },
});

export default List;

