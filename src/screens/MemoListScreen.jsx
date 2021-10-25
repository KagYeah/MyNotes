import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import ListScreen from './ListScreen';

import MemosTable from '../classes/storage/MemosTable';
import Loading from '../components/Loading';

export default function MemoListScreen(props) {
  const { navigation } = props;
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const memosTable = new MemosTable();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      memosTable.select(
        ['id', 'title', 'updated_at'],
        null,
        [{ column: 'updated_at', order: 'DESC' }],
      ).then((result) => {
        console.log('fetched!', result._array);
        const memosArr = result._array.map((memo) => ({
          id: memo.id,
          title: memo.title,
          subtitle: `保存 ${MemosTable.datetime2string(memo.updated_at)}`,
        }));
        setMemos(memosArr);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        setIsLoading(false);
      });
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Loading isLoading={isLoading} />
      <ListScreen data={memos} type="memo" />
    </View>
  );
}
