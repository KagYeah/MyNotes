import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import ListScreen from './ListScreen';
import Loading from '../components/Loading';
import { date2string } from '../helpers';
import { TasksTable } from '../classes/storage';

export default function TaskListScreen(props) {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const tasksTable = new TasksTable();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetch);

    return unsubscribe;
  }, []);

  function fetch() {
    setIsLoading(true);
    tasksTable.select(
      ['id', 'title', 'deadline'],
      null,
      [{ column: 'deadline', order: 'ASC' }],
    ).then((result) => {
      console.log('fetched!', result._array);
      const now = new Date();
      const data = result._array.map((task) => ({
        id: task.id,
        title: task.title,
        subtitle: `期限 ${date2string(tasksTable.datetime2date(task.deadline), 'datetime')}`,
        timeout: task.deadline < tasksTable.datetime(now),
      }));
      setTasks(data);
    }).catch((error) => {
      console.log(error);
      Alert.alert('データの取得に失敗しました。');
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <Loading isLoading={isLoading} />
      <ListScreen data={tasks} type="task" reload={fetch} />
    </View>
  );
}
