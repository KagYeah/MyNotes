import React from 'react';
import DailyNoteListScreen from './DailyNoteListScreen';

export default function HomeScreen() {
  return (
    <DailyNoteListScreen date={new Date()} appbarTitle="ホーム" />
  );
}
