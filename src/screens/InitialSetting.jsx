import React, { useState } from 'react';
import {
  StatusBar, StyleSheet, TextInput, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen() {
  const [id, setID] = useState('');
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

      <View style={styles.centeredView}>
        <TextInput
          onChangeText={(text) => setID(text)}
          placeholder="ID"
          style={styles.input}
          value={id}
        />

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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: appStyles.app.paddingHorizontal,
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
