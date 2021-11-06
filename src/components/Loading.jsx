import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { bool } from 'prop-types';

import { ThemeContext } from '../contexts';
import { appStyles } from '../style';

export default function Loading(props) {
  const { theme } = useContext(ThemeContext);
  const { isLoading } = props;

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).inner}>
        <ActivityIndicator size="large" color={appStyles(theme).loading.color} />
      </View>
    </View>
  );
}

Loading.propTypes = {
  isLoading: bool,
};

Loading.defaultProps = {
  isLoading: false,
};

const styles = (theme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: appStyles(theme).loading.backgroundColor,
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    zIndex: appStyles(theme).loading.zIndex,
  },
  inner: {
    marginBottom: appStyles(theme).appbar.height / 2,
  },
});
