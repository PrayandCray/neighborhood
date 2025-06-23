import React, { useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text } from 'react-native';

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
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    const buttonWidthStyle = isFullWidth
    ? {}
    : { width : width };
    // @ts-ignore
    return (
        <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled}
            style={({ pressed }) => [
                styles.buttonContainer,
                {
                    padding: borderPadding,
                    backgroundColor: '#b45309',
                    ...(Platform.OS === 'web' ? {marginTop: 10, paddingVertical: 10, paddingHorizontal: 5} : {}),
                },
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}
        >
            <Animated.View
                style={[
                    styles.button,
                    {transform: [{ scale }]},
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
            </Animated.View>
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
        opacity: 0.5
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