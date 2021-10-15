import React, { useEffect, useState, useRef } from 'react';
import {
  Animated, Keyboard, KeyboardAvoidingView, Platform, ScrollView,
  StatusBar, StyleSheet, TouchableOpacity, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import DateTimeInput from '../components/DateTimeInput';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import TypeList from '../components/TypeList';
import { appStyles } from '../style';
import { sleep } from '../helpers';

export default function TaskCreateScreen() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);
  const [showTypeList, setShowTypeList] = useState(false);
  const typeListTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setShowKeyboardHidingButton(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
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
        toValue: appStyles.listItem.height * appStyles.typeListItem.count,
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <StatusBar barStyle={appStyles.statusbar.barStyle} />

        <AppBar
          title={(
            <Button
              label="タスク_"
              onPress={toggleTypeList}
              backgroundColor={appStyles.appbarButton.backgroundColor}
              color={appStyles.appbarButton.color}
              fontSize={appStyles.appbarTitle.fontSize}
              height={appStyles.appbarTitle.fontSize}
              width={100}
            />
          )}
          left={(
            <Button
              label="<戻る"
              onPress={() => {}}
              backgroundColor={appStyles.appbarButton.backgroundColor}
              color={appStyles.appbarButton.color}
            />
          )}
          right={showKeyboardHidingButton ? (
            <Button
              label="完了"
              onPress={() => Keyboard.dismiss()}
              backgroundColor={appStyles.appbarButton.backgroundColor}
              color={appStyles.appbarButton.color}
            />
          ) : null}
        />

        {showTypeList ? (
          <>
            <TouchableOpacity
              activeOpacity={appStyles.typeListBackground.opacity}
              onPress={toggleTypeList}
              style={styles.typeListBackground}
            />
            <Animated.View
              style={[
                styles.typeList,
                {
                  transform: [{ translateY: typeListTranslateY }],
                  zIndex: appStyles.appbar.zIndex - 1,
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
          />

          <DateTimeInput
            label="時間"
            mode="time"
            onChange={(value) => setTime(value)}
          />

          <NoteTitleInput
            onChangeText={(text) => setTitle(text)}
            placeholder="タスク"
            value={title}
          />
        </ScrollView>

        <SaveButton
          onPress={() => {}}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  typeList: {
    position: 'absolute',
    top: appStyles.appbar.height - appStyles.listItem.height * appStyles.typeListItem.count,
    width: '100%',
  },
  typeListBackground: {
    backgroundColor: appStyles.typeListBackground.backgroundColor,
    height: '100%',
    opacity: appStyles.typeListBackground.opacity,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: appStyles.appbar.zIndex - 1,
  },
});
