import React, { useState } from 'react';
import {
  Platform,
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {
  func, instanceOf, oneOf, string,
} from 'prop-types';

import Button from './Button';
import { appStyles } from '../style';
import { date2string, time2string } from '../helpers';

export default function DateTimeInput(props) {
  const {
    label, mode, onChange, value,
  } = props;
  const [_value, setValue] = useState(value);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.container}
      >
        <Text style={styles.text}>{label}</Text>
        {showPicker && Platform.OS === 'ios'
          ? (
            <Button
              label="OK"
              onPress={() => setShowPicker(false)}
              backgroundColor={styles.container.backgroundColor}
              height={styles.container.height - styles.container.paddingVertical}
            />
          ) : (
            <Text style={styles.text}>{mode === 'date' ? date2string(_value, true) : time2string(_value)}</Text>
          )}
      </TouchableOpacity>

      {showPicker ? (
        <RNDateTimePicker
          value={_value}
          mode={mode}
          is24Hour
          display={mode === 'date' && Platform.OS === 'android' ? 'calendar' : 'spinner'}
          locale="ja-JP"
          style={styles.picker}
          onChange={(event, selectedValue) => {
            setShowPicker(Platform.OS === 'ios');
            setValue(selectedValue || _value);
            onChange(selectedValue);
          }}
        />
      ) : null}
    </>
  );
}

DateTimeInput.propTypes = {
  label: string.isRequired,
  mode: oneOf(['date', 'time']).isRequired,
  onChange: func,
  value: instanceOf(Date).isRequired,
};

DateTimeInput.defaultProps = {
  onChange: () => {},
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: appStyles.datetimeInput.backgroundColor,
    borderBottomColor: appStyles.datetimeInput.borderBottomColor,
    borderBottomWidth: appStyles.datetimeInput.borderBottomWidth,
    flexDirection: 'row',
    height: appStyles.datetimeInput.height,
    justifyContent: 'space-between',
    paddingHorizontal: appStyles.datetimeInput.paddingHorizontal,
    paddingVertical: appStyles.datetimeInput.paddingVertical,
    width: '100%',
  },
  text: {
    color: appStyles.datetimeInput.color,
    fontSize: appStyles.datetimeInput.fontSize,
  },
  picker: {
    backgroundColor: appStyles.datetimePicker.backgroundColor,
  },
});
