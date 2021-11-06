import React, { useContext } from 'react';
import {
  ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';

import { ThemeContext } from '../contexts';
import ListItem from '../components/ListItem';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles(theme).container}>
      <StatusBar barStyle={appStyles(theme).statusbar.barStyle} />

      <ScrollView>
        <ListItem
          title="画像をアップロード"
          onPress={() => {}}
          style={{
            color: appStyles(theme).uploadButton.color,
            fontSize: appStyles(theme).uploadButton.fontSize,
            height: appStyles(theme).uploadButton.height,
          }}
        />

        <ListItem
          title="画像を削除"
          onPress={() => {}}
          style={{
            color: appStyles(theme).deleteButton.color,
            fontSize: appStyles(theme).uploadButton.fontSize,
            height: appStyles(theme).uploadButton.height,
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: appStyles(theme).app.backgroundColor,
    flex: 1,
  },
});
