import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { func } from 'prop-types';

import { GlobalContext } from '../contexts';
import appTheme from '../style/theme';
import CircleButton from './CircleButton';
import Icon from './Icon';

export default function CreateButton(props) {
  const { onPress } = props;
  const { theme } = useContext(GlobalContext);

  return (
    <CircleButton
      label={<Icon name="check" size={32} color={appTheme[theme].colorOnGradientColors1} />}
      onPress={onPress}
      style={styles.button}
      size={48}
    />
  );
}

CreateButton.propTypes = {
  onPress: func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});
