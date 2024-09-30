import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import axios from 'axios';


export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [file, setFile] = useState('');
    const url = 'http://192.168.0.229:3351'
    const today = new Date();


    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };
        getBarCodeScannerPermissions();
    }, []);

    useEffect(() => {
        const uploadFile = async () => {
            alert(file)
            try {
                await axios.post(url, file,{
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                }
                        })
            } catch (err) {
                console.warn(err)
            }
        }
        const intervalID = setInterval(uploadFile, 10000)
        return () => clearInterval(intervalID)
    }, [file]);

    useEffect(() => {
        setFile(dataArray.join('; \n'))
    }, [dataArray]);

    const handleBarCodeScanned = ({data}) => {
        setScanned(true);
        setDataArray([...dataArray, `${today.toLocaleString()} : Штрихкод  ${data}`])
        setTimeout(() => setScanned(false), 500)
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
