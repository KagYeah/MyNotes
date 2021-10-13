import React from 'react';
import ListScreen from './ListScreen';

export default function TaskListScreen() {
  const tasks = [];
  for (let i = 0; i < 10; i += 1) {
    tasks.push({
      id: i,
      title: '宿題',
      subtitle: '期限：2021/10/05 10:00',
    });
  }

  return <ListScreen data={tasks} title="タスク一覧" />;
}
