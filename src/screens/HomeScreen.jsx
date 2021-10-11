import React, { useState } from 'react';
import {
  StyleSheet, View, StatusBar, SectionList,
} from 'react-native';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import CircleButton from '../components/CircleButton';
import ListHeader from '../components/ListHeader';
import ListItemWithCheckBox from '../components/ListItemWithCheckBox';
import { appStyles } from '../style';

export default function HomeScreen() {
  const schedules = [];
  for (let i = 0; i < 10; i += 1) {
    schedules.push({
      id: i,
      title: 'ミーディング',
      subtitle: '10:00~12:00',
    });
  }

  const tasks = [];
  for (let i = 0; i < 10; i += 1) {
    tasks.push({
      id: i,
      title: '宿題',
      subtitle: '期限 12:00',
    });
  }

  const listData = [
    {
      title: '今日の予定',
      data: schedules,
    },
    {
      title: '今日のタスク',
      data: tasks,
    },
  ];

  const [showCheckBox, setShowCheckBox] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AppBar
        title="ホーム"
        left={(
          <Button
            label="三"
            onPress={() => {}}
            backgroundColor={appStyles.appbarButton.backgroundColor}
            color={appStyles.appbarButton.color}
          />
        )}
        right={(
          <Button
            label={showCheckBox ? '完了' : '編集'}
            onPress={() => setShowCheckBox(!showCheckBox)}
            backgroundColor={appStyles.appbarButton.backgroundColor}
            color={appStyles.appbarButton.color}
          />
        )}
      />

      <SectionList
        sections={listData}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <ListItemWithCheckBox
            title={item.title}
            subtitle={item.subtitle}
            showCheckBox={showCheckBox}
            onPressWithCheckBox={() => {}}
            onPressWithoutCheckBox={() => {}}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <ListHeader
            left={title}
            right={!showCheckBox ? null : (
              <Button
                label="削除"
                onPress={() => {}}
                backgroundColor={appStyles.deleteButton.backgroundColor}
                padding={0}
                height={appStyles.listHeader.height - (appStyles.listHeader.paddingVertical * 2)}
                color={appStyles.deleteButton.color}
                fontWeight={appStyles.deleteButton.fontWeight}
              />
            )}
          />
        )}
      />

      <CircleButton
        label="＋"
        onPress={() => {}}
        style={{
          bottom: appStyles.createButton.bottom,
          position: 'absolute',
          right: appStyles.createButton.right,
        }}
        size={appStyles.circleButton.size}
        fontSize={appStyles.createButton.fontSize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyles.app.backgroundColor,
  },
});
