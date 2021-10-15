import React from 'react';

import DailyNoteListScreen from './DailyNoteListScreen';

export default function CalendarDetailScreen() {
  const schedules = [];
  for (let i = 0; i < 10; i += 1) {
    schedules.push({
      id: i,
      title: 'ミーディング',
      subtitle: '10:00~12:00',
    });
  }

  const tasks = [];
  for (let i = 0; i < 10; i += 1) {
    tasks.push({
      id: i,
      title: '宿題',
      subtitle: '期限 12:00',
    });
  }

  const listData = [
    {
      title: '2021/10/05の予定',
      data: schedules,
    },
    {
      title: '2021/10/05のタスク',
      data: tasks,
    },
  ];

  return <DailyNoteListScreen data={listData} appbarTitle="2021/10/05" />;
}
