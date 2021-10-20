import React from 'react';
import {
  StatusBar, StyleSheet, View,
} from 'react-native';

import Button from '../components/Button';
import { appStyles } from '../style';

export default function InitialStartingScreen(props) {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <View style={styles.centeredView}>
        <Button
          label="はじめる"
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Root', params: { screen: 'Home' } }],
            });
          }}
          color={appStyles.buttonLarge.color}
          height={appStyles.buttonLarge.height}
          width={appStyles.buttonLarge.width}
          linearGradient
          options={{ colors: appStyles.buttonLarge.gradientColors }}
        />

        <Button
          label="機種変更"
          onPress={() => {
            navigation.navigate('InitialSetting');
          }}
          color={appStyles.buttonLarge.color}
          style={{ marginTop: appStyles.buttonLarge.margin }}
          height={appStyles.buttonLarge.height}
          width={appStyles.buttonLarge.width}
          linearGradient
          options={{ colors: appStyles.buttonLarge.gradientColors }}
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
