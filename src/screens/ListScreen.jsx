import React, { useRef, useState } from 'react';
import {
  Animated, FlatList, StatusBar, StyleSheet, View,
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
import { sleep } from '../helpers';

export default function ListScreen(props) {
  const { data, title } = props;
  const [showCheckBox, setShowCheckBox] = useState(false);
  const [checked, setChecked] = useState(false);
  const listTranslateY = useRef(new Animated.Value(0)).current;

  async function toggleListHeader() {
    if (!showCheckBox) {
      Animated.timing(listTranslateY, {
        toValue: appStyles.listHeader.height,
        duration: 500,
        useNativeDriver: true,
      }).start();

      return sleep(0);
    }

    Animated.timing(listTranslateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return sleep(500);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <AppBar
        title={title}
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
            onPress={async () => {
              await toggleListHeader();
              setShowCheckBox(!showCheckBox);
            }}
            backgroundColor={appStyles.appbarButton.backgroundColor}
            color={appStyles.appbarButton.color}
          />
        )}
      />

      {showCheckBox ? (
        <Animated.View
          style={[
            styles.listHeader,
            { transform: [{ translateY: listTranslateY }] },
          ]}
        >
          <ListHeader
            left={(
              <View style={styles.listHeaderLeft}>
                <Button
                  label="全て選択"
                  onPress={() => setChecked(true)}
                  backgroundColor={appStyles.allCheckButton.backgroundColor}
                  color={appStyles.allCheckButton.color}
                  height={appStyles.listHeader.height - appStyles.listHeader.paddingVertical}
                  width={appStyles.allCheckButton.width}
                />
                <Button
                  label="全て解除"
                  onPress={() => setChecked(false)}
                  backgroundColor={appStyles.allCheckButton.backgroundColor}
                  color={appStyles.allCheckButton.color}
                  height={appStyles.listHeader.height - appStyles.listHeader.paddingVertical}
                  width={appStyles.allCheckButton.width}
                />
              </View>
            )}
            right={(
              <Button
                label="削除"
                onPress={() => {}}
                backgroundColor={appStyles.deleteButtonInListHeader.backgroundColor}
                padding={0}
                height={appStyles.listHeader.height - (appStyles.listHeader.paddingVertical * 2)}
                color={appStyles.deleteButtonInListHeader.color}
                fontWeight={appStyles.deleteButtonInListHeader.fontWeight}
              />
            )}
          />
        </Animated.View>
      ) : null}

      <Animated.View
        style={[
          styles.listWrapper,
          { transform: [{ translateY: listTranslateY }] },
        ]}
      >
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.id}`}
          renderItem={({ item }) => (
            <ListItemWithCheckBox
              title={item.title}
              subtitle={item.subtitle}
              showCheckBox={showCheckBox}
              checked={checked}
              onPressWithCheckBox={() => {}}
              onPressWithoutCheckBox={() => {}}
            />
          )}
        />
      </Animated.View>

      <CreateButton onPress={() => {}} />
    </View>
  );
}

ListScreen.propTypes = {
  data: arrayOf(shape({
    id: oneOfType([number, string]).isRequired,
    title: string.isRequired,
    subtitle: string,
  })).isRequired,
  title: string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  listWrapper: {
    flex: 1,
  },
  listHeader: {
    top: appStyles.appbar.height - appStyles.listHeader.height,
    position: 'absolute',
    width: '100%',
  },
  listHeaderLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});
