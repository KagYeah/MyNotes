import React, { useState } from 'react';
import {
  FlatList, StatusBar, StyleSheet, Text, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import ListItem from '../components/ListItem';
import { appStyles } from '../style';
import { getHexFromColor } from '../helpers';

export default function SettingMainColorScreen() {
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

  const [color, setColor] = useState('navy');

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <AppBar
        title="メインカラー"
        left={(
          <Button
            label="<戻る"
            onPress={() => {}}
            backgroundColor={appStyles.appbarButton.backgroundColor}
            color={appStyles.appbarButton.color}
          />
        )}
      />

      <FlatList
        data={colors}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListItem
            title={(
              <View style={styles.labelContainer}>
                <View style={[styles.colorPod, { backgroundColor: getHexFromColor(item) }]} />
                {item === color ? <Text>/</Text> : null}
              </View>
            )}
            onPress={() => setColor(item)}
            style={{ height: appStyles.settingListItem.height }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorPod: {
    borderRadius: appStyles.colorPod.height / 2,
    height: appStyles.colorPod.height,
    width: appStyles.colorPod.width,
  },
});
