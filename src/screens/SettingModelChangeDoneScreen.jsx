import React, { useContext } from 'react';
import {
  ImageBackground, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { StackActions } from '@react-navigation/native';

import { BackgroundImageContext, ThemeContext } from '../contexts';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen(props) {
  const { backgroundImage } = useContext(BackgroundImageContext);
  const { theme } = useContext(ThemeContext);

  const { navigation } = props;
  const message = 'すでにID「abc123」で設定しています。設定し直す場合は、以下の「再設定」ボタンを押してください。';

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        <ScrollView style={styles(theme).scroll}>
          <Text style={styles(theme).description}>{message}</Text>

          <Button
            label="再設定"
            onPress={() => {
              navigation.dispatch(StackActions.replace('SettingModelChange'));
            }}
            color={appStyles(theme).buttonMedium.color}
            style={styles(theme).button}
            height={appStyles(theme).buttonMedium.height}
            width={appStyles(theme).buttonMedium.width}
            linearGradient
            options={{ colors: appStyles(theme).buttonMedium.gradientColors }}
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
  scroll: {
    paddingHorizontal: appStyles(theme).app.paddingHorizontal,
    paddingVertical: appStyles(theme).app.paddingVertical,
  },
  description: {
    fontSize: appStyles(theme).body.fontSize,
    lineHeight: appStyles(theme).body.lineHeight,
  },
  button: {
    alignSelf: 'center',
    marginTop: appStyles(theme).buttonMedium.margin,
  },
});
