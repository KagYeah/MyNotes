import React, { useEffect, useState, useRef } from 'react';
import {
  Animated, Keyboard, KeyboardAvoidingView, ScrollView,
  TouchableOpacity, StatusBar, StyleSheet, View,
} from 'react-native';

import Button from '../components/Button';
import NoteBodyInput from '../components/NoteBodyInput';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import TypeList from '../components/TypeList';
import { appStyles } from '../style';
import { sleep } from '../helpers';

import MemosTable from '../classes/storage/MemosTable';

export default function MemoCreateScreen(props) {
  const { navigation } = props;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);
  const [showTypeList, setShowTypeList] = useState(false);
  const typeListTranslateY = useRef(new Animated.Value(0)).current;
  const memosTable = new MemosTable();

  useEffect(() => {
    navigation.setOptions({
      title: (
        <Button
          label="メモ_"
          onPress={() => {
            toggleTypeList();
            Keyboard.dismiss();
          }}
          backgroundColor={appStyles.appbarButton.backgroundColor}
          color={appStyles.appbarButton.color}
          fontSize={appStyles.appbarTitle.fontSize}
          height={appStyles.appbarTitle.fontSize}
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

  function saveMemo() {
    const values = {
      title: title,
      body: body,
    };
    memosTable.insert(values)
      .then(() => {
        console.log('Saved!');
        navigation.navigate('Root', { screen: 'MemoList' });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={appStyles.keyboardAvoidingView.behavior}
      keyboardVerticalOffset={appStyles.keyboardAvoidingView.verticalOffset}
    >
      <View style={styles.container}>
        <StatusBar barStyle={appStyles.statusbar.barStyle} />

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
          <NoteTitleInput
            autoFocus
            onChangeText={(text) => setTitle(text)}
            placeholder="タイトル"
            value={title}
          />

          <NoteBodyInput
            onChangeText={(text) => setBody(text)}
            placeholder="メモ"
            value={body}
          />
        </ScrollView>

        <SaveButton
          onPress={saveMemo}
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
    top: (-1) * appStyles.listItem.height * appStyles.typeListItem.count,
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
