import React, { useContext, useEffect, useState } from 'react';
import {
  Alert, ImageBackground, SectionList, StyleSheet, View,
} from 'react-native';
import { instanceOf, string } from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { isToday } from 'date-fns';
import * as Notifications from 'expo-notifications';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from '../components/Button';
import CreateButton from '../components/CreateButton';
import DeleteButton from '../components/DeleteButton';
import ListHeader from '../components/ListHeader';
import ListItem from '../components/ListItem';
import ListItemWithCheckBox from '../components/ListItemWithCheckBox';
import Loading from '../components/Loading';
import { capitalize, empty, date2string } from '../helpers';

import { MyNotesTable, SchedulesTable, TasksTable } from '../classes/storage';

export default function DailyNoteListScreen(props) {
  const navigation = useNavigation();
  const { date, appbarTitle } = props;
  const { theme, backgroundImage } = useContext(GlobalContext);

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [checkedTaskIds, setCheckedTaskIds] = useState([]);
  const [checkedScheduleIds, setCheckedScheduleIds] = useState([]);

  const tasksTable = new TasksTable();
  const schedulesTable = new SchedulesTable();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEditMode(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setCheckedTaskIds([]);
    setCheckedScheduleIds([]);

    navigation.setOptions({
      title: appbarTitle,
      headerRight: (
        <Button
          label={editMode ? '完了' : '編集'}
          onPress={() => setEditMode(!editMode)}
          backgroundColor="#0000"
          color={appTheme[theme].colorOnGradientColors1}
        />
      ),
    });
  }, [editMode, theme]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetch);

    return unsubscribe;
  }, []);

  function toggleCheckedId(type, noteId) {
    let checkedIds = [];
    let setCheckedIds = () => {};

    switch (type) {
      case 'task':
        checkedIds = checkedTaskIds;
        setCheckedIds = setCheckedTaskIds;
        break;
      case 'schedule':
        checkedIds = checkedScheduleIds;
        setCheckedIds = setCheckedScheduleIds;
        break;
      default:
    }

    if (checkedIds.includes(noteId)) {
      setCheckedIds(checkedIds.filter((id) => id !== noteId));
    } else {
      setCheckedIds([...checkedIds, noteId]);
    }
  }

  async function fetch() {
    const notes = [];
    let tasksResult = { _array: [] };
    let schedulesResult = { _array: [] };

    setIsLoading(true);

    try {
      tasksResult = await tasksTable.select(
        ['id', 'title', 'deadline'],
        {
          operator: 'AND',
          value: [
            {
              column: 'deadline',
              operator: '>=',
              value: tasksTable.datetime(new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              )),
            },
            {
              column: 'deadline',
              operator: '<',
              value: tasksTable.datetime(new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1,
              )),
            },
          ],
        },
        [{ column: 'deadline', order: 'ASC' }],
      );

      schedulesResult = await schedulesTable.select(
        ['id', 'title', 'start_time', 'end_time'],
        {
          operator: 'AND',
          value: [
            {
              column: 'start_time',
              operator: '>=',
              value: schedulesTable.datetime(new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              )),
            },
            {
              column: 'start_time',
              operator: '<',
              value: schedulesTable.datetime(new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1,
              )),
            },
          ],
        },
        [
          { column: 'start_time', order: 'ASC' },
          { column: 'end_time', order: 'ASC' },
        ],
      );
    } catch {
      Alert.alert('データの取得に失敗しました。');
    }

    setIsLoading(false);

    const now = new Date();

    const tasks = tasksResult._array.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: `期限 ${date2string(tasksTable.datetime2date(row.deadline), 'time')}`,
      timeout: row.deadline < tasksTable.datetime(now),
    }));

    if (!empty(tasks)) {
      notes.push({
        type: 'task',
        title: isToday(date) ? '今日のリマインダー' : `${date2string(date, 'date')}のリマインダー`,
        data: tasks,
      });
    }

    const schedules = schedulesResult._array.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: `${date2string(schedulesTable.datetime2date(row.start_time), 'time')} ~ ${date2string(schedulesTable.datetime2date(row.end_time), 'time')}`,
      timeout: row.end_time < schedulesTable.datetime(now),
    }));

    if (!empty(schedules)) {
      notes.push({
        type: 'schedule',
        title: isToday(date) ? '今日のスケジュール' : `${date2string(date, 'date')}のスケジュール`,
        data: schedules,
      });
    }

    setData(notes);
  }

  async function deleteNotes(type) {
    let table = new MyNotesTable();
    let ids = [];

    switch (type) {
      case 'task':
        table = new TasksTable();
        ids = checkedTaskIds;
        break;
      case 'schedule':
        table = new SchedulesTable();
        ids = checkedScheduleIds;
        break;
      default:
    }

    try {
      const result = await table.selectByIds(ids, ['notification_id']);
      const promiseAll = result._array.map((row) => {
        if (row.notification_id) {
          return Notifications.cancelScheduledNotificationAsync(row.notification_id);
        }

        return null;
      });
      await Promise.all(promiseAll);
    } catch {
      Alert.alert('データの削除に失敗しました。');
      return;
    }

    table.deleteByIds(ids)
      .then(() => {
        fetch();
      })
      .catch(() => {
        Alert.alert('データの削除に失敗しました。');
      });
  }

  return (
    <View style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <Loading isLoading={isLoading} />

        {empty(data) ? (
          <ListItem
            title={`${isToday(date) ? '今日' : date2string(date, 'date')}のリマインダー・スケジュールはありません`}
            style={styles.emptyItem}
          />
        ) : (
          <SectionList
            sections={data}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            renderItem={({ item, section: { type } }) => {
              let checkedIds = [];

              switch (type) {
                case 'task':
                  checkedIds = checkedTaskIds;
                  break;
                case 'schedule':
                  checkedIds = checkedScheduleIds;
                  break;
                default:
              }

              return (
                <ListItemWithCheckBox
                  title={item.title}
                  subtitle={item.subtitle}
                  timeout={item.timeout}
                  showCheckBox={editMode}
                  checked={checkedIds.includes(item.id)}
                  onPressWithCheckBox={() => {
                    toggleCheckedId(type, item.id);
                  }}
                  onPressWithoutCheckBox={() => {
                    navigation.navigate(`${capitalize(type)}Edit`, { id: item.id });
                  }}
                />
              );
            }}
            renderSectionHeader={({ section: { title, type } }) => (
              <ListHeader
                left={title}
                right={!editMode ? null : (
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
                            onPress: () => {
                              deleteNotes(type);
                            },
                            style: 'destructive',
                          },
                        ],
                      );
                    }}
                    height={32}
                    width={64}
                  />
                )}
              />
            )}
          />
        )}

        <CreateButton
          onPress={() => {
            navigation.navigate('TaskCreate');
          }}
        />
      </ImageBackground>
    </View>
  );
}

DailyNoteListScreen.propTypes = {
  date: instanceOf(Date).isRequired,
  appbarTitle: string.isRequired,
};

const styles = StyleSheet.create({
  emptyItem: {
    alignItems: 'center',
    backgroundColor: '#0000',
    color: '#000',
    fontSize: 18,
    fontWeight: 'normal',
  },
});
