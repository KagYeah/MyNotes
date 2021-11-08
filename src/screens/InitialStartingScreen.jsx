import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BackgroundImageContext, ThemeContext } from '../contexts';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function InitialStartingScreen(props) {
  const { backgroundImage } = useContext(BackgroundImageContext);
  const { theme } = useContext(ThemeContext);

  const { navigation } = props;
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      await initializeAsync();
      setIsInitialized(true);
    } catch (error) {
      console.log(error);
      Alert.alert('初期化に失敗しました。', '再起動してください。');
    }
  }

  function initializeAsync() {
    return Promise.all([
      setConfig(),
      requestPermissionsAsync(),
      setNotificationHandler(),
    ]);
  }

  async function setConfig() {
    await AsyncStorage.multiSet([
      ['@notification_enabled', 'true'],
      ['@theme', 'navy'],
      ['@background_image', 'null'],
    ]);
  }

  async function requestPermissionsAsync() {
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) { return; }

    await Notifications.requestPermissionsAsync();
  }

  function setNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }

  if (!isInitialized) {
    return null;
  }

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        <View style={styles(theme).centeredView}>
          <Button
            label="はじめる"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Root', params: { screen: 'Home' } }],
              });
            }}
            color={appStyles(theme).buttonLarge.color}
            height={appStyles(theme).buttonLarge.height}
            width={appStyles(theme).buttonLarge.width}
            linearGradient
            options={{ colors: appStyles(theme).buttonLarge.gradientColors }}
          />

          <Button
            label="機種変更"
            onPress={() => {
              navigation.navigate('InitialSetting');
            }}
            color={appStyles(theme).buttonLarge.color}
            style={{ marginTop: appStyles(theme).buttonLarge.margin }}
            height={appStyles(theme).buttonLarge.height}
            width={appStyles(theme).buttonLarge.width}
            linearGradient
            options={{ colors: appStyles(theme).buttonLarge.gradientColors }}
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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: appStyles(theme).app.paddingHorizontal,
  },
});
