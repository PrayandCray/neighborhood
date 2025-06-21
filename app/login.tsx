import { auth } from "@/firebaseConfig";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { Keyboard, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import AppButton from "../components/button";

function Login() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            
            console.log("User logged in:", userCredential.user.email);
            router.push('/(tabs)/Home');
        } catch (error) {
            if (error instanceof Error) {
                console.error("Login error:", error);
                setError('Invalid email or password');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
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
                        Log In
                    </Text>

                    <Text style={styles.subtitle}>
                        Welcome back to Shelfie! Please log in to continue.
                    </Text>

                    <View style={{ width: '100%', paddingBottom: '5%'}}>
                        <Text style={styles.descriptionText}>
                            Enter your Email
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'lightgray'}
                            placeholder=" Email"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <Text style={styles.descriptionText}>
                            Enter your Password
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholderTextColor={'lightgray'}
                            placeholder=" Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <View style={{ width: '100%', alignItems: 'center'}}>
                            <View>
                                <AppButton
                                    onPress={() => router.push('/signup')}
                                    text={'Don\'t have an account? Sign Up'}
                                    isFullWidth={true}
                                    backgroundColor={'transparent'}
                                    fontSize={10}
                                    fontWeight={'200'}
                                />
                            </View>

                            <View>
                                <AppButton
                                    onPress={() => handleLogin()}
                                    text={'Log In'}
                                    fontWeight={'600'}
                                />
                            </View>
                        </View>

                    </View>
                </SafeAreaView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
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
        height: 40,
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#b45309',
        borderRadius: 10,
    },

})

export default Login;