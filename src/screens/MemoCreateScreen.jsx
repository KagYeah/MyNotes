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

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Loading from '../components/Loading';
import NoteBodyInput from '../components/NoteBodyInput';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import TypeList from '../components/TypeList';
import { sleep } from '../helpers';
import { MemosTable } from '../classes/storage';

export default function MemoCreateScreen(props) {
  const { theme, backgroundImage } = useContext(GlobalContext);

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
          label={(
            <View style={styles.row}>
              <Text
                style={[
                  styles.appbarTitle,
                  { color: appTheme[theme].colorOnGradientColors1 },
                ]}
              >
                メモ
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

  function saveMemo() {
    const values = {
      title,
      body,
    };

    setIsLoading(true);
    memosTable.insert(values)
      .then(() => {
        navigation.navigate('Root', { screen: 'MemoList' });
      })
      .catch(() => {
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
              activeOpacity={0.5}
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
    width: '100%',
    position: 'absolute',
    top: (-1) * 48 * 3,
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
