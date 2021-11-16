import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { bool, func, string } from 'prop-types';

import { GlobalContext } from '../contexts';
import ListItem from './ListItem';
import { appStyles } from '../style';

export default function ListItemWithCheckBox(props) {
  const { theme } = useContext(GlobalContext);
  const {
    title,
    subtitle,
    checked,
    showCheckBox,
    onPressWithCheckBox,
    onPressWithoutCheckBox,
    destructive,
  } = props;

  return (
    <ListItem
      title={(
        <View style={styles(theme).container}>
          <View style={styles(theme).left}>
            <Text
              style={[
                styles(theme).title,
                destructive ? styles(theme).destructive : null,
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles(theme).subtitle,
                  destructive ? styles(theme).destructive : null,
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {showCheckBox ? (
            <View style={styles(theme).right}>
              {checked
                ? <Text style={styles(theme).checked}>[*]</Text>
                : <Text style={styles(theme).unchecked}>[  ]</Text>}
            </View>
          ) : null}
        </View>
      )}
      onPress={showCheckBox ? onPressWithCheckBox : onPressWithoutCheckBox}
      linearGradient
      options={{
        colors: appStyles(theme).listItemWithCheckBox.gradientColors,
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
  destructive: bool,
};

ListItemWithCheckBox.defaultProps = {
  subtitle: null,
  checked: false,
  showCheckBox: true,
  onPressWithCheckBox: () => {},
  onPressWithoutCheckBox: () => {},
  destructive: false,
};

const styles = (theme) => StyleSheet.create({
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
    width: appStyles(theme).listItemRight.width,
  },
  title: {
    fontSize: appStyles(theme).listItemTitle.fontSize,
    lineHeight: appStyles(theme).listItemTitle.lineHeight,
  },
  subtitle: {
    fontSize: appStyles(theme).listItemSubTitle.fontSize,
    lineHeight: appStyles(theme).listItemSubTitle.lineHeight,
    paddingStart: appStyles(theme).listItemSubTitle.paddingStart,
  },
  checked: {
    color: appStyles(theme).checkbox.checkedColor,
    fontSize: appStyles(theme).checkbox.fontSize,
  },
  unchecked: {
    color: appStyles(theme).checkbox.uncheckedColor,
    fontSize: appStyles(theme).checkbox.fontSize,
  },
  destructive: {
    color: appStyles(theme).destructive.color,
  },
});
