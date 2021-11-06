import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import {
  Animated, Keyboard, KeyboardAvoidingView, ScrollView,
  TouchableOpacity, StatusBar, StyleSheet, View,
} from 'react-native';

import { ThemeContext } from '../contexts';
import Button from '../components/Button';
import Loading from '../components/Loading';
import NoteBodyInput from '../components/NoteBodyInput';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import TypeList from '../components/TypeList';
import { appStyles } from '../style';
import { sleep } from '../helpers';
import { MemosTable } from '../classes/storage';

export default function MemoCreateScreen(props) {
  const { theme } = useContext(ThemeContext);
  const { navigation } = props;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);
  const [showTypeList, setShowTypeList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  function saveMemo() {
    const values = {
      title,
      body,
    };

    setIsLoading(true);
    memosTable.insert(values)
      .then(() => {
        console.log('Saved!');
        navigation.navigate('Root', { screen: 'MemoList' });
      })
      .catch((error) => {
        console.log(error);
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
