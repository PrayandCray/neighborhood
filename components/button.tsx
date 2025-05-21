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
    backgroundColor?: string;
    fontSize?: number;
}

const AppButton: React.FC<AppButtonProps> = ({
    text,
    onPress,
    disabled = false,
    width = 120,
    isFullWidth = false,
    borderColor,
    borderPadding,
    textColor,
    backgroundColor,
    fontSize,
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
                    backgroundColor: '#b45309',
                },
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}
        >
            <View
                style={[
                    styles.button,
                    buttonWidthStyle,
                    backgroundColor && { backgroundColor: backgroundColor }
                ]}
            >
                <Text style={[
                    styles.text,
                    textColor && { color: textColor },
                    fontSize ? { fontSize: fontSize } : undefined
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
        padding: 12,
        borderRadius: 12,
    },
    button: {
        padding: 12,
        borderRadius: 12,
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