import React, { useState } from 'react';
import {
  FlatList, StatusBar, StyleSheet, Switch, Text, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import ListItem from '../components/ListItem';
import { appStyles } from '../style';

export default function SettingScreen() {
  const [enableNotification, setEnableNotification] = useState(false);

  const settings = [
    {
      id: 0,
      label: '通知',
      onPress: () => setEnableNotification(!enableNotification),
      with: (
        <Switch
          onValueChange={() => setEnableNotification(!enableNotification)}
          value={enableNotification}
        />
      ),
    },
    {
      id: 1,
      label: 'メインカラー',
      onPress: () => {},
      with: null,
    },
    {
      id: 2,
      label: '背景',
      onPress: () => {},
      with: null,
    },
    {
      id: 3,
      label: '機種変更',
      onPress: () => {},
      with: null,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <AppBar
        title="設定"
        left={(
          <Button
            label="三"
            onPress={() => {}}
            backgroundColor={appStyles.appbarButton.backgroundColor}
            color={appStyles.appbarButton.color}
          />
        )}
      />

      <FlatList
        data={settings}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <ListItem
            title={(
              <View style={styles.titleContainer}>
                <View style={styles.titleLeft}>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                {item.with ? <View style={styles.titleRight}>{item.with}</View> : null}
              </View>
            )}
            onPress={item.onPress}
            style={{ height: appStyles.settingListItem.height }}
            linearGradient
            options={{ colors: appStyles.settingListItem.gradientColors }}
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
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: appStyles.settingListItem.height,
    justifyContent: 'space-between',
  },
  titleLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  titleRight: {
    width: '20%',
  },
  label: {
    fontSize: appStyles.settingListItem.fontSize,
  },
});
