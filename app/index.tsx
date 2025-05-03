import { Text, View, SafeAreaView} from "react-native";
import SimpleTabs from "../components/tabs";

export default function Index() {
  return (

    <SafeAreaView className="flex-1 p-4 justify-center">
        <View>
            <Text className={"text-5xl text-blue-500 font-bold text-center justify-center"}>welcome to shelfie</Text>
            <Text className={"text-2xl text-blue-400 text-center justify-center"}>this is a test</Text>
        </View>
        <SimpleTabs />
    </SafeAreaView>
  );
}