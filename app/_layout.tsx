import { ItemProvider } from "@/app/context/ItemContext";
import { Stack, useRouter } from "expo-router";
import "./globals.css";

export default function StackLayout(){
    const router = useRouter();
    const isSignedIn = false; // TODO, replace w actual auth logic

  return(

      <ItemProvider>
          <Stack
              screenOptions={{
                  animation: 'slide_from_bottom',
                  headerStyle: {backgroundColor: '#b45309',},
                  headerTintColor: '#EADDCA',
                  headerShown: true,
              }}
          >

              <Stack.Screen
                  name="signup"
                  options={{
                      headerShown: false,
                  }}
              />

              <Stack.Screen
                  name="(tabs)"
                  options={{
                      headerShown: false,
                  }}
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