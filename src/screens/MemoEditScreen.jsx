import React, { useEffect, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';

import Button from '../components/Button';
import DeleteButton from '../components/DeleteButton';
import NoteBodyInput from '../components/NoteBodyInput';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import { appStyles } from '../style';

export default function MemoEditScreen(props) {
  const { navigation } = props;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={appStyles.keyboardAvoidingView.behavior}
      keyboardVerticalOffset={appStyles.keyboardAvoidingView.verticalOffset}
    >
      <View style={styles.container}>
        <StatusBar barStyle={appStyles.statusbar.barStyle} />

        <ScrollView>
          <NoteTitleInput
            onChangeText={(text) => setTitle(text)}
            placeholder="タイトル"
            value={title}
          />

          <NoteBodyInput
            onChangeText={(text) => setBody(text)}
            placeholder="メモ"
            value={body}
          />

          <DeleteButton
            onPress={() => {
              navigation.goBack();
            }}
            style={{ alignSelf: 'center' }}
            height={appStyles.deleteButton.height}
            width={appStyles.deleteButton.width}
          />

        </ScrollView>

        <SaveButton
          onPress={() => {
            navigation.goBack();
          }}
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
