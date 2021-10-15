import React, { useState } from 'react';
import {
  ScrollView, StatusBar, StyleSheet, Text, TextInput, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen() {
  const message = `あなたのIDは「abc123」です。以下でパスワードを設定し、ID・パスワードを大事に保管してください。

設定が完了して24時間以内に、機種変更後の端末にデータを移行してください。データの移行は、本アプリ初回起動時に「機種変更」ボタンを押してから行ってください。`;

  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <AppBar
        title="機種変更"
        left={(
          <Button
            label="<戻る"
            onPress={() => {}}
            backgroundColor={appStyles.appbarButton.backgroundColor}
            color={appStyles.appbarButton.color}
          />
        )}
      />

      <ScrollView style={styles.scroll}>
        <Text style={styles.description}>{message}</Text>

        <TextInput
          onChangeText={(text) => setPassword(text)}
          placeholder="パスワード"
          style={styles.input}
          value={password}
        />

        <Button
          label="設定"
          onPress={() => {}}
          color={appStyles.button.color}
          style={styles.submit}
          height={appStyles.button.height}
          width={80}
          linearGradient
          options={{ colors: appStyles.button.gradientColors }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: appStyles.app.paddingHorizontal,
    paddingVertical: appStyles.app.paddingVertical,
  },
  description: {
    fontSize: appStyles.body.fontSize,
    lineHeight: appStyles.body.lineHeight,
  },
  input: {
    borderColor: appStyles.idPasswordInput.borderColor,
    borderWidth: appStyles.idPasswordInput.borderWidth,
    fontSize: appStyles.idPasswordInput.fontSize,
    height: appStyles.idPasswordInput.height,
    padding: appStyles.idPasswordInput.padding,
    marginTop: 24,
  },
  submit: {
    alignSelf: 'center',
    marginTop: 24,
  },
});
