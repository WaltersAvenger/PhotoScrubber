import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Button } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { launchImageLibrary, ImageLibraryOptions } from "react-native-image-picker"
import ExifReader from "exifreader"
import RNFS from "react-native-fs"
import { decode } from "base64-arraybuffer"

interface UploadScreenProps extends AppStackScreenProps<"Upload"> {}

export const UploadScreen: FC<UploadScreenProps> = observer(function UploadScreen() {
  async function callback(result: any) {
    console.log(result)

    for (const asset of result.assets) {
      const b64Buffer = await RNFS.readFile(asset.uri, "base64") // Where the URI looks like this: "file:///path/to/image/IMG_0123.HEIC"
      const fileBuffer = decode(b64Buffer)
      const tags = ExifReader.load(fileBuffer, { expanded: true })
      console.log(tags)
    }
  }

  async function launchCam() {
    const options: ImageLibraryOptions = {
      includeExtra: true,
      mediaType: "photo",
    }

    launchImageLibrary(options, callback)
  }

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Button text="This is the button" onPress={launchCam} />
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}
