import React, { useEffect, useState } from 'react';

import ListScreen from './ListScreen';

import MemosTable from '../classes/storage/MemosTable';
import { datetime2string } from '../helpers';

export default function MemoListScreen() {
  const [memos, setMemos] = useState([]);
  const memosTable = new MemosTable();

  useEffect(() => {
    memosTable.select(
      ['id', 'title', 'updated_at'],
      null,
      [{ column: 'updated_at', order: 'DESC' }],
    ).then((result) => {
      console.log('fetched!', result._array);
      const memosArr = result._array.map((memo) => {
        return {
          id: memo.id,
          title: memo.title,
          subtitle: `保存 ${datetime2string(memo.updated_at)}`,
        };
      })
      setMemos(memosArr);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  return <ListScreen data={memos} type="memo" />;
}
