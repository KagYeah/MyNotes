import React, { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext } from '../contexts';
import DailyNoteListScreen from './DailyNoteListScreen';

export default function HomeScreen() {
  const { setTheme } = useContext(ThemeContext);

  useEffect(() => {
    setThemeConfig();
  }, []);

  async function setThemeConfig() {
    let themeName = 'navy';
    try {
      themeName = await AsyncStorage.getItem('@theme');
    } catch (error) {
      console.log(error);
    }

    setTheme(themeName);
  }

  return (
    <DailyNoteListScreen date={new Date()} appbarTitle="ホーム" />
  );
}
