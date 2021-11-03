import React, { useEffect, useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import { bool, instanceOf } from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import HolidayJP from '@holiday-jp/holiday_jp';
import { isToday } from 'date-fns';

import { appStyles } from '../style';

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

  let backgroundColor = appStyles.calendar.defaultBackgroundColor;

  if (date.getDay() === 6) {
    backgroundColor = appStyles.calendar.saturdayBackgroundColor;
  }

  if (date.getDay() === 0 || HolidayJP.between(date, date).length > 0) {
    backgroundColor = appStyles.calendar.holidayBackgroundColor;
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
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
    });

    return unsubscribe;
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('CalendarDetail', { date: dateObj });
      }}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor: isToday(date)
            ? appStyles.calendar.todayBorderColor
            : appStyles.calendar.dateBorderColor,
          borderWidth: isToday(date) ? 2 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.number,
          {
            color: isCurrentMonth
              ? appStyles.calendar.currenMonthNumberColor
              : appStyles.calendar.notCurrentMonthNumberColor,
          },
        ]}
      >
        {date.getDate()}
      </Text>
      {hasNotes ? <Text style={styles.dot}>・</Text> : null}
    </TouchableOpacity>
  );
}

CalendarDate.propTypes = {
  date: instanceOf(Date).isRequired,
  isCurrentMonth: bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: appStyles.calendar.dateBorderColor,
    borderWidth: 1,
    height: appStyles.calendar.dateHeight,
    width: appStyles.calendar.dateWidth,
  },
  number: {
    fontSize: appStyles.calendar.fontSize,
    fontWeight: 'bold',
    lineHeight: appStyles.calendar.dateHeight / 2,
  },
  dot: {
    color: appStyles.calendar.dotColor,
    lineHeight: appStyles.calendar.dateHeight / 2,
  },
});
