import { useStyle } from "@/app/context/styleContext";
import React from "react";
import { Platform, StyleSheet, View } from 'react-native';

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {changeBackgroundColor, activeStyle} = useStyle();

    return (
        <View style={[
            styles.wrapper,
            { backgroundColor: activeStyle === 'dark' ? '#000' : '#fff' }
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        transform: Platform.OS === 'web' ? [{ scale: 0.95 }] : [],
        maxWidth: Platform.OS === 'web' ? 1200 : '100%',
        width: Platform.OS === 'web' ? '90%' : '100%',
        alignSelf: 'center',
    }
});

export default AppWrapper;