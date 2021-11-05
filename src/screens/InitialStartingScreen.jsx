import React, { useEffect, useState } from 'react';
import {
  Alert,
  StatusBar, StyleSheet, View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../components/Button';
import { appStyles } from '../style';

export default function InitialStartingScreen(props) {
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
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <View style={styles.centeredView}>
        <Button
          label="はじめる"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Root', params: { screen: 'Home' } }],
            });
          }}
          color={appStyles.buttonLarge.color}
          height={appStyles.buttonLarge.height}
          width={appStyles.buttonLarge.width}
          linearGradient
          options={{ colors: appStyles.buttonLarge.gradientColors }}
        />

        <Button
          label="機種変更"
          onPress={() => {
            navigation.navigate('InitialSetting');
          }}
          color={appStyles.buttonLarge.color}
          style={{ marginTop: appStyles.buttonLarge.margin }}
          height={appStyles.buttonLarge.height}
          width={appStyles.buttonLarge.width}
          linearGradient
          options={{ colors: appStyles.buttonLarge.gradientColors }}
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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: appStyles.app.paddingHorizontal,
  },
});
