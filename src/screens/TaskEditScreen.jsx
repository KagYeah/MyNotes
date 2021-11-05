import React, { useEffect, useState } from 'react';
import {
  Alert, Keyboard, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';
import { number, shape } from 'prop-types';
import * as Notifications from 'expo-notifications';

import Button from '../components/Button';
import DateTimeInput from '../components/DateTimeInput';
import DeleteButton from '../components/DeleteButton';
import Loading from '../components/Loading';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import { appStyles } from '../style';
import { date2string } from '../helpers';

import { TasksTable } from '../classes/storage';

export default function TaskEditScreen(props) {
  const { navigation, route } = props;
  const { id } = route.params;
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationId, setNotificationId] = useState(null);
  const tasksTable = new TasksTable();

  useEffect(() => {
    navigation.setOptions({
      headerRight: showKeyboardHidingButton ? (
        <Button
          label="完了"
          onPress={() => Keyboard.dismiss()}
          backgroundColor={appStyles.appbarButton.backgroundColor}
          color={appStyles.appbarButton.color}
        />
      ) : null,
    });
  }, [showKeyboardHidingButton]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setShowKeyboardHidingButton(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setShowKeyboardHidingButton(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      tasksTable.selectById(id, ['title', 'deadline', 'notification_id'])
        .then((result) => {
          console.log('fetched!', result._array);
          const row = result._array[0];
          setDate(tasksTable.datetime2date(row.deadline));
          setTime(tasksTable.datetime2date(row.deadline));
          setTitle(row.title);
          setNotificationId(row.notification_id);
        })
        .catch(() => {
          Alert.alert(
            'データの取得に失敗しました。',
            null,
            [
              {
                title: 'OK',
                onPress: navigation.goBack,
              },
            ],
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    return unsubscribe;
  }, []);

  async function saveTask() {
    const deadlineDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
    );

    let newNotificationId = null;

    setIsLoading(true);

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      newNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: `期限 ${date2string(deadlineDate, 'datetime')}`,
        },
        trigger: deadlineDate,
      });
      setNotificationId(newNotificationId);
    } catch (error) {
      console.log(error);
      Alert.alert('データの保存に失敗しました。');
      return;
    }

    const values = {
      title,
      deadline: tasksTable.datetime(deadlineDate),
      notification_id: newNotificationId,
    };

    tasksTable.updateById(id, values)
      .then(() => {
        console.log('Saved!');
        navigation.goBack();
      })
      .catch(async (error) => {
        console.log(error);
        await Notifications.cancelScheduledNotificationAsync(newNotificationId);
        Alert.alert('データの保存に失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function deleteTask() {
    setIsLoading(true);

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.log(error);
      Alert.alert('データの削除に失敗しました。');
      return;
    }

    tasksTable.deleteById(id)
      .then(() => {
        console.log('Deleted!');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('データの削除に失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={appStyles.keyboardAvoidingView.behavior}
      keyboardVerticalOffset={appStyles.keyboardAvoidingView.verticalOffset}
    >
      <Loading isLoading={isLoading} />

      <View style={styles.container}>
        <StatusBar barStyle={appStyles.statusbar.barStyle} />

        <ScrollView>
          <DateTimeInput
            label="日付"
            mode="date"
            onChange={(value) => setDate(value)}
            value={date}
          />

          <DateTimeInput
            label="時間"
            mode="time"
            onChange={(value) => setTime(value)}
            value={time}
          />

          <NoteTitleInput
            onChangeText={(text) => setTitle(text)}
            placeholder="タスク"
            value={title}
          />

          <DeleteButton
            onPress={() => {
              Alert.alert(
                'タスクを削除します',
                '本当によろしいですか？',
                [
                  {
                    text: 'キャンセル',
                    style: 'cancel',
                  },
                  {
                    text: '削除',
                    onPress: deleteTask,
                    style: 'destructive',
                  },
                ],
              );
            }}
            style={{ alignSelf: 'center' }}
            height={appStyles.deleteButton.height}
            width={appStyles.deleteButton.width}
          />
        </ScrollView>

        <SaveButton
          onPress={saveTask}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

TaskEditScreen.propTypes = {
  route: shape({
    params: shape({ id: number }),
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
});
