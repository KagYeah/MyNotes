import React, { useContext, useState } from 'react';
import {
  ScrollView, StatusBar, StyleSheet, Text, TextInput, View,
} from 'react-native';

import { ThemeContext } from '../contexts';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen(props) {
  const { theme } = useContext(ThemeContext);
  const { navigation } = props;
  const message = `あなたのIDは「abc123」です。以下でパスワードを設定し、ID・パスワードを大事に保管してください。

設定が完了して24時間以内に、機種変更後の端末にデータを移行してください。データの移行は、本アプリ初回起動時に「機種変更」ボタンを押してから行ってください。`;

  const [password, setPassword] = useState('');

  return (
    <View style={styles(theme).container}>
      <StatusBar barStyle={appStyles(theme).statusbar.barStyle} />

      <ScrollView style={styles(theme).scroll}>
        <Text style={styles(theme).description}>{message}</Text>

        <TextInput
          onChangeText={(text) => setPassword(text)}
          placeholder="パスワード"
          style={styles(theme).input}
          value={password}
        />

        <Button
          label="設定"
          onPress={() => {
            navigation.goBack();
          }}
          color={appStyles(theme).buttonMedium.color}
          style={styles(theme).submit}
          height={appStyles(theme).buttonMedium.height}
          width={appStyles(theme).buttonMedium.width}
          linearGradient
          options={{ colors: appStyles(theme).buttonMedium.gradientColors }}
        />
      </ScrollView>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: appStyles(theme).app.paddingHorizontal,
    paddingVertical: appStyles(theme).app.paddingVertical,
  },
  description: {
    fontSize: appStyles(theme).body.fontSize,
    lineHeight: appStyles(theme).body.lineHeight,
  },
  input: {
    borderColor: appStyles(theme).idPasswordInput.borderColor,
    borderWidth: appStyles(theme).idPasswordInput.borderWidth,
    fontSize: appStyles(theme).idPasswordInput.fontSize,
    height: appStyles(theme).idPasswordInput.height,
    padding: appStyles(theme).idPasswordInput.padding,
    marginTop: appStyles(theme).idPasswordInput.margin,
  },
  submit: {
    alignSelf: 'center',
    marginTop: appStyles(theme).buttonMedium.margin,
  },
});
