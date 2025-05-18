import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';

interface AppButtonProps {
    text: string;
    onPress: () => void;
    disabled?: boolean;
    size?: number;
    borderWidth?: number;
    borderColor?: string;
    textColor?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
    text,
    onPress,
    disabled = false,
    size = 200,
    borderColor,
    borderWidth = 10,
    textColor,
}) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.buttonContainer,
                {
                    width: size,
                    height: size,
                    padding: borderWidth,
                    backgroundColor: borderColor || '#fff'
                },
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}
        >
            <View
                style={[
                    styles.button,
                    {
                        width: size,
                        height: size,
                    }
                ]}
            >
                <Text style={[
                    styles.text,
                    textColor && { color: textColor }
                ]}>
                    {text}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
});

export default AppButton;