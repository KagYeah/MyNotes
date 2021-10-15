import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { bool, instanceOf } from 'prop-types';
import HolidayJP from '@holiday-jp/holiday_jp';
import { isToday } from 'date-fns';

import { appStyles } from '../style';
import { date2string } from '../helpers';

export default function CalendarDate(props) {
  const { date, isCurrentMonth } = props;
  let backgroundColor = appStyles.calendar.defaultBackgroundColor;

  if (date.getDay() === 6) {
    backgroundColor = appStyles.calendar.saturdayBackgroundColor;
  }

  if (date.getDay() === 0 || HolidayJP.between(date, date).length > 0) {
    backgroundColor = appStyles.calendar.holidayBackgroundColor;
  }

  function hasNotes() {
    if (date2string(date) === '2021/10/05 (火)') {
      return true;
    }

    return false;
  }

  return (
    <TouchableOpacity
      onPress={() => {}}
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
      {hasNotes(date) ? <Text style={styles.dot}>・</Text> : null}
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
