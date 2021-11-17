import React, { useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalContext } from '../contexts';
import DailyNoteListScreen from './DailyNoteListScreen';

export default function HomeScreen() {
  const { setTheme, setBackgroundImage } = useContext(GlobalContext);

  useEffect(() => {
    setThemeConfig();
    setBackgroundImageConfig();
  }, []);

  async function setThemeConfig() {
    let themeName = 'navy';
    try {
      themeName = await AsyncStorage.getItem('@theme');
    } catch {
      themeName = 'navy';
    }

    setTheme(themeName);
  }

  async function setBackgroundImageConfig() {
    let imageUri = null;
    try {
      imageUri = await AsyncStorage.getItem('@background_image');
    } catch {
      imageUri = null;
    }

    if (imageUri === 'null') {
      imageUri = null;
    }

    setBackgroundImage(imageUri);
  }

  return (
    <DailyNoteListScreen date={new Date()} appbarTitle="ホーム" />
  );
}
