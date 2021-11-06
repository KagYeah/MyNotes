import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { number } from 'prop-types';

import { ThemeContext } from '../contexts';
import CalendarDate from './CalendarDate';
import CalendarDayLabel from './CalendarDayLabel';
import { appStyles } from '../style';

export default function Calendar(props) {
  const { theme } = useContext(ThemeContext);
  const { year, month } = props;

  const firstDayOfCurrentMonth = new Date(year, month, 1).getDay();
  const lastDateOfCurrentMonth = new Date(year, month + 1, 0).getDate();
  const lastDateOfPreviousMonth = new Date(year, month, 0).getDate();
  const calendarArray = [];
  let weekArray = [];
  let key = 0;

  for (let i = 0; i < firstDayOfCurrentMonth; i += 1) {
    weekArray.unshift((
      <CalendarDate
        key={key}
        date={new Date(year, month - 1, lastDateOfPreviousMonth - i)}
        isCurrentMonth={false}
      />
    ));
    key += 1;
  }

  for (let date = 1; date <= lastDateOfCurrentMonth; date += 1) {
    if (weekArray.push((
      <CalendarDate
        key={key}
        date={new Date(year, month, date)}
        isCurrentMonth
      />
    )) === 7) {
      calendarArray.push(weekArray);
      weekArray = [];
    }
    key += 1;
  }

  for (let date = 1; ; date += 1) {
    if (weekArray.push((
      <CalendarDate
        key={key}
        date={new Date(year, month + 1, date)}
        isCurrentMonth={false}
      />
    )) === 7) {
      calendarArray.push(weekArray);
      break;
    }
    key += 1;
  }

  const calendar = [<CalendarDayLabel key={key} />];
  key += 1;

  calendarArray.forEach((week) => {
    calendar.push(<View key={key} style={styles(theme).weekContainer}>{week}</View>);
    key += 1;
  });

  return <View style={styles(theme).container}>{calendar}</View>;
}

Calendar.propTypes = {
  year: number.isRequired,
  month: number.isRequired,
};

const styles = (theme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: appStyles(theme).calendar.borderColor,
    borderWidth: 1,
    width: appStyles(theme).calendar.dateWidth * 7 + 2,
  },
  weekContainer: {
    flexDirection: 'row',
  },
});
