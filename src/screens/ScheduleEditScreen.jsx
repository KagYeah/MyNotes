import React, { useEffect, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import DateTimeInput from '../components/DateTimeInput';
import DeleteButton from '../components/DeleteButton';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import { appStyles } from '../style';

export default function MemoEditScreen() {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [title, setTitle] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);

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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={styles.container}>
        <StatusBar barStyle={appStyles.statusbar.barStyle} />

        <AppBar
          title="タスク"
          left={(
            <Button
              label="<戻る"
              onPress={() => {}}
              backgroundColor={appStyles.appbarButton.backgroundColor}
              color={appStyles.appbarButton.color}
            />
          )}
          right={(
            showKeyboardHidingButton
              ? (
                <Button
                  label="完了"
                  onPress={() => Keyboard.dismiss()}
                  backgroundColor={appStyles.appbarButton.backgroundColor}
                  color={appStyles.appbarButton.color}
                />
              ) : null
          )}
        />

        <ScrollView>
          <DateTimeInput
            label="日付"
            mode="date"
            onChange={(value) => setDate(value)}
          />

          <DateTimeInput
            label="開始時間"
            mode="time"
            onChange={(value) => setStartTime(value)}
          />

          <DateTimeInput
            label="終了時間"
            mode="time"
            onChange={(value) => setEndTime(value)}
          />

          <NoteTitleInput
            onChangeText={(text) => setTitle(text)}
            value={title}
          />

          <DeleteButton
            onPress={() => {}}
            style={{ alignSelf: 'center' }}
            height={appStyles.deleteButton.height}
            width={appStyles.deleteButton.width}
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
});
