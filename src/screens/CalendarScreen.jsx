import React, { useRef, useState } from 'react';
import {
  ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SegmentedPicker from 'react-native-segmented-picker';

import AppBar from '../components/AppBar';
import Button from '../components/Button';
import Calendar from '../components/Calendar';
import { appStyles } from '../style';
import { DATE_SEPARATOR } from '../helpers';

export default function CalendarScreen() {
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
    <View style={styles.container}>
      <StatusBar barStyle={appStyles.statusbar.barStyle} />

      <AppBar
        title="カレンダー"
        left={(
          <Button
            label="三"
            onPress={() => {}}
            backgroundColor={appStyles.appbarButton.backgroundColor}
            color={appStyles.appbarButton.color}
          />
        )}
      />

      <LinearGradient
        colors={appStyles.calendarHeader.gradientColors}
        style={styles.header}
      >
        <View style={styles.monthInput}>
          <Button
            label={`${year} ${DATE_SEPARATOR} ${month} _`}
            onPress={() => {
              refPicker.current.show();
            }}
            backgroundColor={appStyles.calendarHeaderButton.backgroundColor}
            fontSize={18}
            fontWeight="bold"
            height={appStyles.calendarHeader.height - appStyles.calendarHeader.paddingVertical * 2}
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
              label="<"
              onPress={() => setPreviousMonth()}
              backgroundColor={appStyles.calendarHeaderButton.backgroundColor}
              color={appStyles.calendarHeader.color}
              height={appStyles.calendarHeader.height
                - appStyles.calendarHeader.paddingVertical * 2}
            />
          </View>
        )}

        {year === currentYear + yearPickerDataCount && month === 12 ? null : (
          <View style={styles.headerRight}>
            <Button
              label=">"
              onPress={() => setNextMonth()}
              backgroundColor={appStyles.calendarHeaderButton.backgroundColor}
              color={appStyles.calendarHeader.color}
              height={appStyles.calendarHeader.height
                - appStyles.calendarHeader.paddingVertical * 2}
            />
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.calendar}>
        <Calendar year={year} month={month - 1} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: appStyles.app.backgroundColor,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    height: appStyles.calendarHeader.height,
    justifyContent: 'center',
  },
  headerLeft: {
    bottom: appStyles.calendarHeader.paddingVertical,
    justifyContent: 'center',
    left: appStyles.calendarHeader.paddingHorizontal,
    position: 'absolute',
  },
  headerRight: {
    bottom: appStyles.calendarHeader.paddingVertical,
    justifyContent: 'center',
    position: 'absolute',
    right: appStyles.calendarHeader.paddingHorizontal,
  },
  monthInput: {
    alignSelf: 'center',
  },
  calendar: {
    paddingTop: appStyles.calendarHeader.marginBottom,
  },
});