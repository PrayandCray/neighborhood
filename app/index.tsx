import { Redirect } from 'expo-router'

const StartPage = () => {
    const isSignedIn = false; // TODO: Replace with actual auth logic
    if (isSignedIn) {
        return <Redirect href="/(tabs)/Home" />;
    } else {
        return <Redirect href="/signup"/>;
    }
};

export default StartPage;