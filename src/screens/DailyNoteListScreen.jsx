import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, StatusBar, SectionList, Alert,
} from 'react-native';
import { instanceOf, string } from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { isToday } from 'date-fns';

import Button from '../components/Button';
import CreateButton from '../components/CreateButton';
import DeleteButton from '../components/DeleteButton';
import ListHeader from '../components/ListHeader';
import ListItemWithCheckBox from '../components/ListItemWithCheckBox';
import Loading from '../components/Loading';
import { appStyles } from '../style';
import { capitalize, date2string } from '../helpers';
import { MyNotesTable, SchedulesTable, TasksTable } from '../classes/storage';

export default function DailyNoteListScreen(props) {
  const navigation = useNavigation();
  const { date, appbarTitle } = props;
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [checkedTaskIds, setCheckedTaskIds] = useState([]);
  const [checkedScheduleIds, setCheckedScheduleIds] = useState([]);
  const tasksTable = new TasksTable();
  const schedulesTable = new SchedulesTable();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setShowCheckBox(false);
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
          label={showCheckBox ? '完了' : '編集'}
          onPress={() => setShowCheckBox(!showCheckBox)}
          backgroundColor={appStyles.appbarButton.backgroundColor}
          color={appStyles.appbarButton.color}
        />
      ),
    });
  }, [showCheckBox]);

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

      console.log('fetched!', schedulesResult._array, tasksResult._array);
    } catch (error) {
      console.log(error);
      Alert.alert('データの取得に失敗しました。');
    }

    setIsLoading(false);

    const tasks = tasksResult._array.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: `期限 ${date2string(row.deadline, 'time')}`,
    }));

    notes.push({
      type: 'task',
      title: isToday(date) ? '今日のタスク' : `${date2string(date, 'date')}のタスク`,
      data: tasks,
    });

    const schedules = schedulesResult._array.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: `${date2string(schedulesTable.datetime2date(row.start_time), 'time')} ~ ${date2string(schedulesTable.datetime2date(row.end_time), 'time')}`,
    }));

    notes.push({
      type: 'schedule',
      title: isToday(date) ? '今日の予定' : `${date2string(date, 'date')}の予定`,
      data: schedules,
    });

    setData(notes);
  }

  function deleteNotes(type) {
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

    table.deleteByIds(ids)
      .then(() => {
        console.log('Saved!');
        fetch();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('データの削除に失敗しました。');
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Loading isLoading={isLoading} />

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
              showCheckBox={showCheckBox}
              checked={checkedIds.includes(item.id)}
              onPressWithCheckBox={() => {
                toggleCheckedId(type, item.id);
              }}
              onPressWithoutCheckBox={() => {
                navigation.navigate(`${capitalize(type)}Edit`);
              }}
            />
          );
        }}
        renderSectionHeader={({ section: { title, type } }) => (
          <ListHeader
            left={title}
            right={!showCheckBox ? null : (
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
                height={appStyles.deleteButtonInListHeader.height}
                width={appStyles.deleteButtonInListHeader.width}
              />
            )}
          />
        )}
      />

      <CreateButton
        onPress={() => {
          navigation.navigate('MemoCreate');
        }}
      />
    </View>
  );
}

DailyNoteListScreen.propTypes = {
  date: instanceOf(Date).isRequired,
  appbarTitle: string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyles.app.backgroundColor,
  },
});
