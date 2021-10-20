import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, StatusBar, SectionList,
} from 'react-native';
import {
  arrayOf, number, oneOfType, shape, string,
} from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import Button from '../components/Button';
import CreateButton from '../components/CreateButton';
import DeleteButton from '../components/DeleteButton';
import ListHeader from '../components/ListHeader';
import ListItemWithCheckBox from '../components/ListItemWithCheckBox';
import { appStyles } from '../style';
import { capitalize } from '../helpers';

export default function DailyNoteListScreen(props) {
  const navigation = useNavigation();
  const { data, appbarTitle } = props;
  const [showCheckBox, setShowCheckBox] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: appbarTitle,
      headerRight: (
        <Button
          label={showCheckBox ? '完了' : '編集'}
          onPress={() => setShowCheckBox(!showCheckBox)}
          backgroundColor={appStyles.appbarButton.backgroundColor}
          color={appStyles.appbarButton.color}
        />
      ),
    });
  }, [showCheckBox]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SectionList
        sections={data}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item, section: { type } }) => (
          <ListItemWithCheckBox
            title={item.title}
            subtitle={item.subtitle}
            showCheckBox={showCheckBox}
            onPressWithCheckBox={() => {}}
            onPressWithoutCheckBox={() => {
              navigation.navigate(`${capitalize(type)}Edit`);
            }}
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

      <CreateButton
        onPress={() => {
          navigation.navigate('MemoCreate');
        }}
      />
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
