import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import ListScreen from './ListScreen';
import Loading from '../components/Loading';
import { date2string } from '../helpers';
import { MemosTable } from '../classes/storage';

export default function MemoListScreen(props) {
  const { navigation } = props;
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const memosTable = new MemosTable();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetch);

    return unsubscribe;
  }, []);

  function fetch() {
    setIsLoading(true);
    memosTable.select(
      ['id', 'title', 'updated_at'],
      null,
      [{ column: 'updated_at', order: 'DESC' }],
    ).then((result) => {
      console.log('fetched!', result._array);
      const memosArr = result._array.map((memo) => {
        const updatedAt = memosTable.datetime2date(memo.updated_at);
        return {
          id: memo.id,
          title: memo.title,
          subtitle: `保存 ${date2string(updatedAt, 'datetime')}`,
        };
      });
      setMemos(memosArr);
    }).catch((error) => {
      console.log(error);
      Alert.alert(error);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <Loading isLoading={isLoading} />
      <ListScreen data={memos} type="memo" reload={fetch} />
    </View>
  );
}
