import { View, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import AppButton from "../components/button";
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

function Login() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;

            console.log("User logged in:", user.email);
            router.push('/(tabs)/Home');
        } catch (error) {
            if (error instanceof Error) {
                console.error("Login error:", error.message);
                alert("Login failed: " + error.message);
            } else {
                console.error("Unexpected login error:", error);
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
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
                        placeholder="Email"
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
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <View style={{ width: '100%', paddingBottom: '5%', alignItems: 'center'}}>
                        <View style={{paddingTop: '1%'}}>
                            <AppButton
                                onPress={() => router.push('/signup')}
                                text={'Don\'t have an account? Sign Up'}
                                width={'100%'}
                                backgroundColor={'transparent'}
                                fontSize={10}
                                fontWeight={'200'}
                            />
                        </View>

                        <View style={{paddingTop: '5%'}}>
                            <AppButton
                                onPress={() => handleLogin()}
                                text={'Log In'}
                                fontWeight={'200'}
                            />
                        </View>
                    </View>

                </View>
            </SafeAreaView>
        </LinearGradient>
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