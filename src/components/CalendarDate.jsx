import React, { useContext, useEffect, useState } from 'react';
import {
  Alert, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import { bool, instanceOf } from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import HolidayJP from '@holiday-jp/holiday_jp';
import { isToday } from 'date-fns';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';
import { SchedulesTable, TasksTable } from '../classes/storage';

export default function CalendarDate(props) {
  const { theme } = useContext(ThemeContext);
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

  let backgroundColor = appStyles(theme).calendar.defaultBackgroundColor;

  if (date.getDay() === 6) {
    backgroundColor = appStyles(theme).calendar.saturdayBackgroundColor;
  }

  if (date.getDay() === 0 || HolidayJP.between(date, date).length > 0) {
    backgroundColor = appStyles(theme).calendar.holidayBackgroundColor;
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
        styles(theme).container,
        {
          backgroundColor,
          borderColor: isToday(date)
            ? appStyles(theme).calendar.todayBorderColor
            : appStyles(theme).calendar.dateBorderColor,
          borderWidth: isToday(date) ? 2 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles(theme).number,
          {
            color: isCurrentMonth
              ? appStyles(theme).calendar.currenMonthNumberColor
              : appStyles(theme).calendar.notCurrentMonthNumberColor,
          },
        ]}
      >
        {date.getDate()}
      </Text>
      {hasNotes ? <Text style={styles(theme).dot}>・</Text> : null}
    </TouchableOpacity>
  );
}

CalendarDate.propTypes = {
  date: instanceOf(Date).isRequired,
  isCurrentMonth: bool.isRequired,
};

const styles = (theme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: appStyles(theme).calendar.dateBorderColor,
    borderWidth: 1,
    height: appStyles(theme).calendar.dateHeight,
    width: appStyles(theme).calendar.dateWidth,
  },
  number: {
    fontSize: appStyles(theme).calendar.fontSize,
    fontWeight: 'bold',
    lineHeight: appStyles(theme).calendar.dateHeight / 2,
  },
  dot: {
    color: appStyles(theme).calendar.dotColor,
    lineHeight: appStyles(theme).calendar.dateHeight / 2,
  },
});
