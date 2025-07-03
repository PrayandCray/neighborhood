import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

type StyleContextType = {
    changeBackgroundColor: () => Promise<void>;
    activeStyle: string;
};

const STORAGE_KEY = 'app-style-mode';
const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const StyleProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeStyle, setActiveStyle] = useState('dark');

    useEffect(() => {
        const loadStyle = async () => {
            try {
                const savedStyle = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedStyle === 'dark' || savedStyle === 'light') {
                    setActiveStyle(savedStyle)
                }
            } catch (err) {
                Alert.alert('Failed to load style from storage')
            }
        };
        loadStyle();
    }, []);

    const changeBackgroundColor = async () => {
        const newStyle = activeStyle === 'dark' ? 'light' : 'dark';
        setActiveStyle(newStyle);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, newStyle)
        } catch (err) {
            Alert.alert(`Failed to save style to storage ${err}`)
        }
    };

    return (
        <StyleContext.Provider value={{ changeBackgroundColor, activeStyle }}>
            {children}
        </StyleContext.Provider>
    );
};

export const useStyle = () => {
    const context = useContext(StyleContext);
    if (!context) {
        throw new Error("useStyle must be used within a StyleProvider");
    }
    
    return context;
}