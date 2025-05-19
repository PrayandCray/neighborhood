import {Tabs} from "expo-router";
import { Ionicons} from "@expo/vector-icons";

export default function _layout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    paddingTop: 10,
                    backgroundColor: '#EADDCA'
                },
                tabBarIcon: ({ focused, color, size }) => {
                    switch (route.name) {
                        case 'Home':
                            return <Ionicons 
                                name={focused ? 'home' : 'home-outline'}
                                size={size} 
                                color={color}
                            />;
                        case 'List':
                            return <Ionicons 
                                name={focused ? 'list' : 'list-outline'} 
                                size={size} 
                                color={color}
                            />;
                        default:
                            return <Ionicons 
                                name={focused ? "alert-circle" : "alert-circle-outline"}
                                size={size} 
                                color={color}
                            />;
                    }
                }
            })}>
            <Tabs.Screen 
                name="Home"
                options={{
                    title: 'Home'
                }}
            />
            <Tabs.Screen 
                name="List"
                options={{
                    title: 'List'
                }}
            />
        </Tabs>
    );
}