import React, { useContext, useState } from 'react';
import {
  FlatList, StatusBar, StyleSheet, Text, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext } from '../contexts';
import ListItem from '../components/ListItem';
import { appStyles } from '../style';
import { getHexFromColor } from '../helpers';

export default function SettingMainColorScreen() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [color, setColor] = useState(theme);

  const colors = [
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'lightBlue',
    'blue',
    'purple',
    'navy',
  ];

  return (
    <View style={styles(theme).container}>
      <StatusBar barStyle={appStyles(theme).statusbar.barStyle} />

      <FlatList
        data={colors}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListItem
            title={(
              <View style={styles(theme).labelContainer}>
                <View
                  style={[styles(theme).colorPod, { backgroundColor: getHexFromColor(item) }]}
                />
                {item === color ? <Text>/</Text> : null}
              </View>
            )}
            onPress={async () => {
              setColor(item);
              setTheme(item);
              await AsyncStorage.setItem('@theme', item);
            }}
            style={{ height: appStyles(theme).settingListItem.height }}
          />
        )}
      />
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorPod: {
    borderRadius: appStyles(theme).colorPod.height / 2,
    height: appStyles(theme).colorPod.height,
    width: appStyles(theme).colorPod.width,
  },
});
