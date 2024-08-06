import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [file, setFile] = useState('');
    const [path, setPath] = useState(null)
    const today = new Date();
    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    useEffect(() => {
        const getDirectoryPermissions = async () => {
            const {status, directoryUri} = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
            if (status === 'granted') {
                setPath(directoryUri)
            }
        }
        getDirectoryPermissions()
    }, [])
    useEffect(() => {
        const saveFile = async () => {
            let fileUri = path + "text.txt";
            await FileSystem.writeAsStringAsync(fileUri, file, {encoding: FileSystem.EncodingType.UTF8});
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            await MediaLibrary.createAlbumAsync("Barcodes", asset, false)
        }
        const intervalID = setInterval(saveFile, 30000)
        return () => clearInterval(intervalID)
    }, [file, path])


    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        setDataArray([...dataArray, `${today.toLocaleString()} : Штрихкод ${type}  ${data}`])
        setFile(dataArray.toString())
        setTimeout(setScanned, 2000, false)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});
