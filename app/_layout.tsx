import { Stack } from "expo-router";
import "./globals.css"
import {ItemProvider} from "@/app/context/ItemContext";

export default function StackLayout(){
  return(
      <ItemProvider>
          <Stack
              screenOptions={{
                  animation: 'slide_from_bottom',
                  headerStyle: {backgroundColor: '#b45309',},
                  headerTintColor: '#EADDCA',
              }}
          ><Stack.Screen
              name="(tabs)"
              options={{headerShown: false,}}
          />
              <Stack.Screen name="new" options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                  headerTitle: 'New Item',
                  headerStyle: {backgroundColor: '#EADDCA',},
                  headerTintColor: '#b45309',
              }}
              />
          </Stack>
      </ItemProvider>
  );
}