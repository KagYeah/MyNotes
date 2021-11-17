import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  Alert,
  Animated,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Notifications from 'expo-notifications';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from '../components/Button';
import DateTimeInput from '../components/DateTimeInput';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import TypeList from '../components/TypeList';
import { date2string, sleep } from '../helpers';
import { TasksTable } from '../classes/storage';

export default function TaskCreateScreen(props) {
  const { navigation } = props;
  const { theme, backgroundImage } = useContext(GlobalContext);

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
          label={(
            <View style={styles.row}>
              <Text
                style={[
                  styles.appbarTitle,
                  { color: appTheme[theme].colorOnGradientColors1 },
                ]}
              >
                タスク
              </Text>
              <Icon name="arrow-down" size={12} color={appTheme[theme].colorOnGradientColors1} />
            </View>
          )}
          onPress={() => {
            toggleTypeList();
            Keyboard.dismiss();
          }}
          backgroundColor="#0000"
          height={32}
          width={200}
        />
      ),
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: showKeyboardHidingButton ? (
        <Button
          label="完了"
          onPress={() => Keyboard.dismiss()}
          backgroundColor="#0000"
          color={appTheme[theme].colorOnBackgroundColors1}
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
        toValue: 48 * 3,
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
      if ((new Date()).getTime() < deadlineDate.getTime()) {
        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body: `期限 ${date2string(deadlineDate, 'datetime')}`,
          },
          trigger: deadlineDate,
        });
      }
    } catch {
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
        navigation.navigate('Root', { screen: 'TaskList' });
      })
      .catch(async () => {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        Alert.alert('データの保存に失敗しました。');
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

        {showTypeList ? (
          <>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleTypeList}
              style={styles.typeListBackground}
            />
            <Animated.View
              style={[
                styles.typeList,
                {
                  transform: [{ translateY: typeListTranslateY }],
                  zIndex: 5,
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
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  appbarTitle: {
    fontSize: 32,
  },
  typeList: {
    position: 'absolute',
    top: (-1) * 48 * 3,
    width: '100%',
  },
  typeListBackground: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
    opacity: 0.5,
    zIndex: 5,
  },
});
