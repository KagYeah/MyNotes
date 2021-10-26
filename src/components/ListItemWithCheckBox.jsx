import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { bool, func, string } from 'prop-types';

import ListItem from './ListItem';
import { appStyles } from '../style';

export default function ListItemWithCheckBox(props) {
  const {
    title, subtitle, checked, showCheckBox, onPressWithCheckBox, onPressWithoutCheckBox,
  } = props;

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
              {checked
                ? <Text style={styles.checked}>[*]</Text>
                : <Text style={styles.unchecked}>[  ]</Text>}
            </View>
          ) : null}
        </View>
      )}
      onPress={showCheckBox ? onPressWithCheckBox : onPressWithoutCheckBox}
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
  checked: bool,
  showCheckBox: bool,
  onPressWithCheckBox: func,
  onPressWithoutCheckBox: func,
};

ListItemWithCheckBox.defaultProps = {
  subtitle: null,
  checked: false,
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
  checked: {
    color: appStyles.checkbox.checkedColor,
    fontSize: appStyles.checkbox.fontSize,
  },
  unchecked: {
    color: appStyles.checkbox.ucheckedColor,
    fontSize: appStyles.checkbox.fontSize,
  },
});
