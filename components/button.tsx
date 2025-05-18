import React from 'react';
import { StyleSheet, Pressable, Text, PressableProps} from 'react-native';

interface AppButtonProps {
    text: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
    text,
    onPress,
    variant = 'primary',
    disabled = false
}) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                pressed && styles.pressed,
                disabled && styles.disabled
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[
                styles.primaryText,
                styles[`${variant}Text`]
            ]}>
                {text}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120
    },
    primary: {
        backgroundColor: '#b45309',
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#b45309',
    },
    pressed: {
        opacity: 0.8
    },
    disabled: {
        opacity: 0.5
    },
    primaryText: {
        color: '#fff'
    },
    secondaryText: {
        color: '#b45309'
    },
});

export default AppButton;