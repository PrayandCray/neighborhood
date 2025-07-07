import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const api_key = 'AIzaSyBB-iMgmr-MH9VY_yeajGJJYUe5UyGxZOE';

const SpeechAddScreen = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recordingRef = useRef<Audio.Recording | null>(null);

    const startRecording = async () => {
        try {
            setTranscript('');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            await recording.startAsync();
            recordingRef.current = recording;
            setIsRecording(true);
        } catch (err) {
            alert('Could not start recorting' + err)
        }
    };

    const stopRecording = async () => {
        setIsRecording(false);
        try {
            const recording = recordingRef.current;
            if (!recording) return;
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            if (uri) {
                await sendToGoogle(uri)
            }
            recordingRef.current = null;
            } catch (err) {
                alert('Could not stop recording' + err)
            }
    };

     const fileToBase64 = async (uri: string) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.toString().split(',')[1] || '');
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const sendToGoogle = async (uri: string) => {
        setTranscript('Transcribing...');
        const audioBase64 = await fileToBase64(uri);
        const body = {
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 44100,
                languageCode: 'en-US',
            },
            audio: {
                content: audioBase64,
            },
        };
        try {
            const response = await fetch(
                `https://speech.googleapis.com/v1/speech:recognize?key=${api_key}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                }
            );
            const data = await response.json();
            const text = data.results?.[0]?.alternatives?.[0]?.transcript || 'No speech recognized.';
            setTranscript(text);
        } catch (err) {
            setTranscript('Transcription failed.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.instructions}>
                Tap the Microphone and say what the item is
            </Text>
            <TouchableOpacity
                style={[styles.micButton, isRecording && styles.micButtonActive]}
                onPress={isRecording ? stopRecording : startRecording}
            >
                <Ionicons name='mic-circle' size={96} color='#fff' />
            </TouchableOpacity>
            <Text style={styles.transcript}>{transcript}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EADDCA' },
    instructions: { fontSize: 18, marginBottom: 24, color: '#b45309' },
    micButton: { backgroundColor: '#b45309', borderRadius: 40, padding: 24, marginBottom: 24 },
    micButtonActive: { backgroundColor: '#d97706' },
    transcript: { fontSize: 20, color: '#333' }
});

export default SpeechAddScreen;