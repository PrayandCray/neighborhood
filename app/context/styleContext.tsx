import React, { createContext, useContext, useState } from "react";

type StyleContextType = {
    changeBackgroundColor: () => Promise<void>;
    activeStyle: string;
};

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export const StyleProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeStyle, setActiveStyle] = useState('dark');

    const changeBackgroundColor = async () => {
        setActiveStyle(prev => (prev === 'dark' ? 'light' : 'dark'));
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
};
