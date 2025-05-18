import {Tabs} from "expo-router";

export default function _layout() {
    return (
        <Tabs screenOptions={{
            headerStyle: {
                height: 80
            },
            headerTitleStyle: {
                fontSize: 18,
                paddingBottom: 40,
            },
        }}>
            <Tabs.Screen name="Home"/>
            <Tabs.Screen name="List"/>
        </Tabs>
    )
}