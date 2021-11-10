import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BackgroundImageContext, ThemeContext } from '../contexts';
import ListItem from '../components/ListItem';
import { appStyles } from '../style';

export default function SettingScreen(props) {
  const { backgroundImage } = useContext(BackgroundImageContext);
  const { theme } = useContext(ThemeContext);

  const { navigation } = props;
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    initNotificationEnabled();
  }, []);

  async function initNotificationEnabled() {
    try {
      const enabled = (await AsyncStorage.getItem('@notification_enabled')) === 'true';
      setNotificationEnabled(enabled);
    } catch (error) {
      console.log(error);
      Alert.alert('データの取得に失敗しました。');
      navigation.goBack();
    }
  }

  async function toggleNotificationEnabled() {
    const enabled = !notificationEnabled;
    try {
      await AsyncStorage.setItem('@notification_enabled', String(enabled));
    } catch (error) {
      console.log(error);
      Alert.alert('設定に失敗しました。');
      return;
    }

    setNotificationEnabled(enabled);
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: enabled,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }

  const settings = [
    {
      id: 0,
      label: '通知',
      onPress: toggleNotificationEnabled,
      with: (
        <Switch
          onValueChange={toggleNotificationEnabled}
          value={notificationEnabled}
        />
      ),
    },
    {
      id: 1,
      label: 'メインカラー',
      onPress: () => {
        navigation.navigate('SettingMainColor');
      },
      with: null,
    },
    {
      id: 2,
      label: '背景',
      onPress: () => {
        navigation.navigate('SettingBackgroundImage');
      },
      with: null,
    },
    {
      id: 3,
      label: '機種変更',
      onPress: () => {
        navigation.navigate('SettingModelChange');
        // navigation.navigate('SettingModelChangeDone');
      },
      with: null,
    },
    {
      id: 4,
      label: 'ログイン',
      onPress: () => {
        navigation.navigate('LogIn');
      },
      with: null,
    },
  ];

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        <FlatList
          data={settings}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <ListItem
              title={(
                <View style={styles(theme).titleContainer}>
                  <View style={styles(theme).titleLeft}>
                    <Text style={styles(theme).label}>{item.label}</Text>
                  </View>
                  {item.with ? <View style={styles(theme).titleRight}>{item.with}</View> : null}
                </View>
              )}
              onPress={item.onPress}
              style={{ height: appStyles(theme).settingListItem.height }}
              linearGradient
              options={{ colors: appStyles(theme).settingListItem.gradientColors }}
            />
          )}
        />
      </ImageBackground>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: appStyles(theme).settingListItem.height,
    justifyContent: 'space-between',
  },
  titleLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  titleRight: {
    width: '20%',
  },
  label: {
    fontSize: appStyles(theme).settingListItem.fontSize,
  },
});
