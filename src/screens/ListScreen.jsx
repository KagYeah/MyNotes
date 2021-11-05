import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, FlatList, StatusBar, StyleSheet, View,
} from 'react-native';
import {
  arrayOf, func, number, oneOf, oneOfType, shape, string,
} from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

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
          backgroundColor={appStyles.appbarButton.backgroundColor}
          color={appStyles.appbarButton.color}
        />
      ),
    });
  }, [showCheckBox]);

  async function toggleListHeader() {
    if (!showCheckBox) {
      Animated.timing(listTranslateY.current, {
        toValue: appStyles.listHeader.height,
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
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      {showCheckBox ? (
        <Animated.View
          style={[
            styles.listHeader,
            { transform: [{ translateY: listTranslateY.current }] },
          ]}
        >
          <ListHeader
            left={(
              <View style={styles.listHeaderLeft}>
                <Button
                  label="全て選択"
                  onPress={() => {
                    const dataIds = [];
                    data.forEach((item) => {
                      dataIds.push(item.id);
                    });
                    setCheckedIds(dataIds);
                  }}
                  backgroundColor={appStyles.allCheckButton.backgroundColor}
                  color={appStyles.allCheckButton.color}
                  height={appStyles.listHeader.height - appStyles.listHeader.paddingVertical}
                  width={appStyles.allCheckButton.width}
                />
                <Button
                  label="全て解除"
                  onPress={() => {
                    setCheckedIds([]);
                  }}
                  backgroundColor={appStyles.allCheckButton.backgroundColor}
                  color={appStyles.allCheckButton.color}
                  height={appStyles.listHeader.height - appStyles.listHeader.paddingVertical}
                  width={appStyles.allCheckButton.width}
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
                height={appStyles.deleteButtonInListHeader.height}
                width={appStyles.deleteButtonInListHeader.width}
              />
            )}
          />
        </Animated.View>
      ) : null}

      <Animated.View
        style={[
          styles.listWrapper,
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  listWrapper: {
    flex: 1,
  },
  listHeader: {
    top: (-1) * appStyles.listHeader.height,
    position: 'absolute',
    width: '100%',
  },
  listHeaderLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
