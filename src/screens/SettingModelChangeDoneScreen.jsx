import React from 'react';
import {
  ScrollView, StatusBar, StyleSheet, Text, View,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen() {
  const message = 'すでにID「abc123」で設定しています。設定し直す場合は、以下の「再設定」ボタンを押してください。';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <AppBar
        title="機種変更"
        left={(
          <Button
            label="<戻る"
            onPress={() => {}}
            backgroundColor={appStyles.appbarButton.backgroundColor}
            color={appStyles.appbarButton.color}
          />
        )}
      />

      <ScrollView style={styles.scroll}>
        <Text style={styles.description}>{message}</Text>

        <Button
          label="再設定"
          onPress={() => {}}
          color={appStyles.button.color}
          style={styles.button}
          height={appStyles.button.height}
          width={80}
          linearGradient
          options={{ colors: appStyles.button.gradientColors }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: appStyles.app.paddingHorizontal,
    paddingVertical: appStyles.app.paddingVertical,
  },
  description: {
    fontSize: appStyles.body.fontSize,
    lineHeight: appStyles.body.lineHeight,
    fontFamily: 'Roboto',
  },
  button: {
    alignSelf: 'center',
    marginTop: 24,
  },
});
