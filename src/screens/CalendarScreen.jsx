import React, { useContext, useRef, useState } from 'react';
import {
  ImageBackground, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SegmentedPicker from 'react-native-segmented-picker';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Button from '../components/Button';
import Calendar from '../components/Calendar';
import Icon from '../components/Icon';
import { DATE_SEPARATOR } from '../constants';

export default function CalendarScreen() {
  const { theme, backgroundImage } = useContext(GlobalContext);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth + 1);

  const refPicker = useRef();
  const yearPickerDataCount = 100;
  const yearPickerData = [];
  const monthPickerData = [];

  for (let y = currentYear; y < currentYear + yearPickerDataCount; y += 1) {
    yearPickerData.push({ label: y.toString(), value: y.toString() });
  }

  for (let m = 1; m <= 12; m += 1) {
    monthPickerData.push({ label: m.toString(), value: m.toString() });
  }

  const pickerData = [
    {
      key: 'year',
      items: yearPickerData,
    },
    {
      key: 'month',
      items: monthPickerData,
    },
  ];

  function setPreviousMonth() {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function setNextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <LinearGradient
          colors={appTheme[theme].gradientColors2}
          style={styles.header}
        >
          <View style={styles.monthInput}>
            <Button
              label={(
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.headerTitle,
                      { color: appTheme[theme].colorOnGradientColors2 },
                    ]}
                  >
                    {`${year} ${DATE_SEPARATOR} ${month} `}
                  </Text>
                  <Icon name="arrow-down" size={12} color={appTheme[theme].colorOnGradientColors2} />
                </View>
              )}
              onPress={() => {
                refPicker.current.show();
              }}
              backgroundColor="#0000"
              fontSize={18}
              fontWeight="bold"
              height={32}
              width={200}
            />

            <SegmentedPicker
              ref={refPicker}
              confirmText="OK"
              defaultSelections={{ year: year.toString(), month: month.toString() }}
              onConfirm={(values) => {
                setYear(Number(values.year));
                setMonth(Number(values.month));
              }}
              options={pickerData}
            />
          </View>

          {year === currentYear && month === 1 ? null : (
            <View style={styles.headerLeft}>
              <Button
                label={<Icon name="arrow-left" size={24} color={appTheme[theme].colorOnGradientColor2} />}
                onPress={setPreviousMonth}
                backgroundColor="#0000"
                color={appTheme[theme].colorOnGradientColor2}
                height={32}
              />
            </View>
          )}

          {year === currentYear + yearPickerDataCount && month === 12 ? null : (
            <View style={styles.headerRight}>
              <Button
                label={<Icon name="arrow-right" size={24} color={appTheme[theme].colorOnGradientColor2} />}
                onPress={setNextMonth}
                backgroundColor="#0000"
                color={appTheme[theme].colorOnGradientColor2}
                height={32}
              />
            </View>
          )}
        </LinearGradient>

        <ScrollView style={styles.calendar}>
          <Calendar year={year} month={month - 1} />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 18,
  },
  headerLeft: {
    position: 'absolute',
    bottom: 8,
    left: 24,
    justifyContent: 'center',
  },
  headerRight: {
    position: 'absolute',
    bottom: 8,
    right: 24,
    justifyContent: 'center',
  },
  monthInput: {
    alignSelf: 'center',
  },
  calendar: {
    paddingTop: 48,
  },
});
