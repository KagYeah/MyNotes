import React from 'react';
import {
  StatusBar, StyleSheet, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <AppBar title="My Notes" />

      <View style={styles.centeredView}>
        <Button
          label="はじめる"
          onPress={() => {}}
          color={appStyles.button.color}
          height={appStyles.button.height}
          width={200}
          linearGradient
          options={{ colors: appStyles.button.gradientColors }}
        />

        <Button
          label="機種変更"
          onPress={() => {}}
          color={appStyles.button.color}
          style={{ marginTop: 40 }}
          height={appStyles.button.height}
          width={200}
          linearGradient
          options={{ colors: appStyles.button.gradientColors }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  centeredView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: appStyles.app.paddingHorizontal,
  },
});
