import React from 'react';
import {
  ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';

import ListItem from '../components/ListItem';
import { appStyles } from '../style';

export default function SettingBackgroundImageScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <ScrollView>
        <ListItem
          title="画像をアップロード"
          onPress={() => {}}
          style={{
            color: appStyles.uploadButton.color,
            fontSize: appStyles.uploadButton.fontSize,
            height: appStyles.uploadButton.height,
          }}
        />

        <ListItem
          title="画像を削除"
          onPress={() => {}}
          style={{
            color: appStyles.deleteButton.color,
            fontSize: appStyles.uploadButton.fontSize,
            height: appStyles.uploadButton.height,
          }}
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
});
