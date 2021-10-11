import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { bool, func, string } from 'prop-types';

import CheckBox from './CheckBox';
import ListItem from './ListItem';

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
        colors: ['rgba(255, 255, 255, 0.9)', 'rgba(238, 238, 255, 0.9)'],
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
});
