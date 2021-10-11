import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { bool, func, string } from 'prop-types';

import CheckBox from './CheckBox';
import ListItem from './ListItem';
import { appStyles } from '../style';

export default function ListItemWithCheckBox(props) {
  const {
    title, subtitle, showCheckBox, onPressWithCheckBox, onPressWithoutCheckBox,
  } = props;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [showCheckBox]);

  return (
    <ListItem
      title={(
        <View style={styles.container}>
          <View style={styles.left}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {showCheckBox ? (
            <View style={styles.right}>
              <CheckBox checked={checked} onPress={() => onPressWithCheckBox()} />
            </View>
          ) : null}
        </View>
      )}
      onPress={
        showCheckBox
          ? () => {
            onPressWithCheckBox();
            setChecked(!checked);
          }
          : () => onPressWithoutCheckBox()
      }
      linearGradient
      options={{
        colors: appStyles.listItemWithCheckBox.gradientColors,
      }}
    />
  );
}

ListItemWithCheckBox.propTypes = {
  title: string.isRequired,
  subtitle: string,
  showCheckBox: bool,
  onPressWithCheckBox: func,
  onPressWithoutCheckBox: func,
};

ListItemWithCheckBox.defaultProps = {
  subtitle: null,
  showCheckBox: true,
  onPressWithCheckBox: () => {},
  onPressWithoutCheckBox: () => {},
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
    width: appStyles.listItemRight.width,
  },
  title: {
    fontSize: appStyles.listItemTitle.fontSize,
    lineHeight: appStyles.listItemTitle.lineHeight,
  },
  subtitle: {
    fontSize: appStyles.listItemSubTitle.fontSize,
    lineHeight: appStyles.listItemSubTitle.lineHeight,
    paddingStart: appStyles.listItemSubTitle.paddingStart,
  },
});
