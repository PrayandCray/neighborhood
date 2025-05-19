import React from 'react';
import AppButton from "@/components/button";
import {SafeAreaView, View, Text, StyleSheet} from 'react-native';

const List = () => {
    const [activelist, setActiveList] = React.useState<'first' | 'second'>('first');

    const renderListContent = () => {
        if (activelist === 'first') {
            return (
                <View style={styles.listContainer}>
                    <Text style={styles.listExampleText}>My Pantry</Text>
                    {/*insert list items here*/}
                </View>
            );
        } else {
            return (
                <View style={styles.listContainer}>
                    <Text style={styles.listExampleText}>Grocery List</Text>
                    {/*insert list items here*/}
                </View>

            )
        }
    }

    return (
        <SafeAreaView style={styles.container}>
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
                    width={150}
                    borderPadding={20}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />

                <AppButton
                    text='Grocery List'
                    onPress={() => setActiveList('second')}
                    width={150}
                    borderPadding={10}
                    borderColor={activelist === 'first' ? '#b45309' : '#fff'}
                    textColor={'#EADDCA'}
                />
            </View>

            {renderListContent()}

            <AppButton
                text="Add Item"
                onPress={() => console.log('pressed')}
                isFullWidth={false}
                width={85}
                borderPadding={20}
                borderColor={'#fff'}
                textColor={'#EADDCA'}
            />

        </SafeAreaView>
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
        gap: 16,
        width: '100%',
    },
    listContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
    listExampleText: {
        color: '#b45309',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title: {
        paddingTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#b45309',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#d97706',
        textAlign: 'center',
    },
});

export default List;