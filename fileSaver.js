// const [path, setPath] = useState('')
// useEffect(() => {
//     const getDirectory = async () => {
//         const {directoryUri} = await StorageAccessFramework.requestDirectoryPermissionsAsync()
//         setPath(directoryUri)
//     }
//     getDirectory()
// }, []);


// useEffect(() => {
//     const saveFile = async () => {
//         try {
//             // Get the directory uri that was approved
//             let data = file
//             // Create file and pass it's SAF URI
//             await StorageAccessFramework.createFileAsync(
//                 path,
//                 "barcodes",
//                 "text/plain"
//             )
//                 .then(async (fileUri) => {
//                     // Save data to newly created file
//                     await FileSystem.writeAsStringAsync(fileUri, data, {
//                         encoding: FileSystem.EncodingType.UTF8
//                     })
//                 })
//                 .catch((e) => {
//                     console.log(e)
//                 })
//         } catch (err) {
//             console.warn(err)
//         }
//     }
//     const intervalID = setInterval(saveFile, 30000)
//     return () => clearInterval(intervalID)
// }, [file]);