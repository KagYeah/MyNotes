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
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

import { GlobalContext } from '../contexts';
import ListItem from '../components/ListItem';
import Loading from '../components/Loading';
import { appStyles } from '../style';

export default function SettingScreen(props) {
  const { theme, backgroundImage } = useContext(GlobalContext);

  const { navigation } = props;
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    initNotificationEnabled();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
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

  function logOut() {
    setIsLoading(true);
    signOut(auth)
      .then(() => {
        Alert.alert('ログアウトしました。');
      })
      .catch(() => {
        Alert.alert('ログアウトに失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
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
        if (currentUser) {
          navigation.navigate('SettingModelChange');
        } else {
          Alert.alert('ログインしてください。');
        }
      },
      with: null,
    },
    {
      id: 4,
      label: currentUser ? 'ログアウト' : 'ログイン',
      onPress: () => {
        if (currentUser) {
          Alert.alert(
            'ログアウトします。',
            '本当によろしいですか？',
            [
              {
                text: 'キャンセル',
                style: 'cancel',
              },
              {
                text: 'ログアウト',
                onPress: logOut,
                style: 'destructive',
              },
            ],
          );
        } else {
          navigation.navigate('LogIn');
        }
      },
      with: null,
    },
  ];

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        <Loading isLoading={isLoading} />
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
