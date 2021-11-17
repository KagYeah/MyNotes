import React, { useContext, useState } from 'react';
import {
  FlatList, ImageBackground, StyleSheet, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import Icon from '../components/Icon';
import ListItem from '../components/ListItem';
import { getHexFromColor } from '../helpers';

export default function SettingMainColorScreen() {
  const { theme, setTheme, backgroundImage } = useContext(GlobalContext);
  const [color, setColor] = useState(theme);

  const colors = [
    'pink',
    'red',
    'orange',
    'yellow',
    'green',
    'lightBlue',
    'blue',
    'purple',
    'navy',
  ];

  return (
    <View style={{ flex: 1, backgroundColor: appTheme[theme].appBackgroundColor }}>
      <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={{ flex: 1 }}>

        <FlatList
          data={colors}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ListItem
              title={(
                <View style={styles.labelContainer}>
                  <View
                    style={[styles.colorPod, { backgroundColor: getHexFromColor(item) }]}
                  />
                  {item === color ? <Icon name="check" size={24} color="#0f0" /> : null}
                </View>
              )}
              onPress={async () => {
                setColor(item);
                setTheme(item);
                await AsyncStorage.setItem('@theme', item);
              }}
              style={{ height: 48 }}
            />
          )}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorPod: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
});
