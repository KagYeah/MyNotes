import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ListItem from '../components/ListItem';
import { appStyles } from '../style';

export default function SettingScreen(props) {
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
        // navigation.navigate('SettingModelChange');
        navigation.navigate('SettingModelChangeDone');
      },
      with: null,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <FlatList
        data={settings}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <ListItem
            title={(
              <View style={styles.titleContainer}>
                <View style={styles.titleLeft}>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                {item.with ? <View style={styles.titleRight}>{item.with}</View> : null}
              </View>
            )}
            onPress={item.onPress}
            style={{ height: appStyles.settingListItem.height }}
            linearGradient
            options={{ colors: appStyles.settingListItem.gradientColors }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: appStyles.settingListItem.height,
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
    fontSize: appStyles.settingListItem.fontSize,
  },
});
