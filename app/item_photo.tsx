import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TakePhotoScreen = () => {

    type Origin = '/new' | '/edit';

    const origin = useLocalSearchParams().origin as Origin;
    const {listType} = useLocalSearchParams();

    if (origin !== '/new' && origin !== '/edit') {
        Alert.alert('Unknown origin!');
        return;
    }


    const router = useRouter()
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const cameraRef = useRef<any>(null);
    const [isTakingPhoto, setIsTakingPhoto] = useState(false);

    if (!permission) {
        return <Text>Requesting camera permissions...</Text>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Camera permission is required.</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                    <Text style={styles.permissionText}>Grant Camera Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePhoto = async () => {
        if (!cameraRef.current || isTakingPhoto) return;

        try {
            setIsTakingPhoto(true);
            const photo = await cameraRef.current.takePictureAsync();
            console.log('Photo taken:', photo.uri);
            Alert.alert('Photo Taken', `Saved to: ${photo.uri}`);
            router.push({
                pathname: origin,
                params: {photouri: photo.uri, listType: listType}
            })
            console.log(listType)
            setIsTakingPhoto(false);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Could not take photo.');
            setIsTakingPhoto(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
            />
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
                    <Ionicons name="camera-reverse" size={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
                    <Ionicons name="camera" size={32} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TakePhotoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    captureButton: {
        backgroundColor: '#b45309',
        padding: 14,
        borderRadius: 50,
    },
    permissionButton: {
        marginTop: 20,
        backgroundColor: '#b45309',
        padding: 10,
        borderRadius: 10,
    },
    permissionText: {
        color: '#fff',
        fontWeight: '600',
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
});
