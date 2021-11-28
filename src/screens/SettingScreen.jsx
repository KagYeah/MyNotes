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
import appTheme from '../style/theme';
import ListItem from '../components/ListItem';
import Loading from '../components/Loading';

export default function SettingScreen(props) {
  const { navigation } = props;
  const { theme, backgroundImage } = useContext(GlobalContext);

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
    } catch {
      Alert.alert('データの取得に失敗しました。');
      navigation.goBack();
    }
  }

  async function toggleNotificationEnabled() {
    const enabled = !notificationEnabled;
    try {
      await AsyncStorage.setItem('@notification_enabled', String(enabled));
    } catch {
      Alert.alert('設定に失敗しました。');
      return;
    }

    setNotificationEnabled(enabled);
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: enabled,
        shouldPlaySound: enabled,
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
    <View style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        <Loading isLoading={isLoading} />
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
              style={{ height: 48 }}
              linearGradient
              options={{ colors: appTheme[theme].gradientColors3 }}
            />
          )}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 48,
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
    fontSize: 18,
  },
});
