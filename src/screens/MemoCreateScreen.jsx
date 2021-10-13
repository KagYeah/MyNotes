import React, { useEffect, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import NoteBodyInput from '../components/NoteBodyInput';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import { appStyles } from '../style';

export default function MemoEditScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
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
          title="メモ"
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
          <NoteTitleInput
            autoFocus
            onChangeText={(text) => setTitle(text)}
            value={title}
          />

          <NoteBodyInput
            onChangeText={(text) => setBody(text)}
            value={body}
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
