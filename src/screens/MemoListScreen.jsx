import React from 'react';
import ListScreen from './ListScreen';

export default function MemoListScreen() {
  const memos = [];
  for (let i = 0; i < 10; i += 1) {
    memos.push({
      id: i,
      title: '買い物リスト',
      subtitle: '保存：2021/10/05 10:00',
    });
  }

  return <ListScreen data={memos} type="memo" />;
}
