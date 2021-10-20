import React, { useState } from 'react';
import {
  StatusBar, StyleSheet, TextInput, View,
} from 'react-native';

import Button from '../components/Button';
import { appStyles } from '../style';

export default function InitialSettingScreen(props) {
  const { navigation } = props;
  const [id, setID] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

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
          label="はじめる"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Root', params: { screen: 'Home' } }],
            });
          }}
          color={appStyles.buttonMedium.color}
          style={styles.submit}
          height={appStyles.buttonMedium.height}
          width={appStyles.buttonMedium.width}
          linearGradient
          options={{ colors: appStyles.buttonMedium.gradientColors }}
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
    marginTop: appStyles.idPasswordInput.margin,
  },
  submit: {
    alignSelf: 'center',
    marginTop: appStyles.buttonMedium.margin,
  },
});
