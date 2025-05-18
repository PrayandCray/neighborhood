import {Tabs} from "expo-router";

export default function _layout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    paddingTop: 10,
                    backgroundColor: '#EADDCA'
                }
            }}>
        </Tabs>
    )
}