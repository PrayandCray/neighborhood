import {View, Text } from 'react-native';
import AppButton from "@/components/button";
import { useRouter } from 'expo-router';

export default function Signup() {
    const router = useRouter();

    const handleSignup = () => {
        router.push('/(tabs)/Home');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Signup Screen</Text>
            <AppButton
                onPress={handleSignup}
                text={'Sign Up'}
            />
        </View>
    )
}