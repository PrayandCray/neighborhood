import React, {JSX, useState } from 'react';
import {View, Text, Pressable,} from 'react-native';

const tabs = ['tab1', 'tab2'] as const;
type TabKey = typeof tabs[number];

export default function Tabs(): JSX.Element {
    const [activeTab, setActiveTab] = useState<TabKey>(tabs[0]);

    const getTabContent = (tab: TabKey) => {
        switch (tab) {
            case 'tab1': return 'Tab 1 content';
            case 'tab2': return 'Tab 2 content';
            default: return '';
        }
    };

    return (
        <View className={"p-4"}>
            <View className={"flex-col border-b border-gray-300"}>
                {tabs.map((tab, index) => (
                    <Pressable
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        className={
                            activeTab === tab ? "border-b-2 border-blue-500" : "border-b-2 border-transparent"
                        }
                    >
                        <Text className={"text-center text-sm text-gray-800"}>Tab {index + 1}</Text>
                    </Pressable>
                ))}
            </View>

            <View className={"mt-4"}>
                <Text className={"text-base text-gray-700"}>
                    {getTabContent(activeTab)}
                </Text>
            </View>
        </View>
    );
}