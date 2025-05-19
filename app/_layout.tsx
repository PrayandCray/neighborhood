import { Stack } from "expo-router";
import "./globals.css"

export default function StackLayout(){
  return(
    <Stack
        screenOptions={{
            animation: 'slide_from_bottom',
            headerStyle: {backgroundColor: '#b45309',},
            headerTintColor: '#EADDCA',
        }}
    >
      <Stack.Screen
          name="(tabs)"
          options={{headerShown: false,}}
      />

        <Stack.Screen
        name="New"
        options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerTitle: 'New Item',
            headerStyle: {backgroundColor: '#EADDCA',},
            headerTintColor: '#b45309',
        }}
        />

    </Stack>
  )
}