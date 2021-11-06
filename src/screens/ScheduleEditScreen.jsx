import React, { useContext, useEffect, useState } from 'react';
import {
  Alert, Keyboard, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';
import { number, shape } from 'prop-types';
import * as Notifications from 'expo-notifications';

import { ThemeContext } from '../contexts';
import Button from '../components/Button';
import DateTimeInput from '../components/DateTimeInput';
import DeleteButton from '../components/DeleteButton';
import Loading from '../components/Loading';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import { appStyles } from '../style';
import { date2string } from '../helpers';
import { SchedulesTable } from '../classes/storage';

export default function ScheduleEditScreen(props) {
  const { theme } = useContext(ThemeContext);
  const { navigation, route } = props;
  const { id } = route.params;
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationId, setNotificationId] = useState(null);
  const schedulesTable = new SchedulesTable();

  useEffect(() => {
    navigation.setOptions({
      headerRight: showKeyboardHidingButton ? (
        <Button
          label="完了"
          onPress={() => Keyboard.dismiss()}
          backgroundColor={appStyles(theme).appbarButton.backgroundColor}
          color={appStyles(theme).appbarButton.color}
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
      schedulesTable.selectById(id, ['title', 'start_time', 'end_time', 'notification_id'])
        .then((result) => {
          console.log('fetched!', result._array);
          const row = result._array[0];
          setDate(schedulesTable.datetime2date(row.start_time));
          setStartTime(schedulesTable.datetime2date(row.start_time));
          setEndTime(schedulesTable.datetime2date(row.end_time));
          setTitle(row.title);
          setNotificationId(row.notification_id);
        })
        .catch((error) => {
          console.log(error);
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

  async function saveSchedule() {
    let startTimeObj = {
      hour: startTime.getHours(),
      minute: startTime.getMinutes(),
    };

    let endTimeObj = {
      hour: endTime.getHours(),
      minute: endTime.getMinutes(),
    };

    if (
      startTimeObj.hour > endTimeObj.hour
      || (startTimeObj.hour === endTimeObj.hour && startTimeObj.minute > endTimeObj.minute)
    ) {
      [startTimeObj, endTimeObj] = [endTimeObj, startTimeObj];
    }

    const startTimeDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTimeObj.hour,
      startTimeObj.minute,
    );

    const endTimeDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      endTimeObj.hour,
      endTimeObj.minute,
    );

    let newNotificationId = null;

    setIsLoading(true);

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      newNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: `${date2string(startTimeDate, 'datetime')} ~ ${date2string(endTimeDate, 'time')}`,
        },
        trigger: startTimeDate,
      });
      setNotificationId(newNotificationId);
    } catch (error) {
      console.log(error);
      Alert.alert('データの保存に失敗しました。');
      return;
    }

    const values = {
      title,
      start_time: schedulesTable.datetime(startTimeDate),
      end_time: schedulesTable.datetime(endTimeDate),
      notification_id: newNotificationId,
    };

    schedulesTable.updateById(id, values)
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

  async function deleteSchedule() {
    setIsLoading(true);

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.log(error);
      Alert.alert('データの削除に失敗しました。');
      return;
    }

    schedulesTable.deleteById(id)
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
      behavior={appStyles(theme).keyboardAvoidingView.behavior}
      keyboardVerticalOffset={appStyles(theme).keyboardAvoidingView.verticalOffset}
    >
      <Loading isLoading={isLoading} />

      <View style={styles(theme).container}>
        <StatusBar barStyle={appStyles(theme).statusbar.barStyle} />

        <ScrollView>
          <DateTimeInput
            label="日付"
            mode="date"
            onChange={(value) => setDate(value)}
            value={date}
          />

          <DateTimeInput
            label="開始時間"
            mode="time"
            onChange={(value) => setStartTime(value)}
            value={startTime}
          />

          <DateTimeInput
            label="終了時間"
            mode="time"
            onChange={(value) => setEndTime(value)}
            value={endTime}
          />

          <NoteTitleInput
            onChangeText={(text) => setTitle(text)}
            placeholder="予定"
            value={title}
          />

          <DeleteButton
            onPress={() => {
              Alert.alert(
                '予定を削除します',
                '本当によろしいですか？',
                [
                  {
                    text: 'キャンセル',
                    style: 'cancel',
                  },
                  {
                    text: '削除',
                    onPress: deleteSchedule,
                    style: 'destructive',
                  },
                ],
              );
            }}
            style={{ alignSelf: 'center' }}
            height={appStyles(theme).deleteButton.height}
            width={appStyles(theme).deleteButton.width}
          />
        </ScrollView>

        <SaveButton
          onPress={saveSchedule}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

ScheduleEditScreen.propTypes = {
  route: shape({
    params: shape({ id: number }),
  }).isRequired,
};

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
});
