import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { bool } from 'prop-types';

import { appStyles } from '../style';

export default function Loading(props) {
  const { isLoading } = props;

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <ActivityIndicator size="large" color={appStyles.loading.color} />
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: appStyles.loading.backgroundColor,
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    zIndex: appStyles.loading.zIndex,
  },
  inner: {
    marginBottom: appStyles.appbar.height / 2,
  },
});
