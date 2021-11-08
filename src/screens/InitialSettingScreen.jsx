import React, { useContext, useState } from 'react';
import {
  ImageBackground, StyleSheet, TextInput, View,
} from 'react-native';

import { BackgroundImageContext, ThemeContext } from '../contexts';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function InitialSettingScreen(props) {
  const { backgroundImage } = useContext(BackgroundImageContext);
  const { theme } = useContext(ThemeContext);

  const { navigation } = props;
  const [id, setID] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <View style={styles(theme).centeredView}>
          <TextInput
            onChangeText={(text) => setID(text)}
            placeholder="ID"
            style={styles(theme).input}
            value={id}
          />

          <TextInput
            onChangeText={(text) => setPassword(text)}
            placeholder="パスワード"
            style={styles(theme).input}
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
            color={appStyles(theme).buttonMedium.color}
            style={styles(theme).submit}
            height={appStyles(theme).buttonMedium.height}
            width={appStyles(theme).buttonMedium.width}
            linearGradient
            options={{ colors: appStyles(theme).buttonMedium.gradientColors }}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: appStyles(theme).app.paddingHorizontal,
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
