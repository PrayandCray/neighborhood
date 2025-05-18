import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';

interface AppButtonProps {
    text: string;
    onPress: () => void;
    disabled?: boolean;
    width?: number;
    isFullWidth?: boolean;
    borderPadding?: number;
    borderColor?: string;
    textColor?: string;
}

const AppButton: React.FC<AppButtonProps> = ({
    text,
    onPress,
    disabled = false,
    width = 120,
    isFullWidth = false,
    borderColor,
    borderPadding = 10,
    textColor,
}) => {
    const buttonWidthStyle = isFullWidth
    ? {}
    : { width : width };
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.buttonContainer,
                {
                    padding: borderPadding,
                    backgroundColor: borderColor || '#fff'
                },
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}
        >
            <View
                style={[
                    styles.button,
                    buttonWidthStyle,
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
        borderRadius: 12,
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
});

export default AppButton;