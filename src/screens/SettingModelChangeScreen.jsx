import React, { useContext } from 'react';
import {
  Alert, ImageBackground, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  getDownloadURL, getStorage, ref, uploadBytes,
} from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import ListItem from '../components/ListItem';
import { MemosTable, SchedulesTable, TasksTable } from '../classes/storage';

export default function SettingModelChangeScreen(props) {
  const { navigation } = props;
  const { theme, setTheme, backgroundImage } = useContext(GlobalContext);

  const auth = getAuth();

  const memosTable = new MemosTable();
  const tasksTable = new TasksTable();
  const schedulesTable = new SchedulesTable();

  if (!auth.currentUser) {
    Alert.alert('ログインしてください。');
    navigation.goBack();
    return null;
  }

  const backupRef = ref(getStorage(), `backup/${auth.currentUser.uid}/backup.json`);

  async function upload() {
    try {
      const [
        memosResult,
        tasksResult,
        schedulesResult,
        notificationEnabled,
        themeName,
      ] = await Promise.all([
        memosTable.select(['*']),
        tasksTable.select(['*']),
        schedulesTable.select(['*']),
        AsyncStorage.getItem('@notification_enabled'),
        AsyncStorage.getItem('@theme'),
      ]);

      const data = {
        memos: memosResult._array,
        tasks: tasksResult._array,
        schedules: schedulesResult._array,
        config: {
          notification_enabled: notificationEnabled,
          theme: themeName,
        },
      };

      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      await uploadBytes(backupRef, blob);

      Alert.alert('データのアップロードに成功しました。');
    } catch {
      Alert.alert('データのアップロードに失敗しました。');
    }
  }

  async function download() {
    try {
      const url = await getDownloadURL(backupRef);
      const response = await fetch(url, {
        credentials: 'include',
      });
      const data = await response.json();
      const {
        memos, tasks, schedules, config,
      } = data;

      await Promise.all([
        memosTable.delete(),
        tasksTable.delete(),
        schedulesTable.delete(),
      ]);

      await Promise.all([
        memos.forEach((memo) => {
          memosTable.insert(memo);
        }),
        tasks.forEach((task) => {
          tasksTable.insert(task);
        }),
        schedules.forEach((schedule) => {
          schedulesTable.insert(schedule);
        }),
        AsyncStorage.multiSet([
          ['@notification_enabled', config.notification_enabled],
          ['@theme', config.theme],
        ]),
      ]);

      setTheme(config.theme);

      Alert.alert('データのダウンロードに成功しました。');
    } catch {
      Alert.alert('データのダウンロードに失敗しました。');
    }
  }

  const message = `現在、「${auth.currentUser.email}」でログイン中です。

機種変更する際は、「データをアップロード」でバックアップを取り、新しい端末で、「データをダウンロード」してください。機種変更にはログインする必要があります。

データをダウンロードすると、前のデータは消えてしまいます。ご注意ください。`;

  return (
    <View style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <ScrollView>
          <ListItem
            title="データをアップロード"
            onPress={() => {
              Alert.alert(
                'データをアップロードします',
                '本当によろしいですか？',
                [
                  {
                    text: 'キャンセル',
                    style: 'cancel',
                  },
                  {
                    text: 'アップロード',
                    onPress: upload,
                  },
                ],
              );
            }}
            style={styles.listItem}
          />

          <ListItem
            title="データをダウンロード"
            onPress={() => {
              Alert.alert(
                'データをダウンロードします',
                '前のデータは消えます。本当によろしいですか？',
                [
                  {
                    text: 'キャンセル',
                    style: 'cancel',
                  },
                  {
                    text: 'ダウンロード',
                    onPress: download,
                    style: 'destructive',
                  },
                ],
              );
            }}
            style={styles.listItem}
          />

          <View style={styles.description}>
            <Text style={styles.text}>{message}</Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    fontSize: 18,
    height: 48,
  },
  description: {
    padding: 24,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
