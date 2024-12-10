import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BarcodeScanner from 'react-native-barcode-scanner-google';
import RNFS from 'react-native-fs';

const App = () => {
    const [barcodes, setBarcodes] = useState([]);

    const saveToFile = async (data) => {
        try {
            const path = `${RNFS.DocumentDirectoryPath}/scanned_barcodes.txt`;
            const content = data.join('\n');
            await RNFS.writeFile(path, content, 'utf8');
            console.log(`Файл сохранен по пути: ${path}`);
        } catch (error) {
            console.error('Ошибка при сохранении файла:', error);
        }
    };

    const onBarcodeRead = (event) => {
        const { data } = event;
        if (!barcodes.includes(data)) {
            const updatedBarcodes = [...barcodes, data];
            setBarcodes(updatedBarcodes);
            saveToFile(updatedBarcodes);
        }
    };

    return (
        <View style={styles.container}>
            <BarcodeScanner
                style={StyleSheet.absoluteFill}
                onBarcodeRead={onBarcodeRead}
            />
            <View style={styles.barcodeList}>
                {barcodes.map((barcode, index) => (
                    <Text key={index} style={styles.barcodeText}>
                        {barcode}
                    </Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    barcodeList: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 10,
    },
    barcodeText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default App;