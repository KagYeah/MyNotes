import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { number, shape } from 'prop-types';
import * as Notifications from 'expo-notifications';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from '../components/Button';
import DateTimeInput from '../components/DateTimeInput';
import DeleteButton from '../components/DeleteButton';
import Loading from '../components/Loading';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import { date2string } from '../helpers';
import { TasksTable } from '../classes/storage';

export default function TaskEditScreen(props) {
  const { navigation, route } = props;
  const { id } = route.params;
  const { theme, backgroundImage } = useContext(GlobalContext);

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
          backgroundColor="#0000"
          color={appTheme[theme].colorOnGradientColors1}
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
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      if ((new Date()).getTime() < deadlineDate.getTime()) {
        newNotificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body: `期限 ${date2string(deadlineDate, 'datetime')}`,
            sound: 'default',
          },
          trigger: deadlineDate,
        });
      }
      setNotificationId(newNotificationId);
    } catch {
      Alert.alert('データの保存に失敗しました。');
      setIsLoading(false);
      return;
    }

    const values = {
      title,
      deadline: tasksTable.datetime(deadlineDate),
      notification_id: newNotificationId,
    };

    tasksTable.updateById(id, values)
      .then(() => {
        navigation.goBack();
      })
      .catch(async () => {
        if (newNotificationId) {
          await Notifications.cancelScheduledNotificationAsync(newNotificationId);
        }
        Alert.alert('データの保存に失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function deleteTask() {
    setIsLoading(true);

    try {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch {
      Alert.alert('データの削除に失敗しました。');
      setIsLoading(false);
      return;
    }

    tasksTable.deleteById(id)
      .then(() => {
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('データの削除に失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 104 : 0}
    >
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <Loading isLoading={isLoading} />

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
            placeholder="リマインダー"
            value={title}
          />

          <DeleteButton
            onPress={() => {
              Alert.alert(
                'リマインダーを削除します',
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
            height={54}
            width={68}
          />
        </ScrollView>

        <SaveButton
          onPress={saveTask}
        />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

TaskEditScreen.propTypes = {
  route: shape({
    params: shape({ id: number }),
  }).isRequired,
};
