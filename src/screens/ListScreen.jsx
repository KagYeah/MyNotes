import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  Alert, Animated, FlatList, ImageBackground, StyleSheet, View,
} from 'react-native';
import {
  arrayOf, func, number, oneOf, oneOfType, shape, string,
} from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

import { GlobalContext } from '../contexts';
import Button from '../components/Button';
import CreateButton from '../components/CreateButton';
import DeleteButton from '../components/DeleteButton';
import ListHeader from '../components/ListHeader';
import ListItemWithCheckBox from '../components/ListItemWithCheckBox';
import { appStyles } from '../style';
import { capitalize, sleep } from '../helpers';
import {
  MemosTable, MyNotesTable, TasksTable, SchedulesTable,
} from '../classes/storage';

export default function ListScreen(props) {
  const { theme, backgroundImage } = useContext(GlobalContext);

  const navigation = useNavigation();
  const { data, type, reload } = props;
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const listTranslateY = useRef(new Animated.Value(0));

  let table = new MyNotesTable();
  switch (type) {
    case 'memo':
      table = new MemosTable();
      break;
    case 'task':
      table = new TasksTable();
      break;
    case 'schedule':
      table = new SchedulesTable();
      break;
    default:
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowCheckBox(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setCheckedIds([]);

    if (!showCheckBox) {
      listTranslateY.current = new Animated.Value(0);
    }

    navigation.setOptions({
      headerRight: (
        <Button
          label={showCheckBox ? '完了' : '編集'}
          onPress={async () => {
            await toggleListHeader();
            setShowCheckBox(!showCheckBox);
          }}
          backgroundColor={appStyles(theme).appbarButton.backgroundColor}
          color={appStyles(theme).appbarButton.color}
        />
      ),
    });
  }, [showCheckBox, theme]);

  async function toggleListHeader() {
    if (!showCheckBox) {
      Animated.timing(listTranslateY.current, {
        toValue: appStyles(theme).listHeader.height,
        duration: 500,
        useNativeDriver: true,
      }).start();

      return sleep(0);
    }

    Animated.timing(listTranslateY.current, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return sleep(500);
  }

  function toggleCheckedId(noteId) {
    if (checkedIds.includes(noteId)) {
      setCheckedIds(checkedIds.filter((id) => id !== noteId));
    } else {
      setCheckedIds([...checkedIds, noteId]);
    }
  }

  async function deleteNotes() {
    if (type === 'task' || type === 'schedule') {
      try {
        const result = await table.selectByIds(checkedIds, ['notification_id']);
        const promiseAll = result._array.map((row) => (
          Notifications.cancelScheduledNotificationAsync(row.notification_id)
        ));
        await Promise.all(promiseAll);
      } catch (error) {
        console.log(error);
        Alert.alert('データの削除に失敗しました。');
        return;
      }
    }

    table.deleteByIds(checkedIds)
      .then(() => {
        console.log('Deleted!');
        reload();
      })
      .catch(() => {
        Alert.alert('データの削除に失敗しました。');
      });
  }

  return (
    <View style={styles(theme).container}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>
        {showCheckBox ? (
          <Animated.View
            style={[
              styles(theme).listHeader,
              { transform: [{ translateY: listTranslateY.current }] },
            ]}
          >
            <ListHeader
              left={(
                <View style={styles(theme).listHeaderLeft}>
                  <Button
                    label="全て選択"
                    onPress={() => {
                      const dataIds = [];
                      data.forEach((item) => {
                        dataIds.push(item.id);
                      });
                      setCheckedIds(dataIds);
                    }}
                    backgroundColor={appStyles(theme).allCheckButton.backgroundColor}
                    color={appStyles(theme).allCheckButton.color}
                    height={
                      appStyles(theme).listHeader.height
                      - appStyles(theme).listHeader.paddingVertical
                    }
                    width={appStyles(theme).allCheckButton.width}
                  />
                  <Button
                    label="全て解除"
                    onPress={() => {
                      setCheckedIds([]);
                    }}
                    backgroundColor={appStyles(theme).allCheckButton.backgroundColor}
                    color={appStyles(theme).allCheckButton.color}
                    height={
                      appStyles(theme).listHeader.height
                      - appStyles(theme).listHeader.paddingVertical
                    }
                    width={appStyles(theme).allCheckButton.width}
                  />
                </View>
              )}
              right={(
                <DeleteButton
                  onPress={() => {
                    Alert.alert(
                      '選択した項目を削除します',
                      '本当によろしいですか？',
                      [
                        {
                          text: 'キャンセル',
                          style: 'cancel',
                        },
                        {
                          text: '削除',
                          onPress: deleteNotes,
                          style: 'destructive',
                        },
                      ],
                    );
                  }}
                  height={appStyles(theme).deleteButtonInListHeader.height}
                  width={appStyles(theme).deleteButtonInListHeader.width}
                />
              )}
            />
          </Animated.View>
        ) : null}

        <Animated.View
          style={[
            styles(theme).listWrapper,
            { transform: [{ translateY: listTranslateY.current }] },
          ]}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
              <ListItemWithCheckBox
                title={item.title}
                subtitle={item.subtitle}
                destructive={item.timeout}
                showCheckBox={showCheckBox}
                checked={checkedIds.includes(item.id)}
                onPressWithCheckBox={() => {
                  toggleCheckedId(item.id);
                }}
                onPressWithoutCheckBox={() => {
                  navigation.navigate(`${capitalize(type)}Edit`, { id: item.id });
                }}
              />
            )}
          />
        </Animated.View>

        <CreateButton
          onPress={() => {
            navigation.navigate(`${capitalize(type)}Create`);
          }}
        />
      </ImageBackground>
    </View>
  );
}

ListScreen.propTypes = {
  data: arrayOf(shape({
    id: oneOfType([number, string]).isRequired,
    title: string.isRequired,
    subtitle: string,
  })).isRequired,
  type: oneOf(['memo', 'task', 'schedule']).isRequired,
  reload: func.isRequired,
};

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
  listWrapper: {
    flex: 1,
  },
  listHeader: {
    top: (-1) * appStyles(theme).listHeader.height,
    position: 'absolute',
    width: '100%',
  },
  listHeaderLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
