import React, { useState } from 'react';
import {
  StyleSheet, View, StatusBar, SectionList,
} from 'react-native';
import {
  arrayOf, number, oneOfType, shape, string,
} from 'prop-types';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import CreateButton from '../components/CreateButton';
import ListHeader from '../components/ListHeader';
import ListItemWithCheckBox from '../components/ListItemWithCheckBox';
import { appStyles } from '../style';
import DeleteButton from '../components/DeleteButton';

export default function DailyNoteListScreen(props) {
  const { data, appbarTitle } = props;
  const [showCheckBox, setShowCheckBox] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AppBar
        title={appbarTitle}
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
        sections={data}
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
              <DeleteButton
                onPress={() => {}}
                height={appStyles.deleteButtonInListHeader.height}
                width={appStyles.deleteButtonInListHeader.width}
              />
            )}
          />
        )}
      />

      <CreateButton onPress={() => {}} />
    </View>
  );
}

DailyNoteListScreen.propTypes = {
  data: arrayOf(shape({
    title: string.isRequired,
    data: arrayOf(shape({
      id: oneOfType([number, string]),
      title: string.isRequired,
      subtitle: string,
    })).isRequired,
  })).isRequired,
  appbarTitle: string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appStyles.app.backgroundColor,
  },
});
