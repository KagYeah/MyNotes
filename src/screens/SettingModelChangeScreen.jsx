import React, { useContext } from 'react';
import {
  ImageBackground, ScrollView, StyleSheet, Text, View,
} from 'react-native';

import { BackgroundImageContext, ThemeContext } from '../contexts';
import ListItem from '../components/ListItem';
import { appStyles } from '../style';

export default function SettingModelChangeScreen() {
  const { backgroundImage } = useContext(BackgroundImageContext);
  const { theme } = useContext(ThemeContext);

  const message = `現在、「test@example.com」でログイン中です。

機種変更する際は、「データをアップロード」でバックアップを取り、新しい端末で、「データをダウンロード」してください。機種変更にはログインする必要があります。

データをダウンロードすると、前のデータは消てしまいます。ご注意ください。`;

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <ScrollView>
          <ListItem
            title="データをアップロード"
            onPress={() => {}}
            style={styles(theme).listItem}
          />

          <ListItem
            title="データをダウンロード"
            onPress={() => {}}
            style={styles(theme).listItem}
          />

          <View style={styles(theme).description}>
            <Text style={styles(theme).text}>{message}</Text>
          </View>
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
  listItem: {
    fontSize: 18,
    height: 48,
  },
  description: {
    padding: 24,
  },
  text: {
    fontSize: appStyles(theme).body.fontSize,
    lineHeight: appStyles(theme).body.lineHeight,
  },
});
