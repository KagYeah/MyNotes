import React, { useContext, useEffect } from 'react';
import {
  Alert, ImageBackground, Platform, ScrollView, StyleSheet, View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalContext } from '../contexts';
import ListItem from '../components/ListItem';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen() {
  const { theme, backgroundImage, setBackgroundImage } = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('写真ライブラリへのアクセスを許可してください。');
        }
      }
    })();
  }, []);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      try {
        await AsyncStorage.setItem('@background_image', result.uri);
        setBackgroundImage(result.uri);
      } catch (error) {
        console.log(error);
        Alert.alert('画像の設定に失敗しました。');
      }
    }
  }

  async function deleteImage() {
    try {
      await AsyncStorage.setItem('@background_image', 'null');
      setBackgroundImage('null');
    } catch (error) {
      console.log(error);
      Alert.alert('画像の削除に失敗しました。');
    }
  }

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <ScrollView>
          <ListItem
            title="画像をアップロード"
            onPress={pickImage}
            style={{
              color: appStyles(theme).uploadButton.color,
              fontSize: appStyles(theme).uploadButton.fontSize,
              height: appStyles(theme).uploadButton.height,
            }}
          />

          <ListItem
            title="画像を削除"
            onPress={() => {
              Alert.alert(
                '背景画像を削除します。',
                '本当によろしいですか？',
                [
                  {
                    text: 'キャンセル',
                    style: 'cancel',
                  },
                  {
                    text: '削除',
                    onPress: deleteImage,
                    style: 'destructive',
                  },
                ],
              );
            }}
            style={{
              color: appStyles(theme).deleteButton.color,
              fontSize: appStyles(theme).uploadButton.fontSize,
              height: appStyles(theme).uploadButton.height,
            }}
          />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
});
