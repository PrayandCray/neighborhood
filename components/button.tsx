import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface AppButtonProps {
    text: string;
    onPress: () => void;
    disabled?: boolean;
    width?: number;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    fontFace?: boolean;
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
    borderPadding,
    textColor,
    backgroundColor,
    fontSize,
    fontWeight,
}) => {
    const buttonWidthStyle = isFullWidth
    ? {}
    : { width : width };
    // @ts-ignore
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
                    fontSize ? { fontSize: fontSize } : undefined,
                    fontWeight ? { fontWeight: fontWeight } : { fontWeight: 'bold' },
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
        overflow: 'hidden',
        padding: Platform.select
        ({
            ios: 12,
            android: 8,
            web: 0,
        }),
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#b45309',
    },
    primary: {
        backgroundColor: 'transparent',
    },
    pressed: {
        opacity: 0.8
    },
    disabled: {
        opacity: 0.5
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AppButton;