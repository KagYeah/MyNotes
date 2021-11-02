import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { number, shape } from 'prop-types';

import Button from '../components/Button';
import DeleteButton from '../components/DeleteButton';
import Loading from '../components/Loading';
import NoteBodyInput from '../components/NoteBodyInput';
import NoteTitleInput from '../components/NoteTitleInput';
import SaveButton from '../components/SaveButton';
import { appStyles } from '../style';

import { MemosTable } from '../classes/storage';

export default function MemoEditScreen(props) {
  const { navigation, route } = props;
  const { id } = route.params;
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showKeyboardHidingButton, setShowKeyboardHidingButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const memosTable = new MemosTable();

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      memosTable.selectById(id, ['title', 'body'])
        .then((result) => {
          const row = result._array[0];
          setTitle(row.title);
          setBody(row.body);
        }).catch(() => {
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
        }).finally(() => {
          setIsLoading(false);
        });
    });

    return unsubscribe;
  }, []);

  function saveMemo() {
    const values = {
      title,
      body,
      updated_at: MemosTable.datetime(new Date()),
    };

    setIsLoading(true);
    memosTable.updateById(id, values)
      .then(() => {
        console.log('Updated!');
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('データの保存に失敗しました。');
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  function deleteMemo() {
    setIsLoading(true);
    memosTable.deleteById(id)
      .then(() => {
        console.log('Deleted!');
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('データの削除に失敗しました。');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={appStyles.keyboardAvoidingView.behavior}
      keyboardVerticalOffset={appStyles.keyboardAvoidingView.verticalOffset}
    >
      <Loading isLoading={isLoading} />
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
              Alert.alert(
                'メモを削除します',
                '本当によろしいですか？',
                [
                  {
                    text: 'キャンセル',
                    style: 'cancel',
                  },
                  {
                    text: '削除',
                    onPress: deleteMemo,
                    style: 'destructive',
                  },
                ],
              );
            }}
            style={{ alignSelf: 'center' }}
            height={appStyles.deleteButton.height}
            width={appStyles.deleteButton.width}
          />

        </ScrollView>

        <SaveButton
          onPress={saveMemo}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

MemoEditScreen.propTypes = {
  route: shape({
    params: shape({ id: number }),
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
});
