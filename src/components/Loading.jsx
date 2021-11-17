import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { bool } from 'prop-types';

export default function Loading(props) {
  const { isLoading } = props;

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <ActivityIndicator size="large" color="#000" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    zIndex: 10,
  },
  inner: {
    marginBottom: 54,
  },
});
