import React, { useContext, useState } from 'react';
import {
  Platform,
  StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {
  func, instanceOf, oneOf, string,
} from 'prop-types';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from './Button';
import { date2string } from '../helpers';

export default function DateTimeInput(props) {
  const {
    label, mode, onChange, value,
  } = props;
  const { theme } = useContext(GlobalContext);
  const backgroundColor = appTheme[theme].backgroundColor2;
  const textColor = appTheme[theme].colorOnBackgroundColor2;

  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={[
          styles.container,
          { backgroundColor },
        ]}
      >
        <Text style={[styles.text, { color: textColor }]}>{label}</Text>
        {showPicker && Platform.OS === 'ios'
          ? (
            <Button
              label="OK"
              onPress={() => setShowPicker(false)}
              backgroundColor={backgroundColor}
              height={32}
            />
          ) : (
            <Text
              style={[
                styles.text,
                { color: textColor },
              ]}
            >
              {date2string(value, mode, true)}
            </Text>
          )}
      </TouchableOpacity>

      {showPicker ? (
        <RNDateTimePicker
          value={value}
          mode={mode}
          is24Hour
          display={mode === 'date' && Platform.OS === 'android' ? 'calendar' : 'spinner'}
          locale="ja-JP"
          style={{ backgroundColor }}
          onChange={(event, selectedValue) => {
            setShowPicker(Platform.OS === 'ios');
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
    borderBottomColor: 'rgba(0, 0, 0, 0.25)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
    width: '100%',
  },
  text: {
    fontSize: 18,
  },
});
