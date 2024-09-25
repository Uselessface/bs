import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as FileSystem from 'expo-file-system';
import {StorageAccessFramework} from "expo-file-system";

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [file, setFile] = useState('');
    const [path, setPath] = useState('')
    const today = new Date();
    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    useEffect(() => {
        const getDirectory = async () =>{
            const {directoryUri} = await StorageAccessFramework.requestDirectoryPermissionsAsync()
            setPath(directoryUri)
        }
        getDirectory()
    }, [])

    useEffect(() => {
        const saveFile = async () => {
            try {
                // Get the directory uri that was approved
                let data = file
                // Create file and pass it's SAF URI
                await StorageAccessFramework.createFileAsync(
                    path,
                    "barcodes",
                    "text/plain"
                )
                    .then(async (fileUri) => {
                        // Save data to newly created file
                        await FileSystem.writeAsStringAsync(fileUri, data, {
                            encoding: FileSystem.EncodingType.UTF8
                        })
                    })
                    .catch((e) => {
                        console.log(e)
                    })

            } catch (err) {
                console.warn(err)
            }
        }

        const intervalID = setInterval(saveFile, 30000)

        return () => clearInterval(intervalID)
    }, [file])


    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        setDataArray([...dataArray, `${today.toLocaleString()} : Штрихкод  ${data}`])
        setFile(dataArray.join('; \n'))
        setTimeout(setScanned, 500, false)
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
