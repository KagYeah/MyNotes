import React from 'react';
import {
  ScrollView, StatusBar, StyleSheet, Text, View,
} from 'react-native';

import Button from '../components/Button';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen(props) {
  const { navigation } = props;
  const message = 'すでにID「abc123」で設定しています。設定し直す場合は、以下の「再設定」ボタンを押してください。';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <ScrollView style={styles.scroll}>
        <Text style={styles.description}>{message}</Text>

        <Button
          label="再設定"
          onPress={() => {
            navigation.goBack();
          }}
          color={appStyles.buttonMedium.color}
          style={styles.button}
          height={appStyles.buttonMedium.height}
          width={appStyles.buttonMedium.width}
          linearGradient
          options={{ colors: appStyles.buttonMedium.gradientColors }}
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
  },
  button: {
    alignSelf: 'center',
    marginTop: appStyles.buttonMedium.margin,
  },
});
