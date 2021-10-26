import React from 'react';
import ListScreen from './ListScreen';

export default function ScheduleListScreen() {
  const schedules = [];
  for (let i = 0; i < 10; i += 1) {
    schedules.push({
      id: i,
      title: 'ミーティング',
      subtitle: '時間：2021/10/05 10:00~12:00',
    });
  }

  return <ListScreen data={schedules} type="schedule" reload={() => {}} />;
}
