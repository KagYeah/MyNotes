import React, { useEffect, useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import { bool, instanceOf } from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import HolidayJP from '@holiday-jp/holiday_jp';
import { isToday } from 'date-fns';

import Icon from './Icon';
import { SchedulesTable, TasksTable } from '../classes/storage';

export default function CalendarDate(props) {
  const navigation = useNavigation();
  const { date, isCurrentMonth } = props;
  const dateObj = {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
  };

  const [hasNotes, setHasNotes] = useState(false);

  const tasksTable = new TasksTable();
  const schedulesTable = new SchedulesTable();

  let backgroundColor = '#fff';

  if (date.getDay() === 6) {
    backgroundColor = '#eaf5ff';
  }

  if (date.getDay() === 0 || HolidayJP.between(date, date).length > 0) {
    backgroundColor = '#fee';
  }

  useEffect(() => {
    (async function _() {
      let tasksResult = { _array: [] };
      let schedulesResult = { _array: [] };

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

      if (tasksResult._array.length === 0 && schedulesResult._array.length === 0) {
        setHasNotes(false);
      } else {
        setHasNotes(true);
      }
    }());
  });

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CalendarDetail', { date: dateObj });
      }}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor: isToday(date) ? '#000' : '#ccc',
          borderWidth: isToday(date) ? 2 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.number,
          {
            color: isCurrentMonth ? '#000' : '#ccc',
          },
        ]}
      >
        {date.getDate()}
      </Text>
      {hasNotes ? <Icon name="dot" size={24} color="#ccc" /> : null}
    </TouchableOpacity>
  );
}

CalendarDate.propTypes = {
  date: instanceOf(Date).isRequired,
  isCurrentMonth: bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: 48,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 28,
  },
});
