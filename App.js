import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as IntentLauncher from "expo-intent-launcher";

export default function App() {
  const downloadDocument = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const filesDirectory = FileSystem.cacheDirectory + "ExampleFolder";
    //pdf doesnt work
    const fileSource = "http://www.africau.edu/images/default/sample.pdf";
    const fileName = "sample.pdf";
    //image works
    // const fileSource = "https://irefindex.vib.be/wiki/images/a/a9/Example.jpg";
    // const fileName = "example.jpg";

    try {
      if (status === "granted") {
        const folder = await FileSystem.getInfoAsync(filesDirectory);

        if (!folder.exists) {
          await FileSystem.makeDirectoryAsync(filesDirectory);
        }
        const download = await FileSystem.downloadAsync(
          fileSource,
          `${filesDirectory}/${fileName}`
        );
        console.log("download", download);
        console.log(
          "passing this to create asset",
          `${filesDirectory}/${fileName}`
        );
        const asset = await MediaLibrary.createAssetAsync(
          `${filesDirectory}/${fileName}`
        );
        console.log("asset", asset);

        const fileInfo = await FileSystem.getInfoAsync(
          `${filesDirectory}/${fileName}`
        );
        console.log("fileInfo", fileInfo);

        if (Platform.OS === "android") {
          FileSystem.getContentUriAsync(fileInfo.uri).then((uri) => {
            IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
              data: uri,
              flags: 1,
            });
          });
        } else {
          console.log("ios");
        }
      }
    } catch (err) {
      console.log("FS Err: ", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Click here to download pdf</Text>
      <Button title="Download" onPress={downloadDocument} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
