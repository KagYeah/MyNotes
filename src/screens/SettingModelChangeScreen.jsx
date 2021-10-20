import React, { useState } from 'react';
import {
  ScrollView, StatusBar, StyleSheet, Text, TextInput, View,
} from 'react-native';

import Button from '../components/Button';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen(props) {
  const { navigation } = props;
  const message = `あなたのIDは「abc123」です。以下でパスワードを設定し、ID・パスワードを大事に保管してください。

設定が完了して24時間以内に、機種変更後の端末にデータを移行してください。データの移行は、本アプリ初回起動時に「機種変更」ボタンを押してから行ってください。`;

  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

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
          onPress={() => {
            navigation.goBack();
          }}
          color={appStyles.buttonMedium.color}
          style={styles.submit}
          height={appStyles.buttonMedium.height}
          width={appStyles.buttonMedium.width}
          linearGradient
          options={{ colors: appStyles.buttonMedium.gradientColors }}
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
    marginTop: appStyles.idPasswordInput.margin,
  },
  submit: {
    alignSelf: 'center',
    marginTop: appStyles.buttonMedium.margin,
  },
});
