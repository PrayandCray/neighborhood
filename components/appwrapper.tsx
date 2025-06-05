import { View, Platform, StyleSheet} from 'react-native';
import React from "react";

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <View style={styles.wrapper}>
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