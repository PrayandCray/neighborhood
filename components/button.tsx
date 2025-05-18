import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';

interface AppButtonProps {
    text: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    size?: number;
    borderColor?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
    text,
    onPress,
    variant = 'primary',
    disabled = false,
    size = 120,
    borderColor
}) => {
    return (
        <View style={[
            styles.buttonContainer,
            {
                width: size + 10, // Slightly larger than the button
                height: size + 10,
                backgroundColor: borderColor || '#fff'
            }
        ]}>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    styles[variant],
                    pressed && styles.pressed,
                    disabled && styles.disabled,
                    {
                        width: size,
                        height: size,
                    }
                ]}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={[
                    styles.text,
                    styles[`${variant}Text`]
                ]}>
                    {text}
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12, // Slightly larger than button borderRadius
        padding: 5, // Creates the border effect
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#b45309',
    },
    primary: {
        backgroundColor: '#b45309',
    },
    secondary: {
        backgroundColor:'#372413',
    },
    pressed: {
        opacity: 0.8
    },
    disabled: {
        opacity: 0.5
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    primaryText: {
        color: '#fff'
    },
    secondaryText: {
        color: '#b45309'
    },
});

export default AppButton;