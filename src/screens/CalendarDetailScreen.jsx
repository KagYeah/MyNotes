import React from 'react';
import { number, shape } from 'prop-types';
import { isToday } from 'date-fns';

import DailyNoteListScreen from './DailyNoteListScreen';
import { date2string } from '../helpers';

export default function CalendarDetailScreen(props) {
  const { route } = props;
  let { date } = route.params;
  date = new Date(date.year, date.month, date.date);

  return <DailyNoteListScreen date={date} appbarTitle={isToday(date) ? '今日' : date2string(date, 'date')} />;
}

CalendarDetailScreen.propTypes = {
  route: shape({
    params: shape({
      date: shape({
        year: number,
        month: number,
        date: number,
      }),
    }),
  }).isRequired,
};
