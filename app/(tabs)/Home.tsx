import Appwrapper from "@/components/appwrapper";
import AppButton from "@/components/button";
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UseItems } from "../context/ItemContext";
import { useStyle } from "../context/styleContext";

const Home = () => {
    const {changeBackgroundColor, activeStyle} = useStyle()
    const {resetData} = UseItems();

    console.log('Home screen rendered');
    const router = useRouter();

    const handleAddNewPantryItem = () => {
        router.push({
            pathname: "/(tabs)/List",
            params: { initialList: 'first' }
        });
        setTimeout(() => {
            router.push({
                pathname: '/new',
                params: { listType: 'pantry' }
            });
        }, 150);
    };

    const handleAddNewGroceryItem = () => {
        router.push({
            pathname: "/(tabs)/List",
            params: { initialList: 'second' }
        });
        setTimeout(() => {
            router.push({
                pathname: '/new',
                params: { listType: 'grocery' }
            });
        }, 150);
    };

    return (

        <Appwrapper>
            <Text style={styles.title}>
                Welcome to Shelfie
            </Text>
            <Text style={styles.subtitle}>
                An app that helps you keep track of your shelves, pantries and everything else!
            </Text>
            <View style={styles.shortcutsContainer}>
                <AppButton
                    text="Add New Item to Pantry"
                    onPress={handleAddNewPantryItem}
                    isFullWidth={false}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />
                <AppButton
                    text="Add New Item to Grocery"
                    onPress={handleAddNewGroceryItem}
                    isFullWidth={false}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />
            </View>
            <View style={[styles.shortcutsContainer, {marginTop: 16}]}>
                <AppButton
                    text='Scan Item'
                    onPress={() => {
                        router.push('/List'),
                        setTimeout(() => {
                            router.push('/scan')
                        }, 150)
                    }}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />
                <AppButton
                    text='Share List'
                    onPress={() => {
                        router.push('/share_list')
                        }}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />
            </View>
            <View style={{paddingTop: 15, alignSelf: 'center', flexDirection: 'row', paddingHorizontal: 5}}>
                <AppButton
                    text='Toggle Light Mode'
                    onPress={() => {changeBackgroundColor()}}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />
                <AppButton
                    text='Scan Reciept'
                    onPress={() => {router.push('/reciept_scan')}}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />
            </View>
            <View style={{ alignSelf: "center", paddingTop: '70.5%'}}>
                <AppButton
                    text='Reset Data'
                    onPress={resetData}
                    borderColor={'#fff'}
                    textColor={'#EADDCA'}
                />
            </View>
        </Appwrapper>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    shortcutsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#b45309',
        marginBottom: 8,
        marginTop: '20%',
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#d97706',
        textAlign: 'center',
        maxWidth: '80%',
        alignSelf: 'center',
        marginBottom: 16,
    },
});

export default Home;