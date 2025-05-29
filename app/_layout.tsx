import { ItemProvider } from "@/app/context/ItemContext";
import { Stack } from "expo-router";
import { useState } from "react";
import "./globals.css";

export default function StackLayout(){

  return(
      <ItemProvider>
          <Stack
              screenOptions={{
                  animation: 'slide_from_bottom',
                  headerStyle: {backgroundColor: '#b45309',},
                  headerTintColor: '#EADDCA',
              }}
          >
            <Stack.Screen
              name="(tabs)"
              options={
                {headerShown: false,}
          }
          />
              <Stack.Screen
                  name="new"
                  options={({
                                route,
                            }: {
                      route: { params?: { listType?: string; headerTitle?: string } }
                  }) => {
                      const listType = route.params?.listType;
                      const headerTitle = route.params?.headerTitle ||
                          (listType === 'pantry' ? 'Add to Pantry' : 'Add to Grocery List');

                      return {
                          presentation: 'modal',
                          animation: 'slide_from_bottom',
                          headerTitle: headerTitle,
                          headerTitleAlign: 'center',
                          headerStyle: {backgroundColor: '#EADDCA'},
                          headerTintColor: '#b45309',
                      };
                  }}
              />

              <Stack.Screen
                  name="edit"
                  options={({
                                route,
                            }: {
                      route: { params?: { listType?: string; headerTitle?: string } }
                  }) => {
                      const listType = route.params?.listType;
                      const headerTitle = route.params?.headerTitle ||
                          (listType === 'pantry' ? 'Edit Pantry Item' : 'Edit Grocery Item');

                      return {
                          presentation: 'modal',
                          animation: 'slide_from_bottom',
                          headerTitle: headerTitle,
                          headerTitleAlign: 'center',
                          headerStyle: {backgroundColor: '#EADDCA', textColor: '#b45309'},
                          headerTintColor: '#b45309',
                      };
                  }}
              />

          </Stack>
      </ItemProvider>
  );
}