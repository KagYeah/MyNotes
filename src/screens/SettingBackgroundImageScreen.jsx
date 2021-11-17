import React, { useContext, useEffect } from 'react';
import {
  Alert, ImageBackground, Platform, ScrollView, View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import ListItem from '../components/ListItem';

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

    if (!result.cancelled) {
      try {
        await AsyncStorage.setItem('@background_image', result.uri);
        setBackgroundImage(result.uri);
      } catch {
        Alert.alert('画像の設定に失敗しました。');
      }
    }
  }

  async function deleteImage() {
    try {
      await AsyncStorage.setItem('@background_image', 'null');
      setBackgroundImage('null');
    } catch (error) {
      Alert.alert('画像の削除に失敗しました。');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <ScrollView>
          <ListItem
            title="画像をアップロード"
            onPress={pickImage}
            style={{
              color: '#39f',
              fontSize: 18,
              height: 48,
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
              color: '#f00',
              fontSize: 18,
              height: 48,
            }}
          />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}
