import { auth, db } from "@/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import AppButton from "../components/button";
import { UseItems } from "./context/ItemContext";

function Signup() {
    const router = useRouter();

    const { isAuthenticated } = UseItems();
    useEffect(() => {
        if (isAuthenticated) router.replace('/(tabs)/Home');
    }, [isAuthenticated]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    const handleSignup = async () => {
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;

            // Save additional data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
            });
            const itemsCollectionRef = collection(db, "users", user.uid, "items");
            await setDoc(doc(itemsCollectionRef, "initial"), {
                createdAt: new Date().toISOString(),
            });

            console.log("User registered:", user.email);
            router.push('/(tabs)/Home');
        } catch (error) {
            if (error instanceof Error) {
                console.error("Signup error:", error.message);
                alert("Signup failed: " + error.message);
            } else {
                console.error("Unexpected signup error:", error);
                alert("An unexpected error occurred.");
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <TouchableWithoutFeedback 
            onPress={() => {
                if (Platform.OS !== 'web') {
                    Keyboard.dismiss();
                }
            }}
        >
            <LinearGradient
                colors={['#E2E2E2', '#B39171', '#843F00']}
                style={styles.container}
            >
                <SafeAreaView style={{ flex: 1, alignItems: 'center', width: '100%' }}>

                    <Text style={[styles.title, {paddingTop: '10%'}]}>
                        Sign Up
                    </Text>

                    <Text style={styles.subtitle}>
                        Welcome to Shelfie! Please sign up to get started.
                    </Text>

                    <View style={{ width: '100%', paddingBottom: '5%'}}>
                        <Text style={styles.descriptionText}>
                            Enter your Email
                        </Text>

                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            placeholder=" (e.g. johndoe@gmail.com)"
                            placeholderTextColor={'lightgray'}
                        />
                    </View>

                    <View style={{ width: '100%'}}>
                        <Text style={styles.descriptionText}>
                            Create a password
                        </Text>

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry={true}
                            placeholder=" (e.g. password123)"
                            placeholderTextColor={'lightgray'}
                        />
                    </View>

                    <View>
                        <AppButton
                            onPress={() => router.push('/login')}
                            isFullWidth={true}
                            text={'Already have an account? Log In'}
                            backgroundColor={'transparent'}
                            fontSize={10}
                            fontWeight={'200'}
                        />
                    </View>

                    <View>
                        <AppButton
                            onPress={handleSignup}
                            text={'Sign Up'}
                            fontWeight={'600'}
                        />
                    </View>

                </SafeAreaView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#EADDCA',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#843F00',
        marginBottom: 20,
    },

    subtitle: {
        width: '90%',
        fontSize: 16,
        color: '#843F00',
        marginBottom: 40,
        textAlign: 'center',
    },

    descriptionText: {
        width: '90%',
        fontSize: 13,
        color: '#843F00',
        alignSelf: 'center',
        fontWeight: '600',
    },

    input: {
        alignSelf: 'center',
        width: '90%',
        height: 44,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 10,
        textAlignVertical: 'center',
        zIndex: 0
    },

})

export default Signup;