import { Stack } from "expo-router";
import "./globals.css"

export default function StackLayout(){
  return(
    <Stack screenOptions={{headerShown: false,}}>
      <Stack.Screen name="(tabs)"/>
    </Stack>
  )
}