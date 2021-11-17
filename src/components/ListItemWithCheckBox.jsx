import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { bool, func, string } from 'prop-types';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Icon from './Icon';
import ListItem from './ListItem';

export default function ListItemWithCheckBox(props) {
  const {
    title,
    subtitle,
    checked,
    showCheckBox,
    onPressWithCheckBox,
    onPressWithoutCheckBox,
    timeout,
  } = props;
  const { theme } = useContext(GlobalContext);
  const gradientColors = appTheme[theme].gradientColors3;
  const textColor = appTheme[theme].colorOnGradientColor3;

  return (
    <ListItem
      title={(
        <View style={styles.container}>
          <View style={styles.left}>
            <Text
              style={[
                styles.title,
                { color: textColor },
                timeout ? styles.timeout : null,
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: textColor },
                  timeout ? styles.timeout : null,
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {showCheckBox ? (
            <View style={styles.right}>
              {checked
                ? <Icon name="checkbox-checked" size={24} color="#f00" />
                : <Icon name="checkbox-unchecked" size={24} color="#000" />}
            </View>
          ) : null}
        </View>
      )}
      onPress={showCheckBox ? onPressWithCheckBox : onPressWithoutCheckBox}
      linearGradient
      options={{ colors: gradientColors }}
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
  timeout: bool,
};

ListItemWithCheckBox.defaultProps = {
  subtitle: null,
  checked: false,
  showCheckBox: true,
  onPressWithCheckBox: () => {},
  onPressWithoutCheckBox: () => {},
  timeout: false,
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
    width: '20%',
  },
  title: {
    fontSize: 18,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 24,
    paddingStart: 8,
  },
  timeout: {
    color: '#f00',
  },
});
