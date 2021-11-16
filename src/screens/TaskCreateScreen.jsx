import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  Alert,
  Animated,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';

import { GlobalContext } from '../contexts';
import Button from '../components/Button';
import DateTimeInput from '../components/DateTimeInput';
import Loading from '../components/Loading';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import TypeList from '../components/TypeList';
import { appStyles } from '../style';
import { date2string, sleep } from '../helpers';
import { TasksTable } from '../classes/storage';

export default function TaskCreateScreen(props) {
  const { theme, backgroundImage } = useContext(GlobalContext);

  const { navigation } = props;
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);
  const [showTypeList, setShowTypeList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const typeListTranslateY = useRef(new Animated.Value(0)).current;
  const tasksTable = new TasksTable();

  useEffect(() => {
    navigation.setOptions({
      title: (
        <Button
          label="タスク_"
          onPress={() => {
            toggleTypeList();
            Keyboard.dismiss();
          }}
          backgroundColor={appStyles(theme).appbarButton.backgroundColor}
          color={appStyles(theme).appbarButton.color}
          fontSize={appStyles(theme).appbarTitle.fontSize}
          height={appStyles(theme).appbarTitle.fontSize}
          width={200}
        />
      ),
    });
  }, [showTypeList]);

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

  async function animateTypeList() {
    if (!showTypeList) {
      Animated.timing(typeListTranslateY, {
        toValue: appStyles(theme).listItem.height * appStyles(theme).typeListItem.count,
        duration: 500,
        useNativeDriver: true,
      }).start();

      return sleep(0);
    }

    Animated.timing(typeListTranslateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return sleep(500);
  }

  async function toggleTypeList() {
    await animateTypeList();
    setShowTypeList(!showTypeList);
  }

  async function saveTask() {
    const deadlineDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
    );

    let notificationId = null;

    try {
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: `期限 ${date2string(deadlineDate, 'datetime')}`,
        },
        trigger: deadlineDate,
      });
    } catch (error) {
      console.log(error);
      Alert.alert('データの保存に失敗しました。');
      return;
    }

    const values = {
      title,
      deadline: tasksTable.datetime(deadlineDate),
      notification_id: notificationId,
    };

    setIsLoading(true);
    tasksTable.insert(values)
      .then(() => {
        console.log('Saved!');
        navigation.navigate('Root', { screen: 'TaskList' });
      })
      .catch(async (error) => {
        console.log(error);
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        Alert.alert('データの保存に失敗しました。');
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
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <Loading isLoading={isLoading} />

        <View style={styles(theme).container}>
          {showTypeList ? (
            <>
              <TouchableOpacity
                activeOpacity={appStyles(theme).typeListBackground.opacity}
                onPress={toggleTypeList}
                style={styles(theme).typeListBackground}
              />
              <Animated.View
                style={[
                  styles(theme).typeList,
                  {
                    transform: [{ translateY: typeListTranslateY }],
                    zIndex: appStyles(theme).appbar.zIndex - 1,
                  },
                ]}
              >
                <TypeList />
              </Animated.View>
            </>
          ) : null}

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
          </ScrollView>

          <SaveButton
            onPress={saveTask}
          />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
  typeList: {
    position: 'absolute',
    top: (-1) * appStyles(theme).listItem.height * appStyles(theme).typeListItem.count,
    width: '100%',
  },
  typeListBackground: {
    backgroundColor: appStyles(theme).typeListBackground.backgroundColor,
    height: '100%',
    opacity: appStyles(theme).typeListBackground.opacity,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: appStyles(theme).appbar.zIndex - 1,
  },
});
