import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import ListScreen from './ListScreen';
import Loading from '../components/Loading';
import { date2string } from '../helpers';

import { SchedulesTable } from '../classes/storage';

export default function ScheduleListScreen(props) {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const schedulesTable = new SchedulesTable();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetch);

    return unsubscribe;
  }, []);

  function fetch() {
    setIsLoading(true);
    schedulesTable.select(
      ['id', 'title', 'start_time', 'end_time'],
      null,
      [
        { column: 'start_time', order: 'ASC' },
        { column: 'end_time', order: 'ASC' },
      ],
    ).then((result) => {
      console.log('fetched!');
      const data = result._array.map((schedule) => {
        const subtitle = `${date2string(schedulesTable.datetime2date(schedule.start_time), 'datetime')} ~ ${date2string(schedulesTable.datetime2date(schedule.end_time), 'time')}`;

        return {
          id: schedule.id,
          title: schedule.title,
          subtitle,
        };
      });
      setSchedules(data);
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
      <ListScreen data={schedules} type="schedule" reload={fetch} />
    </View>
  );
}
