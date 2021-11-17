import React, { useContext, useEffect, useState } from 'react';
import {
  Alert, ImageBackground, StyleSheet, View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from '../components/Button';

export default function InitialStartingScreen(props) {
  const { theme, backgroundImage } = useContext(GlobalContext);

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
    <View style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        <View style={styles.centeredView}>
          <Button
            label="はじめる"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Root', params: { screen: 'Home' } }],
              });
            }}
            color={appTheme[theme].colorOnGradientColors1}
            height={40}
            width={200}
            linearGradient
            options={{ colors: appTheme[theme].gradientColors1 }}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
